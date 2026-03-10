import { useState } from 'react';

import { useClients } from '../hooks/useClients';
import type { Client } from '../hooks/useClients';
import { Plus } from 'lucide-react';
import Modal from '../components/common/Modal';
import ClientFormModal from './ClientForm';

export default function ClientList() {
  const { data: clients, isLoading, isError } = useClients();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="text-center py-10">Loading clients...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Error loading clients</div>;

  return (
    <div className="space-y-6">
      <div className="flex sm:items-center justify-between">
        <h2 className="text-2xl font-bold leading-7 text-brand-navy sm:truncate sm:tracking-tight">
          Clients
        </h2>
        <div className="mt-4 sm:ml-4 sm:mt-0">
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-x-2 rounded-md bg-brand-orange px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e65c00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange transition-all"
          >
            <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Add Client
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">City</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {clients?.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">No clients found</td>
              </tr>
            ) : (
              clients?.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {client.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{client.email || '-'}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{client.city || '-'}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${client.isActive ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/20'}`}>
                      {client.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button 
                      onClick={() => handleEdit(client)}
                      className="text-brand-orange hover:text-[#e65c00]"
                    >
                      Edit<span className="sr-only">, {client.name}</span>
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
        title={editingClient ? 'Edit Client' : 'Add New Client'}
      >
        <ClientFormModal 
          client={editingClient} 
          onClose={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}

