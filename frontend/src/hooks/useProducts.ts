
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  unit: string;
  sku?: string;
  category?: string;
  isActive: boolean;
}

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await api.get('/products');
      return data.data as Product[];
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productData: Partial<Product>) => {
      const { data } = await api.post('/products', productData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
    },
    onError: () => {
      toast.error('Failed to create product');
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...productData }: Partial<Product> & { id: string }) => {
      const { data } = await api.put(`/products/${id}`, productData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Action successful');
    },
    onError: () => {
      toast.error('Action failed');
    }
  });
};

