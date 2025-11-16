// app/admin/announcements/new/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AnnouncementForm from '../AnnouncementForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function NewAnnouncementPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/auth/login');

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold">New Announcement</h1>

                <Link href="/admin/announcements">
                    <Button variant="outline">Back to Announcements</Button>
                </Link>
            </div>

            <AnnouncementForm user={user} />
        </div>
    );
}
