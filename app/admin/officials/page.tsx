// app/admin/officials/page.tsx

import { redirect } from 'next/navigation';
// Safe to import server-only functions here:
import { createClient } from '@/lib/supabase/server'; 
import OfficialList from './official-client-manager'; // <--- IMPORT THE NEW CLIENT COMPONENT

// Define the Official type (UPDATED to include image_url and email)
type Official = {
    id: number;
    name: string;
    position: string;
    contact_number: string | null;
    ordering: number;
    // --- ADDED MISSING FIELDS ---
    image_url: string | null; // Must match the Client Component type
    email: string | null;     // Must match the Client Component type
};

// --- Main Server Component (Page) ---
export default async function AdminOfficialsPage() {
    const supabase = await createClient(); // SAFE: Called in a Server Component

    // Security Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    // Fetch ALL officials
    // The result data now correctly conforms to the updated Official type defined above
    const { data: officials, error } = await supabase
        .from('officials')
        .select('*')
        .order('ordering', { ascending: true })
        .order('name', { ascending: true }) as { data: Official[] | null, error: any };

    if (error) {
        console.error('Officials Fetch Error:', error.message);
        return <div>Error loading officials list.</div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">🧑‍💼 Manage Officials Directory ({officials?.length || 0})</h1>
            
            {/* PASS DATA: The types now match exactly */}
            <OfficialList initialOfficials={officials || []} />
        </div>
    );
}