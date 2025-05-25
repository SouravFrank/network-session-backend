import {
  UsageData,
  FetchWishnetDataResult,
  FetchWishnetDataError,
} from "./typs";
import * as fs from "fs/promises";
import * as path from "path";
import { JSDOM } from "jsdom";

const BASE_URL = "http://192.168.182.201:9085/Kolkata/WISHN";
const HEADERS = {
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "accept-language": "en-IN,en-US;q=0.9,en-GB;q=0.8,en;q=0.7",
  "upgrade-insecure-requests": "1",
  cookie: "JSESSIONID=D1EEC521C78F7B3EDDC0FB8299AF3342",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

const dataFilePath = path.join(__dirname, "data", "usageData.json");

export async function fetchWishnetDataService(): Promise<FetchWishnetDataResult | FetchWishnetDataError> {
  try {
    const response = await fetch(
      `${BASE_URL}/UsageDetailUI.do6?userNameFromParent=28%3AF8%3AC6%3A5B%3AE2%3AB0&itemIndex=0&Month=1&Group=All`,
      {
        headers: {
          ...HEADERS,
          Referer: `${BASE_URL}/UsageDetailUI.do6?userNameFromParent=28%3AF8%3AC6%3A5B%3AE2%3AB0&itemIndex=0&Month=1&Group=All`,
        },
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const htmlContent = await response.text();
    const usageData = parseHtmlContent(htmlContent);

    if (!usageData || usageData.length === 0) {
      throw new Error("No usage data found in the response");
    }

    let existingData: UsageData[] = [];
    try {
      const fileContent = await fs.readFile(dataFilePath, "utf8");
      existingData = JSON.parse(fileContent);
    } catch (error) {
      // No existing data file found, create new one
    }

    const mergedData = mergeData(existingData, usageData);
    await fs.writeFile(dataFilePath, JSON.stringify(mergedData, null, 2));

    return {
      success: true,
      message: "Data successfully fetched and saved",
      newRecords: usageData.length,
    };
  } catch (error: any) {
    return {
      error: error.message || "Failed to fetch Wishnet data",
      details: error.toString(),
    };
  }
}

function parseHtmlContent(html: string): UsageData[] {
  try {
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const rows = doc.querySelectorAll("table tr");
    const usageData: UsageData[] = [];
    rows.forEach((row, index) => {
      if (index === 0) return; // Skip header row
      const cells = row.querySelectorAll("td");
      if (cells.length >= 5) {
        const loginTime = cells[1].textContent?.trim() || "";
        const sessionTime = cells[2].textContent?.trim() || "";
        const download = parseFloat(cells[3].textContent?.trim() || "0");
        const upload = parseFloat(cells[4].textContent?.trim() || "0");
        if (!isNaN(download) && !isNaN(upload)) {
          usageData.push({ loginTime, sessionTime, download, upload });
        }
      }
    });
    return usageData;
  } catch (error) {
    throw new Error("Failed to parse HTML content");
  }
}

function mergeData(
  existingData: UsageData[],
  newData: UsageData[]
): UsageData[] {
  const dataMap = new Map(existingData.map((item) => [item.loginTime, item]));
  newData.forEach((item) => {
    dataMap.set(item.loginTime, item);
  });
  return Array.from(dataMap.values()).sort(
    (a, b) => new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime()
  );
}
