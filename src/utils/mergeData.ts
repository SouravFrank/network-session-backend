import { UsageData } from "../types/usageData";
import logger from "./logger";

/**
 * Merges existing and new UsageData arrays,
 * deduping by loginTime and sorting by date descending.
 * @param {UsageData[]} existingData Existing UsageData array.
 * @param {UsageData[]} newData New UsageData array.
 * @return {UsageData[]} Merged and sorted UsageData array.
 */
export function mergeData(
  existingData: UsageData[],
  newData: UsageData[],
): UsageData[] {
  logger.info(
    `Merging data sets: existing=${existingData.length}, new=${newData.length}`,
  );
  const dataMap = new Map<string, UsageData>(
    existingData.map((item) => [item.loginTime, item]),
  );
  newData.forEach((item) => {
    dataMap.set(item.loginTime, item);
  });
  const merged = Array.from(dataMap.values()).sort(
    (a, b) => new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime(),
  );
  logger.info(`Merged data set size: ${merged.length}`);
  return merged;
}
