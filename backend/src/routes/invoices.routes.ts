import { Router } from 'express';
import { getInvoices, getInvoiceById, createInvoice, updateInvoiceStatus, getNextInvoiceNumber } from '../controllers/invoiceController';
import { downloadInvoicePDF } from '../controllers/pdfController';
import { authProtect } from '../middleware/auth';

const router = Router();

router.use(authProtect);

router.get('/number/next', getNextInvoiceNumber);

router.route('/')
  .get(getInvoices)
  .post(createInvoice);

router.get('/:id/pdf', downloadInvoicePDF);

router.route('/:id')
  .get(getInvoiceById);

router.patch('/:id/status', updateInvoiceStatus);

export default router;
