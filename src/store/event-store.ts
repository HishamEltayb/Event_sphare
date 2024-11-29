import { create } from 'zustand';
import { Supplier } from './supplier-store';

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  status: 'Planning' | 'Active' | 'Completed';
  budget: number;
  description: string;
  suppliers: EventSupplier[];
  totalSupplierBudget: number;
  requiredDeliverables: EventDeliverable[];
}

export interface EventSupplier extends Supplier {
  eventId: string;
  allocatedBudget: number;
  status: 'pending' | 'confirmed' | 'completed';
  performance: number; // 1-5 rating
}

export interface EventDeliverable {
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  deadline: string;
}

interface EventStore {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'suppliers' | 'totalSupplierBudget'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  addSupplierToEvent: (eventId: string, supplier: Omit<EventSupplier, 'eventId'>) => void;
  removeSupplierFromEvent: (eventId: string, supplierId: string) => void;
  updateEventSupplier: (eventId: string, supplierId: string, updates: Partial<EventSupplier>) => void;
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  addEvent: (event) =>
    set((state) => ({
      events: [
        ...state.events,
        {
          ...event,
          id: Math.random().toString(36).slice(2),
          suppliers: [],
          totalSupplierBudget: 0,
          requiredDeliverables: [],
        },
      ],
    })),
  updateEvent: (id, updates) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? { ...event, ...updates } : event
      ),
    })),
  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    })),
  addSupplierToEvent: (eventId, supplier) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              suppliers: [...event.suppliers, { ...supplier, eventId }],
              totalSupplierBudget: event.totalSupplierBudget + supplier.allocatedBudget,
            }
          : event
      ),
    })),
  removeSupplierFromEvent: (eventId, supplierId) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              suppliers: event.suppliers.filter((s) => s.id !== supplierId),
              totalSupplierBudget: event.totalSupplierBudget - 
                (event.suppliers.find((s) => s.id === supplierId)?.allocatedBudget || 0),
            }
          : event
      ),
    })),
  updateEventSupplier: (eventId, supplierId, updates) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              suppliers: event.suppliers.map((supplier) =>
                supplier.id === supplierId
                  ? { ...supplier, ...updates }
                  : supplier
              ),
              totalSupplierBudget:
                event.totalSupplierBudget -
                (event.suppliers.find((s) => s.id === supplierId)?.allocatedBudget || 0) +
                (updates.allocatedBudget || 
                  event.suppliers.find((s) => s.id === supplierId)?.allocatedBudget || 0),
            }
          : event
      ),
    })),
}));