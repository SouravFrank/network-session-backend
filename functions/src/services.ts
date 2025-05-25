import * as admin from 'firebase-admin';
import { parseHtmlContent, mergeData } from './utils';

const USAGE_DB_PATH = '/networkUsageData';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

export async function getNetworkUsageData() {
  const snapshot = await admin.database().ref(USAGE_DB_PATH).once('value');
  return snapshot.val() || [];
}

export async function saveNetworkUsageData(html: string) {
  const existingData = await getNetworkUsageData();
  const parsedData = parseHtmlContent(html);
  const mergedData = mergeData(existingData, parsedData);
  await admin.database().ref(USAGE_DB_PATH).set(mergedData);
  return mergedData;
}