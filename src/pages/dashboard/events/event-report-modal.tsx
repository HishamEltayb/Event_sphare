import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Calendar, MapPin, DollarSign, Users, CheckCircle, Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateEventReport } from '@/services/events';
import { useState } from 'react';

interface EventReportModalProps {
  event?: any;
  events?: any[];
  onClose: () => void;
}

export function EventReportModal({ event, events, onClose }: EventReportModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const eventsList = event ? [event] : events || [];

  const handleDownloadReport = async () => {
    if (!event) return;
    
    try {
      setIsGenerating(true);
      const blob = await generateEventReport(event.id);
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = 'supplier-report.docx';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateTotalBudget = () => {
    return eventsList.reduce((sum, evt) => sum + (evt.budget || 0), 0);
  };

  const calculateTotalSuppliers = () => {
    return eventsList.reduce((sum, evt) => sum + (evt.event_suppliers?.length || 0), 0);
  };

  const calculateAverageCompletion = () => {
    const completionRates = eventsList.map(evt => {
      if (!evt.event_suppliers?.length) return 0;
      const completed = evt.event_suppliers.filter(
        (supplier: any) => supplier.status === 'completed'
      ).length;
      return (completed / evt.event_suppliers.length) * 100;
    });
    
    return Math.round(
      completionRates.reduce((sum, rate) => sum + rate, 0) / eventsList.length
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {event ? `Event Report: ${event.name}` : 'Events Overview Report'}
            </DialogTitle>
            {event && (
              <Button
                onClick={handleDownloadReport}
                disabled={isGenerating}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Download Report'}
              </Button>
            )}
          </div>
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
                  <p className="font-medium">{eventsList.length}</p>
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
            {eventsList.map((evt) => (
              <Card key={evt.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">{evt.name}</h4>
                    <p className="text-sm text-gray-500">{evt.description}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      evt.status === 'Planning'
                        ? 'bg-blue-100 text-blue-800'
                        : evt.status === 'Active'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {evt.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {new Date(evt.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{evt.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Budget</p>
                    <p className="font-medium">${evt.budget?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Suppliers ({evt.event_suppliers?.length || 0})</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {evt.event_suppliers?.map((supplier: any) => (
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