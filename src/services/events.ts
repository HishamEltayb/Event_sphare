import { supabase } from '@/lib/supabase';
import type { Event, EventSupplier, EventDeliverable } from '@/store/event-store';

export async function fetchUserEvents() {
  const { data: { user } } = await supabase.auth.getUser();
  
  console.log('Current user:', user);
  
  if (!user) throw new Error('Not authenticated');

  const { data: allEvents, error: allEventsError } = await supabase
    .from('events')
    .select('*');
    
  console.log('All events in database:', allEvents);

  const { data: events, error } = await supabase
    .from('events')
    .select(`
      *,
      event_suppliers (
        id,
        allocated_budget,
        status,
        performance,
        supplier:suppliers (*)
      )
    `)
    .eq('user_id', user.id);

  console.log('User events query result:', { events, error });

  if (error) throw error;
  return events;
}

export async function createEvent(eventData: Omit<Event, 'id' | 'suppliers' | 'totalSupplierBudget'>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');

  console.log('Creating event with user:', user.id);

  const { data, error } = await supabase
    .from('events')
    .insert({
      ...eventData,
      user_id: user.id,
      total_supplier_budget: 0
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    throw error;
  }

  console.log('Created event:', data);
  return { ...data, suppliers: [], totalSupplierBudget: 0 } as Event;
}

export async function addSupplierToEvent(eventId: string, supplierData: {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  allocatedBudget: number;
  username: string;
  password: string;
  deliverables: Array<{
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    deadline: string;
  }>;
}) {
  try {
    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: supplierData.email,
      password: supplierData.password,
      options: {
        data: {
          role: 'supplier',
          name: supplierData.name
        }
      }
    });

    if (authError) throw authError;

    // Then create the supplier profile
    const { data: supplier, error: supplierError } = await supabase
      .from('suppliers')
      .insert({
        id: authData.user?.id, // Use the auth user id
        name: supplierData.name,
        email: supplierData.email,
        phone: supplierData.phone,
        specialization: supplierData.specialization,
        username: supplierData.username,
        status: 'active',
        rating: 5
      })
      .select()
      .single();

    if (supplierError) throw supplierError;

    // Create the event_supplier relationship
    const { data: eventSupplier, error: eventSupplierError } = await supabase
      .from('event_suppliers')
      .insert({
        event_id: eventId,
        supplier_id: supplier.id,
        allocated_budget: supplierData.allocatedBudget,
        status: 'pending',
        performance: 5
      })
      .select()
      .single();

    if (eventSupplierError) throw eventSupplierError;

    // Create all deliverables
    const deliverablesData = supplierData.deliverables.map(d => ({
      event_id: eventId,
      supplier_id: supplier.id,
      item_name: d.name,
      item_description: d.description,
      quantity: d.quantity,
      unit_price: d.unitPrice,
      total_value: d.totalPrice,
      scheduled_delivery_date: d.deadline,
      current_status: 'Not Started',
      progress_percentage: 0
    }));

    const { data: deliverables, error: deliverablesError } = await supabase
      .from('deliverables')
      .insert(deliverablesData)
      .select();

    if (deliverablesError) throw deliverablesError;

    return {
      supplier,
      eventSupplier,
      deliverables
    };
  } catch (error) {
    console.error('Detailed error:', error);
    throw error;
  }
}

export async function removeSupplierFromEvent(eventId: string, supplierId: string) {
  // First delete all deliverables
  const { error: deliverablesError } = await supabase
    .from('deliverables')
    .delete()
    .match({ event_id: eventId, supplier_id: supplierId });

  if (deliverablesError) throw deliverablesError;

  // Then delete the event_supplier relationship
  const { error: eventSupplierError } = await supabase
    .from('event_suppliers')
    .delete()
    .match({ event_id: eventId, supplier_id: supplierId });

  if (eventSupplierError) throw eventSupplierError;
}

export async function fetchEventDetails(eventId: string) {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      event_suppliers (
        id,
        allocated_budget,
        status,
        performance,
        supplier:suppliers (
          id,
          name,
          email,
          phone,
          specialization,
          rating,
          status
        )
      )
    `)
    .eq('id', eventId)
    .single();

  if (error) throw error;
  return data;
} 