import { Request, Response } from "express";
import {
  getNetworkUsageDataFromDB,
  saveNetworkUsageDataToDB,
} from "../services/firebaseService";
import { ApiResponse } from "../types/apiResponse";
import { UpdateNetworkUsageRequestBody } from "../types/updateNetworkUsageRequestBody";
import logger from "../utils/logger";
import { parseHtmlContent } from "../utils/parser";
import { mergeData } from "../utils/mergeData";

// GET network usage data
export const getNetworkUsage = async (
  req: Request,
  res: Response<ApiResponse>,
) => {
  try {
    const data = await getNetworkUsageDataFromDB();
    res.status(200).json({ data });
  } catch (error) {
    logger.error("Error fetching usage data:", error);
    res.status(500).json({ error: "Failed to fetch usage data" });
  }
};

// POST network usage data
export const updateNetworkUsage = async (
  req: Request,
  res: Response<ApiResponse>,
) => {
  const body = req.body as UpdateNetworkUsageRequestBody;

  if (!body || typeof body.html !== "string" || !body.html.trim()) {
    res.status(400).json({ error: "Missing or invalid html in request body" });
    return;
  }

  try {
    // Parse HTML to get new usage data
    const newData = parseHtmlContent(body.html);
    // Fetch existing data from DB
    const existingData = await getNetworkUsageDataFromDB();
    // Merge and deduplicate
    const mergedData = mergeData(existingData, newData);
    // Save merged data to DB
    await saveNetworkUsageDataToDB(mergedData);
    logger.info("Parsed and deduped usage data:", mergedData);
    res
      .status(201)
      .json({ message: "Usage data processed successfully", data: mergedData });
  } catch (error) {
    logger.error("Error processing usage data:", error);
    res.status(500).json({ error: "Failed to process usage data" });
  }
};
