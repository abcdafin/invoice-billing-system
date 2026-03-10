import { useState } from 'react';

import { useProducts } from '../hooks/useProducts';
import type { Product } from '../hooks/useProducts';
import { Plus } from 'lucide-react';
import Modal from '../components/common/Modal';
import ProductFormModal from './ProductForm';

export default function ProductList() {
  const { data: products, isLoading, isError } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="text-center py-10">Loading products...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Error loading products</div>;

  return (
    <div className="space-y-6">
      <div className="flex sm:items-center justify-between">
        <h2 className="text-2xl font-bold leading-7 text-brand-navy sm:truncate sm:tracking-tight">
          Products
        </h2>
        <div className="mt-4 sm:ml-4 sm:mt-0">
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-x-2 rounded-md bg-brand-orange px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e65c00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange transition-colors"
          >
            <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">SKU</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
             {products?.length === 0 ? (
               <tr>
                 <td colSpan={6} className="py-8 text-center text-gray-500">No products found</td>
               </tr>
             ) : (
                products?.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {product.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      Rp {Number(product.price).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.sku || '-'}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.category || '-'}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${product.isActive ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/20'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button 
                         onClick={() => handleEdit(product)}
                         className="text-brand-orange hover:text-[#e65c00]"
                      >
                         Edit<span className="sr-only">, {product.name}</span>
                      </button>
                    </td>
                  </tr>
                ))
             )}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <ProductFormModal 
          product={editingProduct} 
          onClose={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}

