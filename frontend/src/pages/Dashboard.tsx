

import { useDashboardStats } from '../hooks/useDashboardStats';
import { useAuthStore } from '../stores/authStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { Users, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function Dashboard() {
  const user = useAuthStore(state => state.user);
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) return <div className="text-center py-10">Loading dashboard...</div>;
  if (isError || !data) return <div className="text-center py-10 text-red-500">Error loading dashboard</div>;

  const cards = [
    { name: 'Total Revenue', stat: `Rp ${Number(data.stats.totalRevenue).toLocaleString()}`, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Outstanding Balance', stat: `Rp ${Number(data.stats.outstandingBalance).toLocaleString()}`, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Overdue Balance', stat: `Rp ${Number(data.stats.overdueBalance).toLocaleString()}`, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
    { name: 'Active Clients', stat: data.stats.activeClients, icon: Users, color: 'text-brand-orange', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl mb-6 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="p-8 relative z-10">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-navy to-slate-600">Welcome back, {user?.name}!</h2>
          <p className="mt-2 text-base text-slate-500">Here's a summary of your business performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((item) => (
          <div key={item.name} className="glass-card relative pt-6 px-6 pb-6 rounded-2xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-navy/10 transition-all duration-300 group">
            <dt className="flex items-center gap-3">
              <div className={`rounded-xl p-3 ${item.bg} group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
              </div>
              <p className="text-sm font-semibold text-slate-500">{item.name}</p>
            </dt>
            <dd className="pb-2 sm:pb-3 mt-3">
              <p className="text-xl font-bold text-slate-900 tracking-tight">{item.stat}</p>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Chart */}
        <div className="glass-card rounded-2xl p-8 hover:shadow-2xl hover:shadow-brand-navy/10 transition-shadow duration-300">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Overview (Last 6 Months)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={data.revenueChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} dy={10} />
                <YAxis width={90} axisLine={false} tickLine={false} tickFormatter={(value) => `Rp ${value/1000}k`} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} dx={-10} />
                <Tooltip 
                  formatter={(value: ValueType | undefined) => [`Rp ${Number(value || 0).toLocaleString()}`, 'Revenue']}
                  cursor={{fill: '#f1f5f9'}} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontWeight: 600 }}
                />
                <Bar dataKey="amount" fill="url(#colorRevenue)" radius={[6, 6, 0, 0]}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#ff8c33" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Invoices List */}
        <div className="glass-card rounded-2xl p-8 hover:shadow-2xl hover:shadow-brand-navy/10 transition-shadow duration-300">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Recent Invoices</h3>
              <Link to="/invoices" className="text-sm font-semibold text-brand-orange hover:text-[#e65c00] transition-colors bg-orange-50 px-3 py-1.5 rounded-lg">View all</Link>
           </div>
           
           <div className="flow-root mt-6">
              <ul className="-my-5 divide-y divide-gray-200">
                 {data.recentInvoices.length === 0 ? (
                    <li className="py-4 text-center text-sm text-gray-500">No recent invoices found.</li>
                 ) : (
                    data.recentInvoices.map(invoice => (
                       <li key={invoice.id} className="py-4">
                          <Link to={`/invoices/${invoice.id}`} className="flex items-center space-x-4 hover:bg-gray-50 transition-colors p-2 rounded -mx-2">
                             <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{invoice.invoiceNumber}</p>
                                <p className="text-sm text-gray-500 truncate">{invoice.client?.name}</p>
                             </div>
                             <div className="flex flex-col items-end">
                                <p className="text-sm font-semibold text-gray-900">Rp {Number(invoice.total).toLocaleString()}</p>
                                <p className="text-xs text-brand-orange">{format(new Date(invoice.createdAt), 'dd MMM yyyy')}</p>
                             </div>
                          </Link>
                       </li>
                    ))
                 )}
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}

