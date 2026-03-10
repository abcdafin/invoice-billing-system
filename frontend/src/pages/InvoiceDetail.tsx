import { useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { useInvoice, useUpdateInvoiceStatus, useDownloadInvoicePdf } from '../hooks/useInvoices';
import { Download, ChevronLeft, CreditCard, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import Modal from '../components/common/Modal';
import PaymentFormModal from './PaymentForm';

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  SENT: 'bg-blue-100 text-blue-800',
  VIEWED: 'bg-purple-100 text-purple-800',
  PAID: 'bg-green-100 text-green-800',
  PARTIAL: 'bg-yellow-100 text-yellow-800',
  OVERDUE: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-200 text-gray-600',
};

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: invoice, isLoading, isError } = useInvoice(id!);
  const updateStatus = useUpdateInvoiceStatus();
  const downloadPdf = useDownloadInvoicePdf();
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  if (isLoading) return <div className="text-center py-10">Loading invoice details...</div>;
  if (isError || !invoice) return <div className="text-center py-10 text-red-500">Invoice not found or error loading</div>;

  const totalPaid = invoice.payments?.reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;
  const balanceDue = Number(invoice.total) - totalPaid;

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ id: invoice.id, status: newStatus });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/invoices')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold leading-7 text-brand-navy flex items-center gap-3">
            {invoice.invoiceNumber}
            <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${statusColors[invoice.status] || 'bg-gray-100 text-gray-800'}`}>
              {invoice.status}
            </span>
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
           <select 
             value={invoice.status}
             onChange={(e) => handleStatusChange(e.target.value)}
             className="rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange text-sm py-2 pl-3 pr-8 border outline-none bg-white font-medium"
             disabled={updateStatus.isPending}
           >
             <option value="DRAFT">Mark as Draft</option>
             <option value="SENT">Mark as Sent</option>
             <option value="PAID">Mark as Paid</option>
             <option value="CANCELLED">Cancel Invoice</option>
           </select>
           
           {/* PDF Generation */}
           <button
             type="button"
             disabled={downloadPdf.isPending}
             className="inline-flex items-center gap-x-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
             onClick={() => downloadPdf.mutate({ id: invoice.id, invoiceNumber: invoice.invoiceNumber })}
           >
             {downloadPdf.isPending ? (
               <Loader2 className="-ml-0.5 h-4 w-4 text-brand-orange animate-spin" aria-hidden="true" />
             ) : (
               <Download className="-ml-0.5 h-4 w-4 text-gray-400" aria-hidden="true" />
             )}
             {downloadPdf.isPending ? 'Downloading...' : 'Download PDF'}
           </button>
           
           {invoice.status !== 'PAID' && (
             <button
                type="button"
                className="inline-flex items-center gap-x-2 rounded-md bg-brand-orange px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e65c00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange transition-colors"
                onClick={() => setIsPaymentModalOpen(true)}
             >
                <CreditCard className="-ml-0.5 h-4 w-4" aria-hidden="true" />
                Record Payment
             </button>
           )}
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg overflow-hidden p-6 sm:p-10">
        
        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b pb-8 mb-8">
           <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
              <div className="text-sm text-gray-500 space-y-1">
                 <p>Reference: <span className="font-semibold text-gray-900">{invoice.invoiceNumber}</span></p>
                 <p>Issue Date: <span className="text-gray-900">{format(new Date(invoice.issueDate), 'dd MMM yyyy')}</span></p>
                 <p>Due Date: <span className="text-gray-900">{format(new Date(invoice.dueDate), 'dd MMM yyyy')}</span></p>
              </div>
           </div>
           
           <div className="text-right flex flex-col items-end">
              <img src="/logo.png" alt="Company Logo" className="h-12 w-auto mb-4 bg-gray-50 p-1 rounded border" />
              <div className="text-sm text-gray-500">
                <p className="font-semibold text-gray-900">Your Company Name</p>
                <p>123 Business Road, Suite 100</p>
                <p>Jakarta, Indonesia 12345</p>
              </div>
           </div>
        </div>
        
        {/* Client Info */}
        <div className="mb-8">
           <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Bill To</h3>
           <div className="text-sm text-gray-900 space-y-1">
              <p className="font-semibold text-lg">{invoice.client?.name}</p>
              {invoice.client?.email && <p>{invoice.client.email}</p>}
              {invoice.client?.address && <p>{invoice.client.address}</p>}
              <p>
                 {invoice.client?.city} {invoice.client?.postalCode && `, ${invoice.client.postalCode}`}
              </p>
              {invoice.client?.country && <p>{invoice.client.country}</p>}
           </div>
        </div>

        {/* Line Items Table */}
        <table className="w-full mb-8">
           <thead>
              <tr className="border-b-2 border-brand-navy text-left text-sm font-semibold text-brand-navy">
                 <th className="py-3">Description</th>
                 <th className="py-3 text-right">Qty</th>
                 <th className="py-3 text-right">Unit Price</th>
                 <th className="py-3 text-right">Total</th>
              </tr>
           </thead>
           <tbody className="text-sm divide-y">
              {invoice.items?.map((item, index) => (
                <tr key={index} className="text-gray-700">
                   <td className="py-4">
                     <p className="font-medium text-gray-900">{item.product?.name || item.productId}</p>
                     {item.description && <p className="text-gray-500">{item.description}</p>}
                   </td>
                   <td className="py-4 text-right">{item.quantity}</td>
                   <td className="py-4 text-right">Rp {Number(item.unitPrice).toLocaleString()}</td>
                   <td className="py-4 text-right">Rp {Number(item.subtotal).toLocaleString()}</td>
                </tr>
              ))}
           </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end pt-4 mb-10">
           <div className="w-full sm:w-1/2 md:w-1/3 space-y-2 text-sm text-gray-600">
             <div className="flex justify-between py-1">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">Rp {Number(invoice.subtotal).toLocaleString()}</span>
             </div>
             {Number(invoice.discountAmount) > 0 && (
                <div className="flex justify-between py-1 text-red-600">
                  <span>Discount</span>
                  <span>- Rp {Number(invoice.discountAmount).toLocaleString()}</span>
                </div>
             )}
             <div className="flex justify-between py-1">
                <span>Tax</span>
                <span className="font-medium text-gray-900">Rp {Number(invoice.taxAmount).toLocaleString()}</span>
             </div>
             <div className="flex justify-between py-1 text-green-600">
                <span>Amount Paid</span>
                <span>- Rp {totalPaid.toLocaleString()}</span>
             </div>
             <div className="flex justify-between py-3 border-t-2 border-brand-navy text-lg font-bold text-brand-navy">
                <span>Balance Due</span>
                <span>Rp {balanceDue.toLocaleString()}</span>
             </div>
           </div>
        </div>

        {/* Footer Notes */}
        <div className="border-t pt-8 text-sm text-gray-500 grid gap-6">
           {invoice.notes && (
             <div>
               <h4 className="font-semibold text-gray-900 mb-1">Notes</h4>
               <p className="whitespace-pre-wrap">{invoice.notes}</p>
             </div>
           )}
           {invoice.terms && (
             <div>
               <h4 className="font-semibold text-gray-900 mb-1">Terms & Conditions</h4>
               <p className="whitespace-pre-wrap">{invoice.terms}</p>
             </div>
           )}
        </div>
      </div>
      
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title={`Record Payment - ${invoice.invoiceNumber}`}
      >
        <PaymentFormModal
          invoiceId={invoice.id}
          maxAmount={balanceDue}
          onClose={() => setIsPaymentModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

