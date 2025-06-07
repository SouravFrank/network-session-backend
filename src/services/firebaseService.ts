import { ref, get, set, DatabaseReference } from 'firebase/database';
import { db } from '../firebase';
import type { UsageData } from '../types/usageData';

// Path in the database
const USAGE_DB_PATH = '/networkUsageData';

/**
 * Fetches network usage data from the database.
 * @return {Promise<UsageData[]>} Promise resolving to an array of UsageData.
 */
export async function getNetworkUsageDataFromDB(): Promise<UsageData[]> {
  try {
    const usageRef: DatabaseReference = ref(db, USAGE_DB_PATH);
    const snapshot = await get(usageRef);
    const data = snapshot.val();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    // Optionally log error here
    throw error;
  }
}

/**
 * Saves network usage data to the database.
 * @param {UsageData[]} data Array of UsageData to save.
 * @return {Promise<UsageData[]>} Promise resolving to the saved data.
 */
export async function saveNetworkUsageDataToDB(
  data: UsageData[],
): Promise<UsageData[]> {
  try {
    const usageRef: DatabaseReference = ref(db, USAGE_DB_PATH);
    await set(usageRef, data);
    return data;
  } catch (error) {
    // Optionally log error here
    throw error;
  }
}