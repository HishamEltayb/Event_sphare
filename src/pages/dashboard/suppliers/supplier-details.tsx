import { useState } from 'react';
import { useSupplierStore, DeliverableItem } from '@/store/supplier-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, Plus, Upload, Calendar } from 'lucide-react';
import { AddDeliverableModal } from './add-deliverable-modal';

interface SupplierDetailsProps {
  supplierId: string;
  onClose: () => void;
}

export function SupplierDetails({ supplierId, onClose }: SupplierDetailsProps) {
  const [isAddDeliverableOpen, setIsAddDeliverableOpen] = useState(false);
  const [selectedDeliverable, setSelectedDeliverable] = useState<string | null>(null);
  const supplier = useSupplierStore((state) =>
    state.suppliers.find((s) => s.id === supplierId)
  );

  const updateDeliverable = useSupplierStore((state) => state.updateDeliverable);
  const addDeliverableComment = useSupplierStore((state) => state.addDeliverableComment);

  const [newComment, setNewComment] = useState('');

  if (!supplier) return null;

  const handleStatusUpdate = (deliverableId: string, status: DeliverableItem['currentStatus']) => {
    updateDeliverable(supplierId, deliverableId, { currentStatus: status });
  };

  const handleAddComment = (deliverableId: string) => {
    if (newComment.trim()) {
      addDeliverableComment(supplierId, deliverableId, newComment);
      setNewComment('');
    }
  };

  const calculateProgress = (deliverable: DeliverableItem) => {
    let progress = 0;
    if (deliverable.actualDeliveryDate) progress += 33;
    if (deliverable.actualInstallationDate) progress += 33;
    if (deliverable.actualDismantlingDate) progress += 34;
    return progress;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl m-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">{supplier.name}</h2>
            <p className="text-sm text-gray-500">{supplier.specialization}</p>
          </div>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <Button onClick={() => setIsAddDeliverableOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Deliverable
          </Button>
        </div>

        <div className="space-y-4">
          {supplier.deliverables.map((deliverable) => (
            <Card
              key={deliverable.id}
              className={`p-4 ${
                selectedDeliverable === deliverable.id ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{deliverable.itemName}</h3>
                  <p className="text-sm text-gray-600">{deliverable.itemDescription}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      deliverable.currentStatus === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : deliverable.currentStatus === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : deliverable.currentStatus === 'Delayed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {deliverable.currentStatus}
                  </span>
                  <select
                    value={deliverable.currentStatus}
                    onChange={(e) =>
                      handleStatusUpdate(
                        deliverable.id,
                        e.target.value as DeliverableItem['currentStatus']
                      )
                    }
                    className="text-sm border rounded p-1"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Delayed">Delayed</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Details</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Quantity:</span> {deliverable.quantity}
                    </p>
                    <p>
                      <span className="font-medium">Unit Price:</span> $
                      {deliverable.unitPrice.toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Total Value:</span> $
                      {deliverable.totalValue.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Timeline</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Delivery: {new Date(deliverable.scheduledDeliveryDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Installation: {new Date(deliverable.scheduledInstallationDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Dismantling: {new Date(deliverable.scheduledDismantlingDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{ width: `${calculateProgress(deliverable)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Progress: {calculateProgress(deliverable)}%
                </p>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Comments</h4>
                <div className="space-y-2">
                  {deliverable.supplierComments.map((comment, index) => (
                    <p key={index} className="text-sm bg-gray-50 p-2 rounded">
                      {comment}
                    </p>
                  ))}
                  <div className="flex space-x-2">
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleAddComment(deliverable.id)}
                      variant="outline"
                      size="sm"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Documentation</h4>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photos
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <AddDeliverableModal
        isOpen={isAddDeliverableOpen}
        onClose={() => setIsAddDeliverableOpen(false)}
        supplierId={supplierId}
      />
    </div>
  );
}