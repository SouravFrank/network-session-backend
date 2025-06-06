/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest, Request } from "firebase-functions/v2/https";
import type { Response } from "express";
import * as logger from "firebase-functions/logger";
import { saveNetworkUsageData } from './services';
import { getNetworkUsageDataFromDB } from "./databaseHelpers";
import { ApiResponse, UpdateNetworkUsageRequestBody } from "./types";

// GET network usage data
export const getNetworkUsage = onRequest(async (req: Request, res: Response<ApiResponse>) => {
  try {
    const data = await getNetworkUsageDataFromDB();
    res.status(200).json({ data });
  } catch (error) {
    logger.error('Error fetching usage data:', error);
    res.status(500).json({ error: 'Failed to fetch usage data' });
  }
});

// POST network usage data
export const updateNetworkUsage = onRequest(async (req: Request, res: Response<ApiResponse>) => {
  const body = req.body as UpdateNetworkUsageRequestBody;

  if (!body || typeof body.html !== 'string' || !body.html.trim()) {
    res.status(400).json({ error: 'Missing or invalid html in request body' });
    return;
  }

  try {
    const mergedData = await saveNetworkUsageData(body.html);
    logger.info('Parsed and deduped usage data:', mergedData);
    res.status(201).json({ message: 'Usage data processed successfully', data: mergedData });
  } catch (error) {
    logger.error('Error processing usage data:', error);
    res.status(500).json({ error: 'Failed to process usage data' });
  }
});