// lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';

// The URL and the SECRET SERVICE_ROLE_KEY are stored in your .env.local file.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Throw an error if the keys are missing (good practice!)
if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to be set in the environment.');
}

// Create the client using the Service Role Key
// This key BYPASSES ALL Row-Level Security (RLS).
export const createAdminClient = () => {
  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        // Set persistSession to false to ensure the client is stateless and doesn't
        // try to manage user sessions (which it shouldn't for an admin task).
        persistSession: false,
      },
    }
  );
};