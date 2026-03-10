
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export interface DashboardStats {
  stats: {
    totalRevenue: number;
    outstandingBalance: number;
    overdueBalance: number;
    activeClients: number;
  };
  revenueChart: { month: string; amount: number }[];
  recentInvoices: any[]; // Extended from raw invoice model
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard_stats'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/stats');
      return data.data as DashboardStats;
    },
  });
};

