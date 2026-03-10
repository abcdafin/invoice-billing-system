import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
      const userId = req.user!.userId;

      // 1. Total Revenue (Paid Invoices)
      const revenueAggr = await prisma.invoice.aggregate({
         where: { userId, status: 'PAID' },
         _sum: { total: true }
      });
      const totalRevenue = revenueAggr._sum.total || 0;

      // 2. Total Outstanding (Sent / Viewed / Partial)
      const outstandingAggr = await prisma.invoice.aggregate({
         where: { 
            userId, 
            status: { in: ['SENT', 'VIEWED', 'PARTIAL'] }
         },
         _sum: { total: true }
      });
      const totalOutstanding = outstandingAggr._sum.total || 0;

      // Calculate payments made against outstanding invoices for precise balance
      const partialPaymentsAggr = await prisma.payment.aggregate({
         where: {
            invoice: { userId, status: { in: ['SENT', 'VIEWED', 'PARTIAL'] } }
         },
         _sum: { amount: true }
      });
      const outstandingBalance = Number(totalOutstanding) - Number(partialPaymentsAggr._sum.amount || 0);

      // 3. Total Overdue
      const overdueAggr = await prisma.invoice.aggregate({
         where: { userId, status: 'OVERDUE' },
         _sum: { total: true }
      });
      
      const overduePaymentsAggr = await prisma.payment.aggregate({
         where: { invoice: { userId, status: 'OVERDUE' } },
         _sum: { amount: true }
      });
      const overdueBalance = Number(overdueAggr._sum.total || 0) - Number(overduePaymentsAggr._sum.amount || 0);

      // 4. Monthly Revenue Context (Past 6 Months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      sixMonthsAgo.setDate(1); // Start of month

      const monthlyPayments = await prisma.payment.groupBy({
         by: ['paymentDate'],
         where: {
            invoice: { userId },
            paymentDate: { gte: sixMonthsAgo }
         },
         _sum: { amount: true }
      });

      // Group by Month logic for Chart
      const chartDataMap = new Map();
      for (let i = 5; i >= 0; i--) {
         const d = new Date();
         d.setMonth(d.getMonth() - i);
         const monthKey = d.toLocaleString('default', { month: 'short' });
         chartDataMap.set(monthKey, 0);
      }

      monthlyPayments.forEach((p: any) => {
         const monthKey = p.paymentDate.toLocaleString('default', { month: 'short' });
         if (chartDataMap.has(monthKey)) {
            chartDataMap.set(monthKey, chartDataMap.get(monthKey) + Number(p._sum.amount));
         }
      });

      const revenueChart = Array.from(chartDataMap, ([month, amount]) => ({ month, amount }));

      // 5. Recent Invoices
      const recentInvoices = await prisma.invoice.findMany({
         where: { userId },
         take: 5,
         orderBy: { createdAt: 'desc' },
         include: { client: { select: { name: true } } }
      });

      res.json({
         success: true,
         data: {
            stats: {
               totalRevenue,
               outstandingBalance,
               overdueBalance,
               activeClients: await prisma.client.count({ where: { userId, isActive: true } })
            },
            revenueChart,
            recentInvoices
         }
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
   }
};
