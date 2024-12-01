import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Calendar, MapPin, DollarSign, Users, CheckCircle, Clock } from 'lucide-react';

interface AllEventsReportModalProps {
  events: any[];
  onClose: () => void;
}

export function AllEventsReportModal({ events, onClose }: AllEventsReportModalProps) {
  const calculateTotalBudget = () => {
    return events.reduce((sum, event) => sum + (event.budget || 0), 0);
  };

  const calculateTotalSuppliers = () => {
    return events.reduce((sum, event) => sum + (event.event_suppliers?.length || 0), 0);
  };

  const calculateAverageCompletion = () => {
    const completionRates = events.map(event => {
      if (!event.event_suppliers?.length) return 0;
      const completed = event.event_suppliers.filter(
        (supplier: any) => supplier.status === 'completed'
      ).length;
      return (completed / event.event_suppliers.length) * 100;
    });
    
    return Math.round(
      completionRates.reduce((sum, rate) => sum + rate, 0) / events.length
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Events Overview Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Summary Statistics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Overall Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Events</p>
                  <p className="font-medium">{events.length}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Suppliers</p>
                  <p className="font-medium">{calculateTotalSuppliers()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Budget</p>
                  <p className="font-medium">${calculateTotalBudget().toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500">Avg. Completion</p>
                  <p className="font-medium">{calculateAverageCompletion()}%</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Events List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Events Details</h3>
            {events.map((event) => (
              <Card key={event.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">{event.name}</h4>
                    <p className="text-sm text-gray-500">{event.description}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      event.status === 'Planning'
                        ? 'bg-blue-100 text-blue-800'
                        : event.status === 'Active'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {event.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{event.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Budget</p>
                    <p className="font-medium">${event.budget?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Suppliers ({event.event_suppliers?.length || 0})</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {event.event_suppliers?.map((supplier: any) => (
                      <div key={supplier.id} className="text-sm">
                        <span className="font-medium">{supplier.supplier.name}</span>
                        <span className="text-gray-500"> - {supplier.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 