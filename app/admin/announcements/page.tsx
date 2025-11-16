// app/admin/announcements/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AnnouncementForm from './AnnouncementForm';
import { AnnouncementManagerClient } from '@/components/admin/AnnouncementManagerClient';

type Announcement = {
    id: number;
    title: string;
    content: string;
    is_published: boolean;
    created_at: string;
    author_id: string;
};

export default async function AdminAnnouncementsPage(props: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    // Next.js 16 async searchParams
    const searchParams = await props.searchParams;
    const editingId = searchParams.edit ? Number(searchParams.edit) : null;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const { data: announcements, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false }) as { data: Announcement[] | null, error: any };

    if (error) return <div>Error loading announcements.</div>;

    const activeAnnouncement = editingId
        ? announcements?.find((a) => a.id === editingId)
        : null;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10">

            {/* NEW ANNOUNCEMENT */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">New Announcement</h2>
                <AnnouncementForm user={user} />
            </section>

            {/* LIST */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">All Announcements</h2>
                <AnnouncementManagerClient announcements={announcements || []} />
            </section>

            {/* EDIT FORM BELOW THE LIST */}
            {editingId && activeAnnouncement && (
                <section className="pt-10 border-t">
                    <h2 className="text-2xl font-semibold mb-4">
                        Editing: {activeAnnouncement.title}
                    </h2>

                    {/* Edit Form */}
                    <AnnouncementForm user={user} announcement={activeAnnouncement} />

                    {/* CANCEL BUTTON */}
                    <CancelEditButton />
                </section>
            )}
        </div>
    );
}


// Inline Cancel Button — must be a CLIENT component wrapper
import CancelEditButton from "@/components/admin/CancelEditButton";
