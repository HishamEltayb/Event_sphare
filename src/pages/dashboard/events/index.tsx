import { useState } from 'react';
import { Plus, Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useEventStore } from '@/store/event-store';
import { AddEventModal } from './add-event-modal';
import { EventDetails } from './event-details';

export default function EventsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const events = useEventStore((state) => state.events);

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Events</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your upcoming and ongoing events
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
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
        {filteredEvents.map((event) => (
          <Card key={event.id} className="p-6">
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
                <span className="font-medium">Budget:</span> $
                {event.budget.toLocaleString()}
              </p>
              <p className="text-sm">
                <span className="font-medium">Suppliers:</span>{' '}
                {event.suppliers.length}
              </p>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedEventId(event.id)}
              >
                Manage Event
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {selectedEventId && (
        <EventDetails
          eventId={selectedEventId}
          onClose={() => setSelectedEventId(null)}
        />
      )}
    </div>
  );
}