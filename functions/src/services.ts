import { parseHtmlContent, mergeData } from './utils';
import { getNetworkUsageDataFromDB, saveNetworkUsageDataToDB } from './databaseHelpers';
import { logger } from 'firebase-functions/v2';
import type { UsageData } from './types';

/**
 * Parses HTML, merges with existing data, and saves to DB.
 * @param html HTML string containing usage data.
 * @returns Promise resolving to the merged and saved UsageData array.
 */
export async function saveNetworkUsageData(html: string): Promise<UsageData[]> {
  try {
    logger.info('Processing network usage data from HTML');
    const existingData = await getNetworkUsageDataFromDB();
    const parsedData = parseHtmlContent(html);
    const mergedData = mergeData(existingData, parsedData);
    logger.info(`Prepared ${mergedData.length} records for saving`);
    return await saveNetworkUsageDataToDB(mergedData);
  } catch (error) {
    logger.error('Failed to save network usage data', error);
    throw error;
  }
}