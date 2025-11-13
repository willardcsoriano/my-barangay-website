// lib/admin/actions.ts
'use server';

import { createClient as createSupabaseClient } from '@supabase/supabase-js'; 
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid'; // Required for generating unique filenames
import { getOrderFromPosition } from '@/lib/utils/official-hierarchy';
import { createClient } from '@/lib/supabase/server'; // Assumed to be your RLS-enabled client

// --- Define the type required by the client component ---
export type ClearanceStatus = 'Pending' | 'Processing' | 'Ready for Pickup' | 'Completed' | 'Denied';

// --- Helper: Create Admin Client (Uses Service Role Key) ---
// IMPORTANT: This uses the SERVICE ROLE KEY and bypasses all RLS. Use ONLY for sensitive admin operations.
function createAdminClient() {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                persistSession: false,
            },
        }
    );
}

// ===============================================
// 1. ANNOUNCEMENTS MANAGEMENT ACTIONS (No Change)
// ===============================================

// ... (saveAnnouncement and deleteAnnouncement functions remain unchanged) ...

/**
 * Privileged action to create a new announcement or update an existing one.
 */
export async function saveAnnouncement(formData: FormData, authorId: string, announcementId?: number) {
    const supabaseAdmin = createAdminClient();

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    // Note: Checkboxes return 'on' if checked, null otherwise.
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
        ({ error } = await supabaseAdmin
            .from('announcements')
            .update(announcementData)
            .eq('id', announcementId));
    } else {
        ({ error } = await supabaseAdmin
            .from('announcements')
            .insert(announcementData));
    }

    if (error) {
        console.error('SAVE ANNOUNCEMENT ERROR:', error.message);
        return { error: `Failed to save announcement: ${error.message}` };
    }

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


// ===============================================
// 2. OFFICIALS MANAGEMENT ACTIONS (Updated for File Upload & Email)
// ===============================================

/**
 * Privileged action to create a new official or update an existing one.
 */
export async function saveOfficial(formData: FormData, officialId?: number) {
    'use server';
    
    // We use the Admin Client (Service Role) here because file uploads (Storage) 
    // are often easier to manage without RLS checks for administrative tasks.
    const supabaseAdmin = createAdminClient();

    // 1. Extract and parse data
    const name = formData.get('name') as string;
    const position = formData.get('position') as string;
    const contact_number = formData.get('contact_number') as string | null;
    const email = formData.get('email') as string | null; // NEW FIELD
    // const ordering = parseInt(formData.get('ordering') as string);
    const ordering = getOrderFromPosition(position); // LOOKUP the fixed order
    
    const imageFile = formData.get('image') as File; // NEW FILE INPUT
    const currentImageUrl = formData.get('current_image_url') as string | null; // Hidden field for existing URL

    if (!name || !position) {
        return { error: 'Name and Position are required.' };
    }

    let imageUrl: string | null = currentImageUrl;

    // 2. Handle Image Upload if a new file is provided
    if (imageFile && imageFile.size > 0) {
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
        if (imageFile.size > MAX_FILE_SIZE) {
            return { error: `File size exceeds the limit of ${MAX_FILE_SIZE / 1024 / 1024}MB.` };
        }
        
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `officials/${fileName}`; // Folder structure in bucket

        // Upload the file to Supabase Storage
        const { error: uploadError } = await supabaseAdmin.storage
            .from('official_photos') // <--- Verify your bucket name
            .upload(filePath, imageFile, {
                cacheControl: '3600',
                upsert: false // Prevent overwriting unless specifically desired
            });

        if (uploadError) {
            console.error('Upload Error:', uploadError.message);
            return { error: 'Failed to upload image.', message: uploadError.message };
        }
        
        // Get the public URL for the newly uploaded file
        const { data: publicUrlData } = supabaseAdmin.storage
            .from('official_photos')
            .getPublicUrl(filePath);
        
        imageUrl = publicUrlData.publicUrl;
    }

    // 3. Prepare data for the 'officials' table
    const officialData = {
        name,
        position,
        contact_number,
        email, // NEW FIELD
        image_url: imageUrl, // Updated URL from storage or retained old one
        ordering: ordering,
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

    revalidatePath('/officials'); // For public page
    revalidatePath('/admin/officials'); // For admin page

    const action = officialId ? 'updated' : 'created';
    return { success: true, message: `Official successfully ${action}.` };
}

/**
 * Privileged action to delete an official.
 * NOTE: Does NOT currently delete the associated image file from storage.
 */
export async function deleteOfficial(officialId: number) {
    const supabaseAdmin = createAdminClient();

    // Ideally, you would first fetch the image_url and then delete the file from storage
    // using supabaseAdmin.storage.from('official_photos').remove([...])
    
    // For simplicity, we only delete the database record here
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

// ===============================================
// 3. STATUS UPDATE ACTION (No Change)
// ===============================================

/**
 * Privileged action to update the status of a specific clearance request.
 */
export async function updateRequestStatus(requestId: number, newStatus: ClearanceStatus) {
    const supabaseAdmin = createAdminClient();
    
    if (isNaN(requestId) || !newStatus) {
        return { error: 'Invalid request ID or status.' };
    }

    // Perform the privileged update
    const { error } = await supabaseAdmin
        .from('clearance_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

    if (error) {
        console.error('STATUS UPDATE ERROR:', error.message);
        return { error: 'Failed to update request status.' };
    }

    revalidatePath('/admin/requests'); 
    revalidatePath('/account/request-status'); 

    return { success: true, message: `Request #${requestId} status updated to ${newStatus}.` };
}