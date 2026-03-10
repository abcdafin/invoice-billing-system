import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';

export const getPayments = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
      const userId = req.user!.userId;
      const { invoiceId } = req.query;

      const payments = await prisma.payment.findMany({
         where: {
            invoice: { userId },
            ...(invoiceId ? { invoiceId: invoiceId as string } : {})
         },
         include: {
            invoice: { select: { invoiceNumber: true, client: { select: { name: true } } } }
         },
         orderBy: { paymentDate: 'desc' }
      });

      res.json({ success: true, data: payments });
   } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
   }
};

export const createPayment = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
      const userId = req.user!.userId;
      const { invoiceId, amount, paymentDate, paymentMethod, referenceNumber, notes } = req.body;

      // Ensure invoice belongs to user
      const invoice = await prisma.invoice.findFirst({
         where: { id: invoiceId, userId },
         include: { payments: true }
      });

      if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

      // Create Payment
      const payment = await prisma.payment.create({
         data: {
            invoiceId,
            amount,
            paymentDate: new Date(paymentDate),
            paymentMethod,
            referenceNumber,
            notes
         }
      });

      // Recalculate invoice status
      const totalPaid = invoice.payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0) + Number(amount);
      const totalDue = Number(invoice.total);

      let newStatus = invoice.status;
      if (totalPaid >= totalDue) {
         newStatus = 'PAID';
      } else if (totalPaid > 0) {
         newStatus = 'PARTIAL';
      }

      if (newStatus !== invoice.status) {
         await prisma.invoice.update({
            where: { id: invoice.id },
            data: { status: newStatus as any }
         });
      }

      res.status(201).json({ success: true, data: payment });
   } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
   }
};
