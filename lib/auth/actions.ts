// lib/auth/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // 1. Create the server-side Supabase client
  // This client safely reads cookies and uses the public key
  const supabase = await createClient(); 

  // 2. Attempt to sign in the user
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // 3. Handle errors
  if (error) {
    console.error('Login Error:', error.message);
    // Return an error object to the client component to display
    return { error: 'Login failed: Invalid email or password.' };
  }

  // 4. Success: Redirect the user to the protected account page
  // The middleware will ensure the session cookie is refreshed here.
  redirect('/account');
}

export async function logout() {
  const supabase = await createClient();
  
  // This securely deletes the session on the server and invalidates the cookies
  await supabase.auth.signOut();
  
  // Redirect back to the public homepage or login page
  redirect('/');
}