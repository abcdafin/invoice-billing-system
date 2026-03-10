import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';

export const getProducts = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.userId;
    const products = await prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getProductById = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: { id, userId }
    });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.userId;
    const { name, description, price, unit, sku, category, isActive } = req.body;

    const product = await prisma.product.create({
      data: {
        userId,
        name,
        description,
        price,
        unit,
        sku,
        category,
        isActive: isActive !== undefined ? isActive : true,
      }
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const existingProduct = await prisma.product.findFirst({ where: { id, userId } });
    if (!existingProduct) return res.status(404).json({ message: 'Product not found' });

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: req.body
    });

    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const existingProduct = await prisma.product.findFirst({ where: { id, userId } });
    if (!existingProduct) return res.status(404).json({ message: 'Product not found' });

    await prisma.product.delete({ where: { id } });

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
