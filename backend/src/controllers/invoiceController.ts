import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';

export const getInvoices = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.userId;
    const { status, clientId } = req.query;

    const invoices = await prisma.invoice.findMany({
      where: {
        userId,
        ...(status ? { status: status as any } : {}),
        ...(clientId ? { clientId: clientId as string } : {})
      },
      include: {
        client: true,
        _count: { select: { items: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getInvoiceById = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const invoice = await prisma.invoice.findFirst({
      where: { id, userId },
      include: {
        client: true,
        items: {
          include: { product: true }
        },
        payments: true
      }
    });

    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const createInvoice = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.userId;
    const { invoiceNumber, clientId, issueDate, dueDate, subtotal, taxAmount, discountAmount, total, notes, terms, items } = req.body;

    const invoice = await prisma.invoice.create({
      data: {
        userId,
        invoiceNumber,
        clientId,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        subtotal,
        taxAmount,
        discountAmount,
        total,
        notes,
        terms,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount || 0,
            taxRate: item.taxRate || 0,
            subtotal: item.subtotal
          }))
        }
      },
      include: {
        client: true,
        items: true
      }
    });

    res.status(201).json({ success: true, data: invoice });
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Invoice number already exists' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const updateInvoiceStatus = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { status } = req.body;

    const update = await prisma.invoice.update({
      where: { id, userId },
      data: { status }
    });

    res.json({ success: true, data: update });
   } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
   }
};

// Simplified Next number generation
export const getNextInvoiceNumber = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
      const userId = req.user!.userId;
      const count = await prisma.invoice.count({ where: { userId } });
      const nextNum = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
      res.json({ success: true, data: nextNum });
   } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
   }
}
