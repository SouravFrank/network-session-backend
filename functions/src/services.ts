import { parseHtmlContent, mergeData } from './utils';
import { getNetworkUsageData, saveNetworkUsageData as dbSaveNetworkUsageData } from './databaseHelpers';
import { logger } from 'firebase-functions/v2';

export { getNetworkUsageData } from './databaseHelpers';

export async function saveNetworkUsageData(html: string) {
  try {
    logger.info('Processing network usage data from HTML');
    const existingData = await getNetworkUsageData();
    const parsedData = parseHtmlContent(html);
    const mergedData = mergeData(existingData, parsedData);
    logger.info(`Prepared ${mergedData.length} records for saving`);
    return dbSaveNetworkUsageData(mergedData);
  } catch (error) {
    logger.error('Failed to save network usage data', error);
    throw error;
  }
}