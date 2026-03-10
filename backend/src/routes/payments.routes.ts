import { Router } from 'express';
import { getPayments, createPayment } from '../controllers/paymentController';
import { authProtect } from '../middleware/auth';

const router = Router();

router.use(authProtect);

router.route('/')
  .get(getPayments)
  .post(createPayment);

export default router;
