import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSupplierStore } from '@/store/supplier-store';

interface AddDeliverableModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplierId: string;
}

export function AddDeliverableModal({
  isOpen,
  onClose,
  supplierId,
}: AddDeliverableModalProps) {
  const [formData, setFormData] = useState({
    itemName: '',
    itemDescription: '',
    quantity: '',
    unitPrice: '',
    scheduledDeliveryDate: '',
    scheduledInstallationDate: '',
    scheduledDismantlingDate: '',
    eventId: '', // In a real app, this would be selected from available events
  });

  const addDeliverable = useSupplierStore((state) => state.addDeliverable);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const quantity = parseInt(formData.quantity);
    const unitPrice = parseFloat(formData.unitPrice);

    addDeliverable(supplierId, {
      ...formData,
      quantity,
      unitPrice,
      totalValue: quantity * unitPrice,
      currentStatus: 'Not Started',
      progressPercentage: 0,
      supplierComments: [],
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Deliverable</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Item Name
            </label>
            <Input
              value={formData.itemName}
              onChange={(e) =>
                setFormData({ ...formData, itemName: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              rows={3}
              value={formData.itemDescription}
              onChange={(e) =>
                setFormData({ ...formData, itemDescription: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Unit Price
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) =>
                  setFormData({ ...formData, unitPrice: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Scheduled Delivery Date
            </label>
            <Input
              type="date"
              value={formData.scheduledDeliveryDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  scheduledDeliveryDate: e.target.value,
                })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Scheduled Installation Date
            </label>
            <Input
              type="date"
              value={formData.scheduledInstallationDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  scheduledInstallationDate: e.target.value,
                })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Scheduled Dismantling Date
            </label>
            <Input
              type="date"
              value={formData.scheduledDismantlingDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  scheduledDismantlingDate: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Deliverable</Button>
          </div>
        </form>
      </div>
    </div>
  );
}