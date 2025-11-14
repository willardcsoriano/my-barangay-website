// app/announcements/page.tsx (Public Announcements List)

import { createClient } from '@/lib/supabase/server';
import { PublicPageLayout } from '@/components/PublicPageLayout'; 
// FIX: Import the new, separate Client Component that handles rendering the list
import { FullAnnouncementsListClient } from '@/components/FullAnnouncementsListClient'; 

// Define the type for the data fetching
type Announcement = {
  id: number;
  title: string;
  content: string; // Contains the raw Markdown
  created_at: string;
};

// --- Main Server Component (Public List Page) ---
export default async function AnnouncementsListPage() {
    const supabase = await createClient();

    // Fetch ALL published announcements
    const { data: announcements, error } = await supabase
        .from('announcements')
        .select('id, title, content, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false }) as { data: Announcement[] | null, error: any };

    if (error) {
        console.error('Public List Fetch Error:', error.message);
    }
    
    return (
        <PublicPageLayout>
            <div className="p-8 max-w-4xl mx-auto mt-12">
                {/* Public Header/Title */}
                <header className="mb-8 border-b pb-4">
                    <h1 className="text-4xl font-extrabold text-gray-900">
                        Official Announcements Archive
                    </h1>
                </header>

                {/* FIX: Render the imported Client Component */}
                <FullAnnouncementsListClient announcements={announcements || []} />
            </div>
        </PublicPageLayout>
    );
}