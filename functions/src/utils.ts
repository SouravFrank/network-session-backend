import { UsageData } from './types';
import { JSDOM } from 'jsdom';

export function parseHtmlContent(html: string): UsageData[] {
  try {
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const rows = doc.querySelectorAll('table tr');
    const usageData: UsageData[] = [];
    rows.forEach((row, index:number) => {
      if (index === 0) return; // Skip header row
      const cells = row.querySelectorAll('td');
      if (cells.length >= 5) {
        const loginTime = cells[1].textContent?.trim() || '';
        const sessionTime = cells[2].textContent?.trim() || '';
        const download = parseFloat(cells[3].textContent?.trim() || '0');
        const upload = parseFloat(cells[4].textContent?.trim() || '0');
        if (!isNaN(download) && !isNaN(upload)) {
          usageData.push({ loginTime, sessionTime, download, upload });
        }
      }
    });
    return usageData;
  } catch (error) {
    throw new Error('Failed to parse HTML content');
  }
}

export function mergeData(existingData: UsageData[], newData: UsageData[]): UsageData[] {
  const dataMap = new Map(existingData.map(item => [item.loginTime, item]));
  newData.forEach(item => {
    dataMap.set(item.loginTime, item);
  });
  return Array.from(dataMap.values())
    .sort((a, b) => new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime());
}