// app/admin/officials/page.tsx

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server'; 
import OfficialList from './official-client-manager';

// Define the Official type (keeping ordering for the time being)
type Official = {
    id: number;
    name: string;
    position: string;
    contact_number: string | null;
    ordering: number;
    image_url: string | null;
    email: string | null;
};

// --- Main Server Component (Page) ---
export default async function AdminOfficialsPage() {
    // FIX 1: Initialize the supabase client here
    const supabase = await createClient(); // <--- ADDED INITIALIZATION

    // Security Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    // Fetch ALL officials
    const { data: officials, error } = await supabase // FIX 2: Now 'supabase' is defined
        .from('officials')
        .select('*')
        // Sorted by position, as previously corrected
        .order('position', { ascending: true }) 
        .order('name', { ascending: true }) as { data: Official[] | null, error: any };

    if (error) {
        console.error('Officials Fetch Error:', error.message);
        return <div>Error loading officials list.</div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">🧑‍💼 Manage Officials Directory ({officials?.length || 0})</h1>
            
            <OfficialList initialOfficials={officials || []} />
        </div>
    );
}