import { Router } from 'express';
import { getNetworkUsage, updateNetworkUsage } from '../controllers/networkUsageController';
import { aiSessionInsightsController } from '../controllers/aiSessionInsightsController';

const router = Router();

router.get('/network-usage', getNetworkUsage);
router.post('/network-usage', updateNetworkUsage);

router.post('/analyzeSessionInsights', aiSessionInsightsController);

export default router;