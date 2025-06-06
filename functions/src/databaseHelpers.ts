import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions/v2';

const USAGE_DB_PATH = '/networkUsageData';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
  logger.info('Firebase Admin SDK initialized');
}

export async function getNetworkUsageDataFromDB() {
  logger.info('Fetching network usage data from database');
  try {
    const snapshot = await admin.database().ref(USAGE_DB_PATH).once('value');
    const data = snapshot.val() || [];
    logger.info(`Retrieved ${Array.isArray(data) ? data.length : 0} usage records`);
    return data;
  } catch (error) {
    logger.error('Failed to fetch network usage data', error);
    throw error;
  }
}

export async function saveNetworkUsageDataToDB(data: any) {
  logger.info(`Saving ${Array.isArray(data) ? data.length : 0} usage records to database`);
  try {
    await admin.database().ref(USAGE_DB_PATH).set(data);
    logger.info('Successfully saved network usage data');
    return data;
  } catch (error) {
    logger.error('Failed to save network usage data', error);
    throw error;
  }
}