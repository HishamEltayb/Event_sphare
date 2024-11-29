import { useState } from 'react';
import { X, Eye, EyeOff, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useEventStore } from '@/store/event-store';

interface Deliverable {
  name: string;
  description: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
  deadline: string;
}

interface AddEventSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  remainingBudget: number;
}

export function AddEventSupplierModal({
  isOpen,
  onClose,
  eventId,
  remainingBudget,
}: AddEventSupplierModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    allocatedBudget: '',
    username: '',
    password: '',
  });

  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);

  const addSupplierToEvent = useEventStore((state) => state.addSupplierToEvent);

  const generateUsername = () => {
    const baseUsername = formData.email.split('@')[0];
    setFormData({
      ...formData,
      username: `supplier_${baseUsername}_${Math.random().toString(36).slice(2, 6)}`,
    });
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password });
  };

  const handleAddDeliverable = () => {
    setDeliverables([
      ...deliverables,
      {
        name: '',
        description: '',
        quantity: '',
        unitPrice: '',
        totalPrice: '0',
        deadline: '',
      },
    ]);
  };

  const handleRemoveDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const handleDeliverableChange = (
    index: number,
    field: keyof Deliverable,
    value: string
  ) => {
    const updatedDeliverables = [...deliverables];
    updatedDeliverables[index] = {
      ...updatedDeliverables[index],
      [field]: value,
    };

    // Calculate total price if quantity or unit price changes
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = parseFloat(updatedDeliverables[index].quantity) || 0;
      const unitPrice = parseFloat(updatedDeliverables[index].unitPrice) || 0;
      updatedDeliverables[index].totalPrice = (quantity * unitPrice).toString();
    }

    setDeliverables(updatedDeliverables);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allocatedBudget = parseFloat(formData.allocatedBudget);

    if (allocatedBudget > remainingBudget) {
      alert('Allocated budget exceeds remaining budget');
      return;
    }

    // Add supplier with deliverables and credentials
    addSupplierToEvent(eventId, {
      ...formData,
      id: Math.random().toString(36).slice(2),
      allocatedBudget,
      status: 'pending',
      performance: 5,
      rating: 5,
      deliverables: deliverables.map(d => ({
        id: Math.random().toString(36).slice(2),
        eventId,
        supplierId: Math.random().toString(36).slice(2),
        itemName: d.name,
        itemDescription: d.description,
        quantity: parseInt(d.quantity),
        unitPrice: parseFloat(d.unitPrice),
        totalValue: parseFloat(d.totalPrice),
        scheduledDeliveryDate: d.deadline,
        scheduledInstallationDate: d.deadline,
        scheduledDismantlingDate: d.deadline,
        currentStatus: 'Not Started',
        progressPercentage: 0,
        supplierComments: [],
      })),
      credentials: {
        username: formData.username,
        password: formData.password,
      },
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Supplier to Event</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Supplier Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Specialization
            </label>
            <Input
              value={formData.specialization}
              onChange={(e) =>
                setFormData({ ...formData, specialization: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Allocated Budget (Remaining: ${remainingBudget.toLocaleString()})
            </label>
            <Input
              type="number"
              step="0.01"
              value={formData.allocatedBudget}
              onChange={(e) =>
                setFormData({ ...formData, allocatedBudget: e.target.value })
              }
              required
            />
          </div>
          <div className="border-t pt-4 mt-4">
            <h3 className="text-md font-semibold mb-4">Supplier Access Credentials</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                  <Button type="button" onClick={generateUsername} variant="outline">
                    Generate
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <Button type="button" onClick={generatePassword} variant="outline">
                    Generate
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Deliverables</h3>
              <Button type="button" onClick={handleAddDeliverable} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Deliverable
              </Button>
            </div>

            <div className="space-y-4">
              {deliverables.map((deliverable, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-sm font-medium">Deliverable {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDeliverable(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <Input
                        value={deliverable.name}
                        onChange={(e) => handleDeliverableChange(index, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <Input
                        value={deliverable.description}
                        onChange={(e) => handleDeliverableChange(index, 'description', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Quantity</label>
                      <Input
                        type="number"
                        value={deliverable.quantity}
                        onChange={(e) => handleDeliverableChange(index, 'quantity', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={deliverable.unitPrice}
                        onChange={(e) => handleDeliverableChange(index, 'unitPrice', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Price</label>
                      <Input
                        type="number"
                        value={deliverable.totalPrice}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Deadline</label>
                      <Input
                        type="date"
                        value={deliverable.deadline}
                        onChange={(e) => handleDeliverableChange(index, 'deadline', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Supplier</Button>
          </div>
        </form>
      </div>
    </div>
  );
}