import { useState, useEffect } from 'react';
import { Plus, Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { fetchUserEvents } from '@/services/events';
import { EventDetails } from './event-details';
import { AddEventModal } from './add-event-modal';
import { EventReportModal } from './event-report-modal';
import { AllEventsReportModal } from './all-events-report-modal';

interface Event {
  id: string;
  name: string;
  date: string;
  description: string;
  location: string;
  budget: number;
  status: string;
  suppliers: any[];
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedReportEventId, setSelectedReportEventId] = useState<string | null>(null);
  const [showAllEventsReport, setShowAllEventsReport] = useState(false);

  useEffect(() => {
    async function loadEvents() {
      try {
        console.log('Fetching events...');
        const userEvents = await fetchUserEvents();
        console.log('Fetched events:', userEvents);
        setEvents(userEvents);
      } catch (err) {
        console.error('Error loading events:', err);
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, []);

  if (isLoading) {
    console.log('Loading state...');
    return <div>Loading events...</div>;
  }

  if (error) {
    console.log('Error state:', error);
    return <div>Error: {error}</div>;
  }

  console.log('Current events state:', events);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Events</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your events and their suppliers
          </p>
        </div>
        <div className="flex space-x-4">
          <Button 
            onClick={() => setShowAllEventsReport(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Events Report
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events && events.length > 0 ? (
          events.map((event) => (
            <Card 
              key={event.id} 
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedEventId(event.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{event.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
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
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {event.description}
              </p>
              <div className="mt-4">
                <p className="text-sm">
                  <span className="font-medium">Location:</span> {event.location}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Budget:</span> ${event.budget.toLocaleString()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Suppliers:</span>{' '}
                  {event.event_suppliers?.length || 0}
                </p>
              </div>
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedReportEventId(event.id);
                }}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Generate Report
              </Button>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-12 text-gray-500">
            No events found. Create your first event!
          </div>
        )}
      </div>

      <AddEventModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onEventAdded={() => {
          setIsAddModalOpen(false);
          loadEvents();
        }}
      />

      {selectedEventId && (
        <EventDetails
          eventId={selectedEventId}
          onClose={() => setSelectedEventId(null)}
        />
      )}

      {selectedReportEventId && (
        <EventReportModal
          event={events.find(e => e.id === selectedReportEventId)}
          onClose={() => setSelectedReportEventId(null)}
        />
      )}

      {showAllEventsReport && (
        <EventReportModal
          events={events}
          onClose={() => setShowAllEventsReport(false)}
        />
      )}
    </div>
  );
}