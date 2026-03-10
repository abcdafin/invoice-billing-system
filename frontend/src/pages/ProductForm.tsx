import { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateProduct, useUpdateProduct, type Product } from '../hooks/useProducts';

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
  unit: z.string().min(1, 'Unit is required'),
  sku: z.string().optional(),
  category: z.string().optional(),
  isActive: z.boolean(),
});

type ProductForm = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

export default function ProductFormModal({ product, onClose }: ProductFormProps) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      unit: 'pcs',
      sku: '',
      category: '',
      isActive: true, // boolean binding works gracefully in RHF
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description || '',
        price: Number(product.price),
        unit: product.unit,
        sku: product.sku || '',
        category: product.category || '',
        isActive: product.isActive,
      });
    } else {
      reset();
    }
  }, [product, reset]);

  const onSubmit = async (data: ProductForm) => {
    try {
      if (product) {
        await updateProduct.mutateAsync({ id: product.id, ...data });
      } else {
        await createProduct.mutateAsync(data);
      }
      onClose();
    } catch (error) {
       console.error(error);
       // Handle notification in future Toast phase
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border"
        />
        {errors.name?.message && <p className="mt-1 text-sm text-red-600">{String(errors.name.message)}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Price (Rp)</label>
          <input
            {...register('price', { valueAsNumber: true })}
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border"
          />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Unit</label>
          <input
            {...register('unit')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border"
            placeholder="pcs, hr, month"
          />
          {errors.unit && <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">SKU</label>
          <input
            {...register('sku')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            {...register('category')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm py-2 px-3 border"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          {...register('isActive')}
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
        />
        <label className="ml-2 block text-sm text-gray-900">Active</label>
      </div>

      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <button
          type="submit"
          disabled={isSubmitting || createProduct.isPending || updateProduct.isPending}
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

