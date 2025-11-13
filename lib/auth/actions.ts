// lib/auth/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers'; // Needed to get the request origin for email redirect

// --- 1. Login Action ---
export async function login(formData: FormData) {
    // Note: The origin variable is not needed for sign-in, but is kept from your previous code.
    // The redirect path is fixed here.
    
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = await createClient(); 

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Login Error:', error.message);
        return { error: 'Login failed: Invalid email or password.' };
    }

    // Success: Redirect the user to the protected account page
    redirect('/account');
}

// --- 2. Sign Up Action ---
export async function signup(formData: FormData) {
    // FIX: Await the headers() call before calling .get()
    const origin = (await headers()).get('origin'); 

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const first_name = formData.get('first_name') as string;
    const last_name = formData.get('last_name') as string;
    
    // Simple validation
    if (!email || !password || !first_name || !last_name) {
        return { error: 'All fields are required.' };
    }

    const supabase = await createClient();
    
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { first_name, last_name },
            // This URL is used in the verification email sent by Supabase
            emailRedirectTo: `${origin}/auth/confirm`, 
        },
    });

    if (error) {
        console.error('Sign Up Error:', error.message);
        return { error: error.message };
    }

    // Success: Redirect to the success page to prompt email verification
    redirect('/auth/sign-up-success');
}

// --- 3. Logout Action ---
export async function logout() {
    const supabase = await createClient();
    
    // This securely deletes the session on the server and invalidates the cookies
    await supabase.auth.signOut();
    
    // Redirect back to the public homepage
    redirect('/');
}