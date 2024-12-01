import { supabase } from './lib/supabase';

async function createAdminUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'test@example.com',
    password: 'test123456',
    options: {
      data: {
        role: 'admin'
      }
    }
  });

  if (error) {
    console.error('Error creating user:', error.message);
    return;
  }

  console.log('User created successfully:', data);
}

createAdminUser(); 