import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';
import { generateInvoicePDF } from '../utils/pdfGenerator';

export const downloadInvoicePDF = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const invoice = await prisma.invoice.findFirst({
         where: { id, userId },
         include: {
            client: true,
            items: {
               include: { product: true }
            }
         }
      });

      if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

      // Generate PDF stream
      const stream = await generateInvoicePDF(invoice);

      // Set headers for file download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${invoice.invoiceNumber}.pdf"`);

      // Pipe the stream to the response
      stream.pipe(res);

   } catch (error: any) {
      console.error('PDF Generation Error:', error);
      require('fs').writeFileSync('pdf-error.log', error.stack || error.toString());
      res.status(500).json({ success: false, message: 'Server Error generating PDF' });
   }
};
