
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import type { Client } from './useClients';
import type { Product } from './useProducts';

export interface InvoiceItem {
  id?: string;
  productId?: string;
  product?: Product;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  subtotal: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  client?: Client;
  issueDate: string;
  dueDate: string;
  status: 'DRAFT' | 'SENT' | 'VIEWED' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'CANCELLED';
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  notes?: string;
  terms?: string;
  currency: string;
  items: InvoiceItem[];
  payments?: any[];
}

export const useInvoices = (filters?: { status?: string, clientId?: string }) => {
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: async () => {
      const { data } = await api.get('/invoices', { params: filters });
      return data.data as Invoice[];
    },
  });
};

export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: ['invoices', id],
    queryFn: async () => {
      const { data } = await api.get(`/invoices/${id}`);
      return data.data as Invoice;
    },
    enabled: !!id,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (invoiceData: Partial<Invoice>) => {
      const { data } = await api.post('/invoices', invoiceData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice created successfully');
    },
    onError: () => {
      toast.error('Failed to create invoice');
    }
  });
};

export const useUpdateInvoiceStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { data } = await api.patch(`/invoices/${id}/status`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Action successful');
    },
    onError: () => {
      toast.error('Action failed');
    }
  });
};

export const useNextInvoiceNumber = () => {
  return useQuery({
    queryKey: ['invoices', 'nextNumber'],
    queryFn: async () => {
      const { data } = await api.get('/invoices/number/next');
      return data.data as string;
    },
  });
};

export const useDownloadInvoicePdf = () => {
  return useMutation({
    mutationFn: async ({ id, invoiceNumber }: { id: string, invoiceNumber: string }) => {
      const response = await api.get(`/invoices/${id}/pdf`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: () => {
      toast.error('Failed to download PDF');
    }
  });
};

