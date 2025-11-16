// app/admin/announcements/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AnnouncementManagerClient } from '@/components/admin/AnnouncementManagerClient';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AdminAnnouncementsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const { data: announcements, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        return <div>Error loading announcements.</div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Announcements</h2>

                <Link href="/admin/announcements/new">
                    <Button>+ Add Announcement</Button>
                </Link>
            </div>

            <AnnouncementManagerClient announcements={announcements || []} />
        </div>
    );
}
