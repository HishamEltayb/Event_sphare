import { useEffect, useState } from 'react';
import { fetchSuppliers } from '@/services/suppliers';
import { AddSupplierModal } from './add-supplier-modal';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadSuppliers = async () => {
    try {
      setIsLoading(true);
      const data = await fetchSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error('Error loading suppliers:', error);
      alert('Failed to load suppliers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleAddSuccess = () => {
    loadSuppliers(); // Refresh the suppliers list
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Add Supplier
        </button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </div>
      )}

      <AddSupplierModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}

function SupplierCard({ supplier }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
      <p className="text-gray-600">{supplier.email}</p>
      <p className="text-gray-600">{supplier.phone}</p>
      <p className="text-gray-600">{supplier.specialization}</p>
      <div className="mt-4">
        <span className={`px-2 py-1 rounded-full text-sm ${
          supplier.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {supplier.status}
        </span>
      </div>
    </div>
  );
}