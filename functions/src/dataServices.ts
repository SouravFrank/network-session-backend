import * as admin from 'firebase-admin';
import { UsageData } from './typs';

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.database();
const USAGE_DATA_PATH = '/usageData';

export async function getUsageDataFromDB(): Promise<UsageData[]> {
  const snapshot = await db.ref(USAGE_DATA_PATH).once('value');
  const data = snapshot.val();
  if (!data) return [];
  return Object.values(data) as UsageData[];
}

export async function addUsageDataToDB(newData: UsageData[]): Promise<{ success: boolean; message: string; count: number } | { error: string }> {
  try {
    const snapshot = await db.ref(USAGE_DATA_PATH).once('value');
    const existingData: UsageData[] = snapshot.val() ? Object.values(snapshot.val()) : [];
    // Merge and deduplicate by loginTime
    const dataMap = new Map(existingData.map(item => [item.loginTime, item]));
    newData.forEach(item => {
      dataMap.set(item.loginTime, item);
    });
    const mergedData = Array.from(dataMap.values())
      .sort((a, b) => new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime());
    // Store as an object with loginTime as key
    const updates: { [key: string]: UsageData } = {};
    mergedData.forEach(item => {
      updates[item.loginTime] = item;
    });
    await db.ref(USAGE_DATA_PATH).set(updates);
    return { success: true, message: 'Data added and merged successfully', count: mergedData.length };
  } catch (error: any) {
    return { error: error.message || 'Failed to add data' };
  }
}