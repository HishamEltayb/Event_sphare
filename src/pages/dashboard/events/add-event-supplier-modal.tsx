import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Trash } from 'lucide-react';
import { addSupplierToEvent } from '@/services/events';

interface AddEventSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  remainingBudget: number;
}

interface Deliverable {
  name: string;
  description: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
  deadline: string;
}

export function AddEventSupplierModal({
  isOpen,
  onClose,
  eventId,
  remainingBudget,
}: AddEventSupplierModalProps) {
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
  const [showPassword, setShowPassword] = useState(false);

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

    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = parseFloat(updatedDeliverables[index].quantity) || 0;
      const unitPrice = parseFloat(updatedDeliverables[index].unitPrice) || 0;
      updatedDeliverables[index].totalPrice = (quantity * unitPrice).toString();
    }

    setDeliverables(updatedDeliverables);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const allocatedBudget = parseFloat(formData.allocatedBudget);
      if (allocatedBudget > remainingBudget) {
        alert('Allocated budget exceeds remaining budget');
        return;
      }

      if (!formData.username || !formData.password) {
        alert('Please generate or enter credentials for the supplier');
        return;
      }

      await addSupplierToEvent(eventId, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialization: formData.specialization,
        allocatedBudget,
        username: formData.username,
        password: formData.password,
        deliverables: deliverables.map(d => ({
          name: d.name,
          description: d.description,
          quantity: parseFloat(d.quantity),
          unitPrice: parseFloat(d.unitPrice),
          totalPrice: parseFloat(d.totalPrice),
          deadline: d.deadline,
        })),
      });

      onClose();
    } catch (error) {
      console.error('Error adding supplier:', error);
      alert('Failed to add supplier. Please check the console for details.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Add Supplier</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <Input
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Allocated Budget</label>
              <Input
                type="number"
                value={formData.allocatedBudget}
                onChange={(e) => setFormData({ ...formData, allocatedBudget: e.target.value })}
                className="mt-1"
                required
                min="0"
                max={remainingBudget}
              />
              <p className="text-sm text-gray-500 mt-1">
                Remaining budget: ${remainingBudget.toLocaleString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <div className="mt-1 flex space-x-2">
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
                <Button
                  type="button"
                  onClick={generateUsername}
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  Generate
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 flex space-x-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <Button
                  type="button"
                  onClick={generatePassword}
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  Generate
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Deliverables</h3>
              <Button
                type="button"
                onClick={handleAddDeliverable}
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Deliverable
              </Button>
            </div>

            <div className="space-y-4">
              {deliverables.map((deliverable, index) => (
                <Card key={index} className="p-6 bg-white shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-sm font-medium text-gray-900">Deliverable {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDeliverable(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <Input
                        value={deliverable.description}
                        onChange={(e) => handleDeliverableChange(index, 'description', e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Quantity</label>
                      <Input
                        type="number"
                        value={deliverable.quantity}
                        onChange={(e) => handleDeliverableChange(index, 'quantity', e.target.value)}
                        className="mt-1"
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={deliverable.unitPrice}
                        onChange={(e) => handleDeliverableChange(index, 'unitPrice', e.target.value)}
                        className="mt-1"
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Price</label>
                      <Input
                        type="number"
                        value={deliverable.totalPrice}
                        className="mt-1 bg-gray-50"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Deadline</label>
                      <Input
                        type="date"
                        value={deliverable.deadline}
                        onChange={(e) => handleDeliverableChange(index, 'deadline', e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Add Supplier
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}