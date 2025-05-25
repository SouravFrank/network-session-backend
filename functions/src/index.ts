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
import { parseHtmlContent, mergeData } from './utils';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors')({ origin: true }); // For handling CORS

const app = express();

// Automatically allow cross-origin requests
app.use(cors);

// In-memory store for demonstration (replace with DB in production)
let usageDataStore: any[] = [];

// GET network usage data
app.get('/network-usage', (req, res) => {
  res.status(200).send({ data: usageDataStore });
});

// POST network usage data
app.post('/network-usage', express.json(), (req, res) => {
  const { html } = req.body;
  if (!html || typeof html !== 'string') {
    return res.status(400).send({ error: 'Missing or invalid html in request body' });
  }
  try {
    const parsedData = parseHtmlContent(html);
    usageDataStore = mergeData(usageDataStore, parsedData);
    console.log('Parsed and deduped usage data:', usageDataStore);
    res.status(201).send({ message: 'Usage data processed successfully. '+ parsedData.length + " records received." });
  } catch (error) {
    res.status(500).send({ error: 'Failed to process usage data' });
  }
});

// Expose the Express app as a single Firebase Function
exports.api = functions.https.onRequest(app);