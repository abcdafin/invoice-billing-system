import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';

export const getClients = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.userId;
    const clients = await prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: clients });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getClientById = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const client = await prisma.client.findFirst({
      where: { id, userId }
    });

    if (!client) return res.status(404).json({ message: 'Client not found' });

    res.json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const createClient = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.userId;
    const { name, email, phone, address, city, postalCode, country, taxId, notes, isActive } = req.body;

    const client = await prisma.client.create({
      data: {
        userId,
        name,
        email,
        phone,
        address,
        city,
        postalCode,
        country,
        taxId,
        notes,
        isActive: isActive !== undefined ? isActive : true,
      }
    });

    res.status(201).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const updateClient = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const existingClient = await prisma.client.findFirst({ where: { id, userId } });
    if (!existingClient) return res.status(404).json({ message: 'Client not found' });

    const updatedClient = await prisma.client.update({
      where: { id },
      data: req.body
    });

    res.json({ success: true, data: updatedClient });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const deleteClient = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const existingClient = await prisma.client.findFirst({ where: { id, userId } });
    if (!existingClient) return res.status(404).json({ message: 'Client not found' });

    await prisma.client.delete({ where: { id } });

    res.json({ success: true, message: 'Client deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
