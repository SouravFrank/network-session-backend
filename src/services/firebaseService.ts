import { ref, get, set, DatabaseReference } from 'firebase/database';
import { db } from '../firebase';
import type { UsageData } from '../types/usageData';
import logger from '../utils/logger';

// Path in the database
const USAGE_DB_PATH = '/networkUsageData';

/**
 * Fetches network usage data from the database.
 * @return {Promise<UsageData[]>} Promise resolving to an array of UsageData.
 */
export async function getNetworkUsageDataFromDB(): Promise<UsageData[]> {
  logger.info("Fetching network usage data from Firebase DB");
  try {
    const usageRef: DatabaseReference = ref(db, USAGE_DB_PATH);
    const snapshot = await get(usageRef);
    const data = snapshot.val();
    logger.info("Fetched data from Firebase DB", { count: Array.isArray(data) ? data.length : 0 });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    logger.error("Error fetching data from Firebase DB", error);
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
  logger.info("Saving network usage data to Firebase DB", { count: data.length });
  try {
    const usageRef: DatabaseReference = ref(db, USAGE_DB_PATH);
    await set(usageRef, data);
    logger.info("Saved network usage data to Firebase DB");
    return data;
  } catch (error) {
    logger.error("Error saving data to Firebase DB", error);
    throw error;
  }
}