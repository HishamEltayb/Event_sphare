import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useSupplierStore } from '@/store/supplier-store';
import { AddSupplierModal } from './add-supplier-modal';
import { SupplierDetails } from './supplier-details';

export default function SuppliersPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const suppliers = useSupplierStore((state) => state.suppliers);

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Suppliers</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your event suppliers and track their deliverables
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{supplier.name}</h3>
                <p className="text-sm text-gray-500">{supplier.specialization}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  supplier.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {supplier.status}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm">
                <span className="font-medium">Email:</span> {supplier.email}
              </p>
              <p className="text-sm">
                <span className="font-medium">Phone:</span> {supplier.phone}
              </p>
              <p className="text-sm">
                <span className="font-medium">Rating:</span>{' '}
                {'⭐'.repeat(supplier.rating)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Deliverables:</span>{' '}
                {supplier.deliverables.length}
              </p>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedSupplierId(supplier.id)}
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <AddSupplierModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {selectedSupplierId && (
        <SupplierDetails
          supplierId={selectedSupplierId}
          onClose={() => setSelectedSupplierId(null)}
        />
      )}
    </div>
  );
}