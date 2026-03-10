import { Router } from 'express';
import authRoutes from './auth.routes';
import clientRoutes from './clients.routes';
import productRoutes from './products.routes';
import invoiceRoutes from './invoices.routes';
import paymentRoutes from './payments.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/products', productRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/payments', paymentRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
