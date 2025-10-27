// lib/admin/actions.ts
'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

// Define the available status types to ensure data integrity
export type ClearanceStatus = 'Pending' | 'Processing' | 'Ready for Pickup' | 'Completed' | 'Denied';

/**
 * Privileged action to update the status of a clearance request.
 * This function uses the Service Role Key to bypass RLS and perform the update.
 */
export async function updateRequestStatus(requestId: number, newStatus: ClearanceStatus) {
  const supabaseAdmin = createAdminClient();

  // 1. Perform the privileged update
  const { error } = await supabaseAdmin
    .from('clearance_requests')
    .update({ status: newStatus, admin_notes: `Status updated by admin at ${new Date().toISOString()}` })
    .eq('id', requestId);

  // 2. Handle errors
  if (error) {
    console.error('ADMIN STATUS UPDATE ERROR:', error.message);
    return { error: 'Failed to update request status in the database.' };
  }

  // 3. Revalidate the cache
  // This ensures the resident's status page updates instantly.
  revalidatePath('/admin/dashboard'); 
  
  return { success: true, message: `Request ${requestId} status updated to ${newStatus}.` };
}

// You can add more admin-only actions here, like deleteAnnouncement, etc.