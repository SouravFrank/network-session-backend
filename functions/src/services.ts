import { parseHtmlContent, mergeData } from './utils';
import { getNetworkUsageDataFromDB, saveNetworkUsageDataToDB } from './databaseHelpers';
import { logger } from 'firebase-functions/v2';

export async function saveNetworkUsageData(html: string) {
  try {
    logger.info('Processing network usage data from HTML');
    const existingData = await getNetworkUsageDataFromDB();
    const parsedData = parseHtmlContent(html);
    const mergedData = mergeData(existingData, parsedData);
    logger.info(`Prepared ${mergedData.length} records for saving`);
    return saveNetworkUsageDataToDB(mergedData);
  } catch (error) {
    logger.error('Failed to save network usage data', error);
    throw error;
  }
}