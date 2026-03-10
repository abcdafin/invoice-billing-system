import { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateClient, useUpdateClient, type Client } from '../hooks/useClients';

const clientSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().default('Indonesia'),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  taxId: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean(),
});


interface ClientFormProps {
  client?: Client | null;
  onClose: () => void;
}

export default function ClientFormModal({ client, onClose }: ClientFormProps) {
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '', email: '', phone: '', city: '', country: 'Indonesia',
      address: '', postalCode: '', taxId: '', notes: '', isActive: true
    },
  });

  useEffect(() => {
    if (client) {
      reset({
        name: client.name,
        email: client.email || '',
        phone: client.phone || '',
        city: client.city || '',
        country: client.country || 'Indonesia',
        address: client.address || '',
        postalCode: client.postalCode || '',
        taxId: client.taxId || '',
        notes: client.notes || '',
        isActive: client.isActive,
      });
    } else {
      reset();
    }
  }, [client, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (client) {
        await updateClient.mutateAsync({ id: client.id, ...data });
      } else {
        await createClient.mutateAsync(data);
      }
      onClose();
    } catch (error) {
       console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Company / Client Name *</label>
        <input
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border"
        />
        {errors.name?.message && <p className="mt-1 text-sm text-red-600">{String(errors.name.message)}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            {...register('email')}
            type="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            {...register('phone')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <textarea
          {...register('address')}
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            {...register('city')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Postal Code</label>
          <input
            {...register('postalCode')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <input
            {...register('country')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Tax ID / NPWP</label>
        <input
          {...register('taxId')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border"
        />
      </div>

      <div className="flex items-center">
        <input
          {...register('isActive')}
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
        />
        <label className="ml-2 block text-sm text-gray-900">Active Client</label>
      </div>

      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <button
          type="submit"
          disabled={isSubmitting || createClient.isPending || updateClient.isPending}
          className="inline-flex w-full justify-center rounded-md bg-brand-orange px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e65c00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange sm:col-start-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
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

