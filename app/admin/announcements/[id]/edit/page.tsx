// app/admin/announcements/[id]/edit/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import AnnouncementForm from '../../AnnouncementForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function EditAnnouncementPage(props: {
    params: Promise<{ id: string }>;
}) {
    // 🔥 Next.js 16 requires awaiting params
    const { id } = await props.params;

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const { data: announcement } = await supabase
        .from('announcements')
        .select('*')
        .eq('id', Number(id))
        .single();

    if (!announcement) return notFound();

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold">Edit Announcement</h1>

                <Link href="/admin/announcements">
                    <Button variant="outline">Back to Announcements</Button>
                </Link>
            </div>

            <AnnouncementForm user={user} announcement={announcement} />
        </div>
    );
}
