import { supabase } from '@/lib/supabase';
import type { Event, EventSupplier, EventDeliverable } from '@/store/event-store';
import { Document, Paragraph, HeadingLevel, AlignmentType, Packer, TextRun } from 'docx';
import Together from "together-ai";

export async function fetchUserEvents() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');

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

// 9a05f7cca448c756c082674231530d668446fd00677dd76344d34153e786b3d1

export async function generateEventReport(eventId: string) {
  try {
    // 1. Fetch event data from Supabase
    const { data: event, error } = await supabase
      .from('events')
      .select(`
        *,
        event_suppliers (
          id,
          allocated_budget,
          status,
          supplier:suppliers (
            id,
            name,
            email,
            phone,
            specialization
          )
        )
      `)
      .eq('id', eventId)
      .single();

    if (error) throw error;

    // 2. Format data for AI prompt
    const prompt = `Please analyze this event data and create a detailed report including the event name, date, suppliers (with their names and contacts), budget, and costs. Format it in clear sections.
    Use ** ** to mark important information that should be bold in the final report.
    Use ### to mark section headers.
    
    For example:
    ### Event Overview
    The event "**${event.name}**" is scheduled for **${event.date}**.
    
    Event Data: ${JSON.stringify(event, null, 2)}
    
    Please structure the output with these headers:
    ### Event Overview
    ### Supplier Details
    ### Financial Summary
    `;

    // 3. Process with Together AI - using import.meta.env instead of process.env
    const together = new Together({ 
      apiKey: import.meta.env.VITE_TOGETHER_API_KEY 
    });
    
    let reportContent = '';

    const response = await together.chat.completions.create({
      messages: [{
        role: "user",
        content: prompt
      }],
      model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
      max_tokens: null,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
      stop: ["<|eot_id|>", "<|eom_id|>"],
      stream: true
    });

    for await (const token of response) {
      const content = token.choices[0]?.delta?.content;
      if (content) {
        reportContent += content;
      }
    }
    console.log(reportContent);

    // Helper function to check if line is a header
    const isHeader = (line: string) => line.startsWith('###');

    // Helper function to parse text and create TextRuns with bold sections
    const createFormattedTextRuns = (text: string) => {
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return parts.map(part => {
        if (part.startsWith('**') && part.endsWith('**')) {
          // Bold text (remove ** markers)
          return new TextRun({
            text: part.slice(2, -2),
            bold: true,
            font: "Arial",
            size: 18,
          });
        } else {
          // Normal text
          return new TextRun({
            text: part,
            bold: false,
            font: "Arial",
            size: 18,
          });
        }
      });
    };

    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: "Arial",
              size: 28,
            },
          },
        },
      },
      sections: [{
        properties: {},
        children: [
          // Header
          new Paragraph({
            children: [
              new TextRun({
                text: "Supplier Report",
                bold: true,
                font: "Arial",
                size: 40,
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 400,
            },
          }),
          // Date
          new Paragraph({
            children: [
              new TextRun({
                text: `Generated on: ${new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}`,
                bold: false,
                font: "Arial",
                size: 28,
              }),
            ],
            alignment: AlignmentType.LEFT,
            spacing: {
              after: 400,
            },
          }),
          // AI Generated Content - Process headers and bold text
          ...reportContent.split('\n').map(line => {
            if (isHeader(line)) {
              // Header formatting
              return new Paragraph({
                children: [
                  new TextRun({
                    text: line.replace('###', '').trim(), // Remove ### and trim whitespace
                    bold: true,
                    font: "Arial",
                    size: 30,
                  }),
                ],
                spacing: {
                  before: 400,
                  after: 200,
                },
                heading: HeadingLevel.HEADING_2,
              });
            } else {
              // Normal paragraph with bold sections
              return new Paragraph({
                children: createFormattedTextRuns(line),
                spacing: {
                  after: 200,
                },
              });
            }
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    return blob;
    
  } catch (error) {
    console.error('Error generating report:', error);
    throw new Error('Failed to generate report');
  }
} 