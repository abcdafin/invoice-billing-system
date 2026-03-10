import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { authProtect } from '../middleware/auth';

const router = Router();

router.use(authProtect);

router.get('/stats', getDashboardStats);

export default router;
