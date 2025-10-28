// lib/services/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server'; 

/**
 * Handles the secure submission of a new clearance request from a logged-in resident.
 * @param formData - The form data containing request details.
 * @param residentId - The UUID of the authenticated user submitting the form.
 */
export async function submitClearanceRequest(formData: FormData, residentId: string) {
  const supabase = await createClient();
  
  const clearance_type = formData.get('clearance_type') as string;
  const purpose = formData.get('purpose') as string;

  // 1. Validate data
  if (!clearance_type || !purpose) {
    return { error: 'Please select a clearance type and state the purpose.' };
  }

  // 2. Perform the database insert
  // RLS Policy Check: The existing policy for INSERT on clearance_requests
  // ensures residentId matches auth.uid(). We include the ID here explicitly.
  const { error } = await supabase
    .from('clearance_requests')
    .insert({
      resident_id: residentId,
      clearance_type: clearance_type,
      purpose: purpose,
      status: 'Pending', // Default status upon creation
    });

  // 3. Handle result
  if (error) {
    console.error('SUBMISSION ERROR:', error.message);
    return { error: 'Submission failed. Please try again or contact the Barangay office.' };
  }

  return { success: true, message: 'Your request has been successfully submitted! Check the status tracker for updates.' };
}