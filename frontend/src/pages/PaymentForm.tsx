

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePayment } from '../hooks/usePayments';
import { format } from 'date-fns';

const paymentSchema = z.object({
  invoiceId: z.string().min(1),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  paymentDate: z.string().min(1, 'Date is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  referenceNumber: z.string().optional(),
  notes: z.string().optional()
});

type PaymentForm = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  invoiceId: string;
  maxAmount: number;
  onClose: () => void;
}

export default function PaymentFormModal({ invoiceId, maxAmount, onClose }: PaymentFormProps) {
  const createPayment = useCreatePayment();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      invoiceId,
      amount: maxAmount, // prefill with remaining balance
      paymentDate: format(new Date(), 'yyyy-MM-dd'),
      paymentMethod: 'bank_transfer',
      referenceNumber: '',
      notes: ''
    }
  });

  const onSubmit = async (data: PaymentForm) => {
    try {
      await createPayment.mutateAsync(data);
      onClose();
    } catch (error) {
       console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Payment Amount (Rp)</label>
        <div className="mt-1 relative rounded-md shadow-sm">
           <input
             type="number"
             step="0.01"
             {...register('amount', { valueAsNumber: true })}
             className="block w-full rounded-md border-gray-300 focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 pl-3 border outline-none"
             max={maxAmount}
           />
        </div>
        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
        <p className="mt-1 text-xs text-gray-500">Remaining balance: Rp {Number(maxAmount).toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Date</label>
          <input
            type="date"
            {...register('paymentDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border outline-none"
          />
          {errors.paymentDate && <p className="mt-1 text-sm text-red-600">{errors.paymentDate.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Method</label>
          <select
            {...register('paymentMethod')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border outline-none bg-white"
          >
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Reference Number (Optional)</label>
        <input
          {...register('referenceNumber')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border outline-none"
          placeholder="e.g. TRF-12345"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Internal Notes</label>
        <textarea
          {...register('notes')}
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border outline-none"
        />
      </div>

      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <button
          type="submit"
          disabled={isSubmitting || createPayment.isPending}
          className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange sm:col-start-2 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Processing...' : 'Record Payment'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

