/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { getNetworkUsageData, saveNetworkUsageData } from './services';

// GET network usage data
export const getNetworkUsage = onRequest(async (req, res) => {
  try {
    const data = await getNetworkUsageData();
    res.status(200).json({ data });
  } catch (error) {
    logger.error('Error fetching usage data:', error);
    res.status(500).json({ error: 'Failed to fetch usage data' });
  }
});

// POST network usage data
export const updateNetworkUsage = onRequest(async (req, res) => {
  const { html } = req.body;
  if (!html || typeof html !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid html in request body' });
  }

  try {
    const mergedData = await saveNetworkUsageData(html);
    logger.info('Parsed and deduped usage data:', mergedData);
    res.status(201).json({ message: 'Usage data processed successfully', data: mergedData });
  } catch (error) {
    logger.error('Error processing usage data:', error);
    res.status(500).json({ error: 'Failed to process usage data' });
  }
});