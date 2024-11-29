import { useState } from 'react';
import { useEventStore, Event, EventSupplier } from '@/store/event-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Calendar, DollarSign, MapPin, Users } from 'lucide-react';
import { AddEventSupplierModal } from './add-event-supplier-modal';

interface EventDetailsProps {
  eventId: string;
  onClose: () => void;
}

export function EventDetails({ eventId, onClose }: EventDetailsProps) {
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const event = useEventStore((state) => state.events.find((e) => e.id === eventId));
  const removeSupplierFromEvent = useEventStore((state) => state.removeSupplierFromEvent);
  const updateEventSupplier = useEventStore((state) => state.updateEventSupplier);

  if (!event) return null;

  const handleStatusUpdate = (supplierId: string, status: EventSupplier['status']) => {
    updateEventSupplier(eventId, supplierId, { status });
  };

  const handleRemoveSupplier = (supplierId: string) => {
    removeSupplierFromEvent(eventId, supplierId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl m-4">
        {/* Event Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">{event.name}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {event.location}
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                ${event.budget.toLocaleString()}
              </div>
            </div>
          </div>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Event Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-600">{event.description}</p>
        </div>

        {/* Suppliers Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Suppliers</h3>
              <p className="text-sm text-gray-500">
                Budget allocated: ${event.totalSupplierBudget.toLocaleString()} of ${event.budget.toLocaleString()}
              </p>
            </div>
            <Button onClick={() => setIsAddSupplierOpen(true)}>
              <Users className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {event.suppliers.map((supplier) => (
              <Card key={supplier.id} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-medium">{supplier.name}</h4>
                    <p className="text-sm text-gray-500">{supplier.specialization}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={supplier.status}
                      onChange={(e) => handleStatusUpdate(supplier.id, e.target.value as EventSupplier['status'])}
                      className="text-sm border rounded p-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSupplier(supplier.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium mb-2">Contact Details</h5>
                    <div className="space-y-1 text-sm">
                      <p>Email: {supplier.email}</p>
                      <p>Phone: {supplier.phone}</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium mb-2">Budget Details</h5>
                    <div className="space-y-1 text-sm">
                      <p>Allocated: ${supplier.allocatedBudget.toLocaleString()}</p>
                      <p>Performance: {'⭐'.repeat(supplier.performance)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h5 className="text-sm font-medium mb-2">Deliverables</h5>
                  <p className="text-sm text-gray-500">
                    Total items: {supplier.deliverables.length}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <AddEventSupplierModal
          isOpen={isAddSupplierOpen}
          onClose={() => setIsAddSupplierOpen(false)}
          eventId={eventId}
          remainingBudget={event.budget - event.totalSupplierBudget}
        />
      </div>
    </div>
  );
}