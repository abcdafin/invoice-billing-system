import { useEffect } from 'react';

import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useCreateInvoice, useNextInvoiceNumber } from '../hooks/useInvoices';
import { useClients } from '../hooks/useClients';
import { useProducts } from '../hooks/useProducts';
import { Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const invoiceItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  description: z.string().optional(),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
  discount: z.number().min(0).default(0),
  taxRate: z.number().min(0).default(0),
  subtotal: z.number()
});

const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice Number is required'),
  clientId: z.string().min(1, 'Client is required'),
  issueDate: z.string().min(1),
  dueDate: z.string().min(1),
  subtotal: z.number(),
  taxAmount: z.number(),
  discountAmount: z.number(),
  total: z.number(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required')
});


export default function InvoiceCreate() {
  const navigate = useNavigate();
  const createInvoice = useCreateInvoice();
  const { data: nextNumber } = useNextInvoiceNumber();
  const { data: clients } = useClients();
  const { data: products } = useProducts();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceNumber: '',
      clientId: '',
      issueDate: format(new Date(), 'yyyy-MM-dd'),
      dueDate: format(new Date(new Date().setDate(new Date().getDate() + 30)), 'yyyy-MM-dd'),
      subtotal: 0,
      taxAmount: 0,
      discountAmount: 0,
      total: 0,
      notes: '',
      terms: 'Net 30. Please complete payment within 30 days.',
      items: [{ productId: '', description: '', quantity: 1, unitPrice: 0, discount: 0, taxRate: 0, subtotal: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const watchItems = useWatch({ control, name: 'items' });

  useEffect(() => {
    if (nextNumber) {
      setValue('invoiceNumber', nextNumber);
    }
  }, [nextNumber, setValue]);

  useEffect(() => {
    let subtotal = 0;
    let taxAmount = 0;
    let discountAmount = 0;

    watchItems.forEach((item, index) => {
      const itemQ = Number(item.quantity) || 0;
      const itemP = Number(item.unitPrice) || 0;
      const itemD = Number(item.discount) || 0;
      const itemT = Number(item.taxRate) || 0;

      const itemBase = itemQ * itemP;
      const itemDiscount = (itemBase * itemD) / 100;
      const itemTax = ((itemBase - itemDiscount) * itemT) / 100;
      const itemTotal = itemBase - itemDiscount + itemTax;

      subtotal += itemBase;
      discountAmount += itemDiscount;
      taxAmount += itemTax;

      // Update individual item subtotal only if it changed to avoid infinite loops
      if (item.subtotal !== itemTotal) {
         setValue(`items.${index}.subtotal`, itemTotal);
      }
    });

    const total = subtotal - discountAmount + taxAmount;
    setValue('subtotal', subtotal);
    setValue('taxAmount', taxAmount);
    setValue('discountAmount', discountAmount);
    setValue('total', total);
  }, [watchItems, setValue]);

  const handleProductSelect = (index: number, productId: string) => {
    const product = products?.find(p => p.id === productId);
    if (product) {
      setValue(`items.${index}.description`, product.name || '');
      setValue(`items.${index}.unitPrice`, Number(product.price) || 0);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      await createInvoice.mutateAsync(data);
      navigate('/invoices');
    } catch (error) {
       console.error(error);
    }
  };

  const totals = {
    subtotal: useWatch({ control, name: 'subtotal' }),
    tax: useWatch({ control, name: 'taxAmount' }),
    discount: useWatch({ control, name: 'discountAmount' }),
    total: useWatch({ control, name: 'total' })
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex sm:items-center justify-between">
        <h2 className="text-2xl font-bold leading-7 text-brand-navy">Create Invoice</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200 sm:rounded-lg">
        {/* Header Details */}
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
            <input
              {...register('invoiceNumber')}
              className="mt-1 block w-full outline-none rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border bg-gray-50"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Client *</label>
            <select
              {...register('clientId')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border outline-none"
            >
              <option value="">Select a client...</option>
              {clients?.filter(c => c.isActive).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.clientId && <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Issue Date *</label>
            <input
              type="date"
              {...register('issueDate')}
              className="mt-1 block w-full outline-none rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border"
            />
            {errors.issueDate && <p className="mt-1 text-sm text-red-600">{errors.issueDate.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date *</label>
            <input
              type="date"
              {...register('dueDate')}
              className="mt-1 block w-full outline-none rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border"
            />
            {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>}
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Line Items */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-brand-navy">Items</h3>
          {errors.items?.root && <p className="text-sm text-red-600">{errors.items.root.message}</p>}
          
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-wrap sm:flex-nowrap gap-4 items-start border p-4 rounded-md bg-gray-50 relative group">
                <div className="w-full sm:w-1/3">
                   <label className="block text-xs font-medium text-gray-500 mb-1">Product</label>
                   <select
                    {...register(`items.${index}.productId`)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border outline-none"
                    onChange={(e) => {
                      register(`items.${index}.productId`).onChange(e);
                      handleProductSelect(index, e.target.value);
                    }}
                  >
                    <option value="">Select a product...</option>
                    {products?.filter(p => p.isActive).map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  {errors.items?.[index]?.productId && <p className="mt-1 text-xs text-red-600">{errors.items[index]?.productId?.message}</p>}
                </div>
                
                <div className="w-full sm:w-1/4">
                   <label className="block text-xs font-medium text-gray-500 mb-1">Description (Optional)</label>
                   <input
                    {...register(`items.${index}.description`)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border outline-none"
                    placeholder="Details..."
                  />
                </div>

                <div className="w-24">
                   <label className="block text-xs font-medium text-gray-500 mb-1">Qty</label>
                   <input
                    type="number"
                    step="0.01"
                    {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border outline-none"
                  />
                </div>

                <div className="w-32">
                   <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
                   <input
                    type="number"
                    {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border outline-none bg-white"
                  />
                </div>

                <div className="w-20">
                   <label className="block text-xs font-medium text-gray-500 mb-1">Tax (%)</label>
                   <input
                    type="number"
                    {...register(`items.${index}.taxRate`, { valueAsNumber: true })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border outline-none"
                  />
                </div>

                <div className="w-24">
                   <label className="block text-xs font-medium text-gray-500 mb-1">Total</label>
                   <div className="py-2 text-sm font-semibold text-gray-900">
                     {Number(watchItems[index]?.subtotal || 0).toLocaleString()}
                   </div>
                </div>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => append({ productId: '', description: '', quantity: 1, unitPrice: 0, discount: 0, taxRate: 0, subtotal: 0 })}
            className="mt-4 inline-flex items-center gap-x-2 text-sm font-semibold text-brand-orange hover:text-[#e65c00]"
          >
            <Plus className="h-4 w-4" />
            Add Another Item
          </button>
        </div>

        <hr className="border-gray-200" />

        {/* Footer & Totals */}
        <div className="flex flex-col sm:flex-row justify-between gap-8 pt-4">
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes to Client</label>
              <textarea
                {...register('notes')}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Terms and Conditions</label>
              <textarea
                {...register('terms')}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border outline-none"
              />
            </div>
          </div>

          <div className="w-full sm:w-80 space-y-3 bg-gray-50 p-4 rounded-md border text-sm">
             <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-900">Rp {Number(totals.subtotal || 0).toLocaleString()}</span>
             </div>
             {Number(totals.discount || 0) > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>- Rp {Number(totals.discount || 0).toLocaleString()}</span>
                </div>
             )}
             <div className="flex justify-between">
                <span className="text-gray-600">Estimated Tax:</span>
                <span className="font-medium text-gray-900">Rp {Number(totals.tax || 0).toLocaleString()}</span>
             </div>
             <div className="pt-3 border-t flex justify-between text-lg font-bold text-brand-navy">
                <span>Total:</span>
                <span>Rp {Number(totals.total || 0).toLocaleString()}</span>
             </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t mt-6">
           <button
             type="button"
             onClick={() => navigate(-1)}
             className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
           >
             Cancel
           </button>
           <button
             type="submit"
             disabled={isSubmitting || createInvoice.isPending}
             className="inline-flex justify-center rounded-md bg-brand-orange px-8 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e65c00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange disabled:opacity-50"
           >
             {isSubmitting ? 'Saving...' : 'Save Invoice'}
           </button>
        </div>

      </form>
    </div>
  );
}

