import * as admin from "firebase-admin";
import {logger} from "firebase-functions/v2";
import type {UsageData} from "./types";

const USAGE_DB_PATH = "/networkUsageData";

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
  logger.info("Firebase Admin SDK initialized");
}

/**
 * Fetches network usage data from the database.
 * @return {Promise<UsageData[]>} Promise resolving to an array of UsageData.
 */
export async function getNetworkUsageDataFromDB(): Promise<UsageData[]> {
  logger.info("Fetching network usage data from database");
  try {
    const snapshot = await admin.database().ref(USAGE_DB_PATH).once("value");
    const data = snapshot.val();
    logger.info(
      `Retrieved ${Array.isArray(data) ? data.length : 0} usage records`,
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    logger.error("Failed to fetch network usage data", error);
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
  logger.info(
    `Saving ${Array.isArray(data) ? data.length : 0} usage records to database`,
  );
  try {
    await admin.database().ref(USAGE_DB_PATH).set(data);
    logger.info("Successfully saved network usage data");
    return data;
  } catch (error) {
    logger.error("Failed to save network usage data", error);
    throw error;
  }
}
