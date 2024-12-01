import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, MapPin, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AddEventSupplierModal } from './add-event-supplier-modal';
import { fetchEventDetails } from '@/services/events';

interface EventDetailsProps {
  eventId: string;
  onClose: () => void;
}

export function EventDetails({ eventId, onClose }: EventDetailsProps) {
  const [event, setEvent] = useState<any>(null);
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEventDetails();
  }, [eventId]);

  const loadEventDetails = async () => {
    try {
      const eventData = await fetchEventDetails(eventId);
      setEvent(eventData);
    } catch (error) {
      console.error('Error loading event details:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRemainingBudget = () => {
    if (!event) return 0;
    const totalAllocated = event.event_suppliers?.reduce(
      (sum: number, supplier: any) => sum + (supplier.allocated_budget || 0),
      0
    ) || 0;
    return event.budget - totalAllocated;
  };

  if (loading) return <div>Loading...</div>;
  if (!event) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">{event.name}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-6 space-y-8">
          <Card className="p-6 bg-white shadow-sm border border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">{event.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Budget</p>
                  <p className="font-medium text-gray-900">${event.budget?.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500">Remaining Budget</p>
                  <p className="font-medium text-gray-900">${calculateRemainingBudget().toLocaleString()}</p>
                </div>
              </div>
            </div>
          </Card>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Suppliers</h3>
              <Button 
                onClick={() => setIsAddSupplierModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
              </Button>
            </div>

            <div className="space-y-4">
              {event.event_suppliers?.map((eventSupplier: any) => (
                <Card key={eventSupplier.id} className="p-6 bg-white shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{eventSupplier.supplier.name}</h4>
                      <p className="text-sm text-gray-500">{eventSupplier.supplier.email}</p>
                      <p className="text-sm text-gray-500">{eventSupplier.supplier.specialization}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Allocated Budget</p>
                      <p className="font-medium text-gray-900">${eventSupplier.allocated_budget?.toLocaleString()}</p>
                      <p className="text-sm mt-2 text-gray-500">
                        Status: <span className="capitalize text-purple-600">{eventSupplier.status}</span>
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>

      {isAddSupplierModalOpen && (
        <AddEventSupplierModal
          isOpen={isAddSupplierModalOpen}
          onClose={() => {
            setIsAddSupplierModalOpen(false);
            loadEventDetails();
          }}
          eventId={eventId}
          remainingBudget={calculateRemainingBudget()}
        />
      )}
    </Dialog>
  );
}