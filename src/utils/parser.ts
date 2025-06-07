import logger from "./logger";
import type {UsageData} from "../types/usageData";
import {JSDOM} from "jsdom";

/**
 * Parses HTML content and extracts an array of UsageData.
 * @param {string} html HTML string to parse.
 * @return {UsageData[]} Array of UsageData.
 */
export function parseHtmlContent(html: string): UsageData[] {
  logger.info("Parsing HTML content in parser");
  try {
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const rows = doc.querySelectorAll("table tr");
    const usageData: UsageData[] = [];
    rows.forEach((row, index: number) => {
      if (index === 0) return; // Skip header row
      const cells = row.querySelectorAll("td");
      if (cells.length >= 5) {
        const loginTime = cells[1].textContent?.trim() || "";
        const sessionTime = cells[2].textContent?.trim() || "";
        const download = parseFloat(cells[3].textContent?.trim() || "0");
        const upload = parseFloat(cells[4].textContent?.trim() || "0");
        if (!isNaN(download) && !isNaN(upload)) {
          usageData.push({loginTime, sessionTime, download, upload});
        }
      }
    });
    logger.info(`Parsed ${usageData.length} usage data entries from HTML`);
    return usageData;
  } catch (error) {
    logger.error("Failed to parse HTML content", error);
    throw new Error("Failed to parse HTML content");
  }
}
