// app/admin/officials/page.tsx
export const dynamic = 'force-dynamic'; // Required for Supabase auth + server checks

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import OfficialList from './official-client-manager.client';

type Official = {
    id: number;
    name: string;
    position: string;
    contact_number: string | null;
    image_url: string | null;
    email: string | null;
};

export default async function AdminOfficialsPage() {
    const supabase = await createClient();

    // 1. Authentication check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    // 2. Authorization check (THIS is the admin restriction)
    const { data: profile } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('id', user.id)
        .single();

    // Only allow admins
    if (!profile || profile.user_role !== 'admin') {
        return redirect('/account'); // or redirect('/403') if you want a Forbidden page
    }

    // 3. Fetch officials for admin dashboard
    const { data: officials, error } = await supabase
        .from('officials')
        .select('*')
        .order('position', { ascending: true })
        .order('name', { ascending: true }) as { data: Official[] | null, error: any };

    if (error) {
        console.error('Officials Fetch Error:', error.message);
        return <div>Error loading officials list.</div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">
                🧑‍💼 Manage Officials Directory ({officials?.length || 0})
            </h1>

            <OfficialList initialOfficials={officials || []} />
        </div>
    );
}
