import { parseHtmlContent, mergeData } from './utils';
import { getNetworkUsageData, saveNetworkUsageData as dbSaveNetworkUsageData } from './databaseHelpers';

export { getNetworkUsageData } from './databaseHelpers';

export async function saveNetworkUsageData(html: string) {
  const existingData = await getNetworkUsageData();
  const parsedData = parseHtmlContent(html);
  const mergedData = mergeData(existingData, parsedData);
  return dbSaveNetworkUsageData(mergedData);
}