import { supabase } from '@/lib/supabase';
import type { Supplier, DeliverableItem } from '@/store/supplier-store';

export async function fetchSuppliers() {
  const { data: suppliers, error: suppliersError } = await supabase
    .from('suppliers')
    .select(`
      *,
      event_suppliers (
        id,
        event_id,
        allocated_budget,
        status,
        performance,
        event:events (
          id,
          name,
          date
        )
      ),
      deliverables (*)
    `);

  if (suppliersError) throw suppliersError;
  return suppliers;
}

export async function createSupplier(supplierData: {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  username: string;
  password: string;
}) {
  try {
    // First check if user already exists
    const { data: existingUser } = await supabase
      .from('suppliers')
      .select('email')
      .eq('email', supplierData.email)
      .single();

    if (existingUser) {
      throw new Error('A supplier with this email already exists');
    }

    // Create auth user with email confirmation disabled
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: supplierData.email,
      password: supplierData.password,
      options: {
        data: {
          role: 'supplier',
          name: supplierData.name
        },
        emailRedirectTo: `${window.location.origin}/supplier/login`
      }
    });

    if (authError) {
      if (authError.status === 429) {
        throw new Error('Too many attempts. Please wait a moment and try again.');
      }
      console.error('Auth Error:', authError);
      throw new Error(`Authentication error: ${authError.message}`);
    }

    if (!authData.user?.id) {
      throw new Error('No user ID returned from authentication');
    }

    // Immediately confirm the email using admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      authData.user.id,
      { email_confirm: true }
    );

    if (updateError) {
      console.error('Error confirming email:', updateError);
      throw new Error('Failed to confirm email');
    }

    // Create the supplier profile
    const { data: supplier, error: supplierError } = await supabase
      .from('suppliers')
      .insert({
        id: authData.user.id,
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

    if (supplierError) {
      console.error('Supplier Error:', supplierError);
      throw new Error(`Database error: ${supplierError.message}`);
    }

    return supplier;
  } catch (error: any) {
    console.error('Detailed error in createSupplier:', error);
    throw error;
  }
}

export async function updateSupplier(id: string, updates: Partial<Supplier>) {
  const { data, error } = await supabase
    .from('suppliers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSupplier(id: string) {
  const { error } = await supabase
    .from('suppliers')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function createDeliverable(deliverable: Omit<DeliverableItem, 'id'>) {
  const { data, error } = await supabase
    .from('deliverables')
    .insert(deliverable)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateDeliverable(id: string, updates: Partial<DeliverableItem>) {
  const { data, error } = await supabase
    .from('deliverables')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
} 