import { Request, Response } from "express";
import { ApiResponse } from "../types/apiResponse";
import logger from "../utils/logger";
import { analyzeSessionInsights } from '../ai/flows/analyze-session-insights';
import { analyzeSessionInsightsRequestBody } from "../types/analyzeSessionInsightsRequestBody";

// POST network usage data
export const aiSessionInsightsController = async (
  req: Request,
  res: Response<ApiResponse>,
) => {
  logger.info("POST /api/analyzeSessionInsights called");
  const body = req.body as analyzeSessionInsightsRequestBody;

  if (!body || typeof body.sessionData !== "string" || !body.sessionData.trim()) {
    logger.warn("Invalid or missing sessionData in request body");
    res.status(400).json({ error: "Missing or invalid sessionData in request body" });
    return;
  }

  try {
    const data = await analyzeSessionInsights({ sessionData: body.sessionData });
    logger.info("Session insights analysis completed");
    res.status(200).json({ data });
    
  } catch (error) {
    logger.error("Error processing usage data:", error);
    res.status(500).json({ error: "Failed to process usage data" });
  }
};
