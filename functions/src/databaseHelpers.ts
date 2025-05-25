import * as admin from 'firebase-admin';

const USAGE_DB_PATH = '/networkUsageData';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

export async function getNetworkUsageData() {
  const snapshot = await admin.database().ref(USAGE_DB_PATH).once('value');
  return snapshot.val() || [];
}

export async function saveNetworkUsageData(data: any) {
  await admin.database().ref(USAGE_DB_PATH).set(data);
  return data;
}