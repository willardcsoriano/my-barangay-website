// lib/admin/actions.ts
'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

/**
 * Privileged action to create a new announcement or update an existing one.
 */
export async function saveAnnouncement(formData: FormData, authorId: string, announcementId?: number) {
  const supabaseAdmin = createAdminClient();

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const is_published = formData.get('is_published') === 'on'; // Checkbox value

  if (!title || !content) {
    return { error: 'Title and Content are required.' };
  }
  
  const announcementData = {
    title,
    content,
    is_published,
    author_id: authorId,
  };

  let error;
  if (announcementId) {
    // UPDATE existing announcement
    ({ error } = await supabaseAdmin
      .from('announcements')
      .update(announcementData)
      .eq('id', announcementId));
  } else {
    // INSERT new announcement
    ({ error } = await supabaseAdmin
      .from('announcements')
      .insert(announcementData));
  }

  if (error) {
    console.error('SAVE ANNOUNCEMENT ERROR:', error.message);
    return { error: `Failed to save announcement: ${error.message}` };
  }

  // Revalidate the public homepage cache to show the new/updated announcement instantly
  revalidatePath('/'); 
  revalidatePath('/admin/announcements');

  const action = announcementId ? 'updated' : 'created';
  return { success: true, message: `Announcement successfully ${action}.` };
}

/**
 * Privileged action to delete an announcement.
 */
export async function deleteAnnouncement(announcementId: number) {
  const supabaseAdmin = createAdminClient();

  const { error } = await supabaseAdmin
    .from('announcements')
    .delete()
    .eq('id', announcementId);

  if (error) {
    console.error('DELETE ANNOUNCEMENT ERROR:', error.message);
    return { error: 'Failed to delete announcement.' };
  }

  revalidatePath('/');
  revalidatePath('/admin/announcements');
  return { success: true, message: `Announcement ID ${announcementId} successfully deleted.` };
}

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