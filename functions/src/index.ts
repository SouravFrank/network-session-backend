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
import { fetchWishnetDataService } from './services';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const fetchWishnetData = onRequest(async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  try {
    const result = await fetchWishnetDataService();
    if ('error' in result) {
      logger.error('Error in fetchWishnetDataService', result);
      res.status(500).json(result);
    } else {
      res.json(result);
    }
  } catch (err: any) {
    logger.error('Unexpected error in fetchWishnetData', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});
