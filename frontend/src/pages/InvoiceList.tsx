

import { useInvoices } from '../hooks/useInvoices';
import { Plus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  SENT: 'bg-blue-100 text-blue-800',
  VIEWED: 'bg-purple-100 text-purple-800',
  PAID: 'bg-green-100 text-green-800',
  PARTIAL: 'bg-yellow-100 text-yellow-800',
  OVERDUE: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-200 text-gray-600',
};

export default function InvoiceList() {
  const { data: invoices, isLoading, isError } = useInvoices();

  if (isLoading) return <div className="text-center py-10">Loading invoices...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Error loading invoices</div>;

  return (
    <div className="space-y-6">
      <div className="flex sm:items-center justify-between">
        <h2 className="text-2xl font-bold leading-7 text-brand-navy sm:truncate sm:tracking-tight">
          Invoices
        </h2>
        <div className="mt-4 sm:ml-4 sm:mt-0">
          <Link
            to="/invoices/create"
            className="inline-flex items-center gap-x-2 rounded-md bg-brand-orange px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e65c00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange transition-colors"
          >
            <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Create Invoice
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Invoice Number</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Client</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Issue Date</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Due Date</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
             {invoices?.length === 0 ? (
               <tr>
                 <td colSpan={7} className="py-8 text-center text-gray-500">No invoices found</td>
               </tr>
             ) : (
                invoices?.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      {invoice.client?.name || 'Unknown Client'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                      Rp {Number(invoice.total).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {format(new Date(invoice.issueDate), 'dd MMM yyyy')}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {format(new Date(invoice.dueDate), 'dd MMM yyyy')}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusColors[invoice.status] || 'bg-gray-100 text-gray-800'}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-3">
                      <Link to={`/invoices/${invoice.id}`} className="text-brand-navy hover:text-brand-orange inline-flex items-center border border-gray-300 rounded px-2 py-1 transition-colors">
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Link>
                    </td>
                  </tr>
                ))
             )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

