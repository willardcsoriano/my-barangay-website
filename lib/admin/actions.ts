// lib/admin/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server'; // Needed for the general (non-admin) client if ever used
import { createClient as createSupabaseClient } from '@supabase/supabase-js'; // <<< Renamed import to avoid conflict
import { revalidatePath } from 'next/cache';

// --- Helper: Create Admin Client ---
// Now defined as a function that uses the ALIASED createSupabaseClient
function createAdminClient() {
    return createSupabaseClient( // <<< Using the ALIASED name
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                persistSession: false,
            },
        }
    );
}

// --- 1. Announcements Management Actions ---

/**
 * Privileged action to create a new announcement or update an existing one.
 */
export async function saveAnnouncement(formData: FormData, authorId: string, announcementId?: number) {
    const supabaseAdmin = createAdminClient();

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    // Checkbox value needs special handling: if 'on', it's true; otherwise, false.
    const is_published = formData.get('is_published') === 'on'; 

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

    // Revalidate the public homepage and admin cache
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

// --- 2. Officials Management Actions ---

/**
 * Privileged action to create a new official or update an existing one.
 */
export async function saveOfficial(formData: FormData, officialId?: number) {
    const supabaseAdmin = createAdminClient();

    const name = formData.get('name') as string;
    const position = formData.get('position') as string;
    const contact_number = formData.get('contact_number') as string | null;
    const ordering = parseInt(formData.get('ordering') as string);

    if (!name || !position) {
        return { error: 'Name and Position are required.' };
    }

    const officialData = {
        name,
        position,
        contact_number,
        ordering: isNaN(ordering) ? 0 : ordering,
    };

    let error;
    if (officialId) {
        // UPDATE existing official
        ({ error } = await supabaseAdmin
            .from('officials')
            .update(officialData)
            .eq('id', officialId));
    } else {
        // INSERT new official
        ({ error } = await supabaseAdmin
            .from('officials')
            .insert(officialData));
    }

    if (error) {
        console.error('SAVE OFFICIAL ERROR:', error.message);
        return { error: `Failed to save official: ${error.message}` };
    }

    // Revalidate the public officials page cache
    revalidatePath('/officials');
    revalidatePath('/admin/officials');

    const action = officialId ? 'updated' : 'created';
    return { success: true, message: `Official successfully ${action}.` };
}

/**
 * Privileged action to delete an official.
 */
export async function deleteOfficial(officialId: number) {
    const supabaseAdmin = createAdminClient();

    const { error } = await supabaseAdmin
        .from('officials')
        .delete()
        .eq('id', officialId);

    if (error) {
        console.error('DELETE OFFICIAL ERROR:', error.message);
        return { error: 'Failed to delete official.' };
    }

    revalidatePath('/officials');
    revalidatePath('/admin/officials');
    return { success: true, message: `Official ID ${officialId} successfully deleted.` };
}

// --- 3. Status Update Action (Critical Admin Function) ---

// NOTE: You would place your updateRequestStatus function here as well:
/*
export async function updateRequestStatus(formData: FormData) {
    // ... logic using createAdminClient() to update clearance_requests status ...
}
*/