

import { usePayments } from '../hooks/usePayments';
import { format } from 'date-fns';

export default function PaymentList() {
  const { data: payments, isLoading, isError } = usePayments();

  if (isLoading) return <div className="text-center py-10">Loading payments...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Error loading payments</div>;

  return (
    <div className="space-y-6">
      <div className="flex sm:items-center justify-between">
        <h2 className="text-2xl font-bold leading-7 text-brand-navy sm:truncate sm:tracking-tight">
          Payments Expected & Received
        </h2>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Invoice No.</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Client</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount (Rp)</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Method</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
             {payments?.length === 0 ? (
               <tr>
                 <td colSpan={6} className="py-8 text-center text-gray-500">No payment records found</td>
               </tr>
             ) : (
                payments?.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors text-sm">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 font-medium text-gray-900 sm:pl-6">
                      {format(new Date(payment.paymentDate), 'dd MMM yyyy')}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-brand-orange font-medium">
                      {payment.invoice?.invoiceNumber}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-gray-900">
                      {payment.invoice?.client?.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 font-semibold text-green-700">
                      Rp {Number(payment.amount).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-gray-500 capitalize">
                      {payment.paymentMethod}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-gray-500">
                      {payment.reference || '-'}
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

