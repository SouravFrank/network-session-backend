const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const { JSDOM } = require('jsdom');
const { parseHtmlContent, mergeData } = require('./utils');
const { UsageData } = require('./typs');

const app = express();
const port = 8080;

// Define constants for the Wishnet API
const BASE_URL = 'http://192.168.182.201:9085/Kolkata/WISHN';
const HEADERS = {
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "accept-language": "en-IN,en-US;q=0.9,en-GB;q=0.8,en;q=0.7",
  "upgrade-insecure-requests": "1",
  "cookie": "JSESSIONID=D1EEC521C78F7B3EDDC0FB8299AF3342",
  "Referrer-Policy": "strict-origin-when-cross-origin"
};

const dataFilePath = path.join(__dirname, 'data', 'usageData.json');

app.use(cors());
app.use(express.json());

app.get('/api/fetchWishnetData', async (req, res) => {
  try {
    // Third API call contains the actual data we need
    const response = await fetch(`${BASE_URL}/UsageDetailUI.do6?userNameFromParent=28%3AF8%3AC6%3A5B%3AE2%3AB0&itemIndex=0&Month=1&Group=All`, {
      headers: {
        ...HEADERS,
        "Referer": `${BASE_URL}/UsageDetailUI.do6?userNameFromParent=28%3AF8%3AC6%3A5B%3AE2%3AB0&itemIndex=0&Month=1&Group=All`,
      },
      method: "GET"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const htmlContent = await response.text();

    // Parse the HTML content to extract usage data
    // This is similar to what HtmlDataExtractor does in the frontend
    const usageData = parseHtmlContent(htmlContent);

    if (!usageData || usageData.length === 0) {
      throw new Error('No usage data found in the response');
    }

    // Read existing data
    let existingData = [];
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
      console.log('No existing data file found, creating new one');
    }

    // Merge new data with existing data, removing duplicates
    const mergedData = mergeData(existingData, usageData);

    // Save the merged data
    await fs.writeFile(dataFilePath, JSON.stringify(mergedData, null, 2));

    res.json({ 
      success: true,
      message: 'Data successfully fetched and saved',
      newRecords: usageData.length
    });

  } catch (error) {
    console.error('Error fetching Wishnet data:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch Wishnet data',
      details: error.toString()
    });
  }
});

app.get('/api/usageData', async (req, res) => {
  try {
    await fetch('http://localhost:8080/api/fetchWishnetData')
    const data = await fs.readFile(dataFilePath, 'utf8');
    const jsonData = JSON.parse(data);
    const sortedData = jsonData.sort((a, b) => new Date(b.loginTime) - new Date(a.loginTime));
    res.json(sortedData);
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Error reading data' });
  }
});

app.post('/api/usageData', async (req, res) => {
  try {
    const newData = req.body;
    await fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Error writing data:', error);
    res.status(500).json({ error: 'Error writing data' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
