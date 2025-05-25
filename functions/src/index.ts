/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from 'firebase-functions';
import * as express from 'express';
import { Request, Response } from 'express';
import * as cors from 'cors';
import { getNetworkUsageData, saveNetworkUsageData } from './services';

const app = express();
app.use(cors({ origin: true }));

// GET network usage data
app.get('/network-usage', async (req: Request, res: Response) => {
  try {
    const data = await getNetworkUsageData();
    res.status(200).send({ data });
  } catch (error) {
    console.error('Error fetching usage data:', error);
    res.status(500).send({ error: 'Failed to fetch usage data' });
  }
});

// POST network usage data
app.post('/network-usage', express.json(), async (req: Request, res: Response) => {
  const { html } = req.body;
  if (!html || typeof html !== 'string') {
    return res.status(400).send({ error: 'Missing or invalid html in request body' });
  }
  try {
    const mergedData = await saveNetworkUsageData(html);
    console.info('Parsed and deduped usage data:', mergedData);
    res.status(201).send({ message: 'Usage data processed successfully', data: mergedData });
  } catch (error) {
    console.error('Error processing usage data:', error);
    res.status(500).send({ error: 'Failed to process usage data' });
  }
});

// Expose the Express app as a single Firebase Function
exports.api = functions.https.onRequest(app);