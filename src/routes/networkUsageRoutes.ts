import { Router } from 'express';
import { getNetworkUsage, updateNetworkUsage } from '../controllers/networkUsageController';

const router = Router();

router.get('/network-usage', getNetworkUsage);
router.post('/network-usage', updateNetworkUsage);

export default router;