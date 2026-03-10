
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

export interface Payment {
  id: string;
  invoiceId: string;
  invoice?: { invoiceNumber: string, client?: { name: string } };
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
}

export const usePayments = (invoiceId?: string) => {
  return useQuery({
    queryKey: ['payments', invoiceId],
    queryFn: async () => {
      const params = invoiceId ? { invoiceId } : {};
      const { data } = await api.get('/payments', { params });
      return data.data as Payment[];
    },
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (paymentData: Partial<Payment>) => {
      const { data } = await api.post('/payments', paymentData);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      if (variables.invoiceId) {
         queryClient.invalidateQueries({ queryKey: ['invoices', variables.invoiceId] });
      }
    },
  });
};

