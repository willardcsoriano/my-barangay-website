// app/announcements/[id]/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PublicPageLayout } from '@/components/PublicPageLayout'; 
import { Card, CardContent } from '@/components/ui/card';
import { MarkdownRenderer } from '@/components/MarkdownRenderer'; 
// 1. REMOVE: import { use } from 'react'; (It's no longer needed)

// Define the type for the data fetching
type Announcement = {
    id: number;
    title: string;
    content: string;
    created_at: string;
};

// Define the props structure for Next.js dynamic routes
interface AnnouncementPageProps {
    params: {
        id: string; // The announcement ID from the URL
    };
}

// 2. FIX: Revert the function signature to destructure props directly
export default async function FullAnnouncementPage({ params }: AnnouncementPageProps) {
    
    // 3. REMOVE: The 'use(propsPromise)' line is gone.
    
    console.log("RECEIVED PARAMS:", params); // This will now correctly log { id: '...' }
    
    const supabase = await createClient();
    
    // 4. This original check will now work correctly
    if (!params || !params.id || isNaN(Number(params.id))) {
        console.log("REDIRECTING! params.id was:", params?.id); 
        return redirect('/announcements'); 
    }
    
    const announcementId = Number(params.id);

    // 5. Fetch the single announcement record
    const { data: results, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('id', announcementId)
        .eq('is_published', true) 
        .limit(1) as { data: Announcement[] | null, error: any };

    const announcement = results?.[0] || null;

    if (error || !announcement) {
        console.error("Announcement Fetch Error:", error?.message || `No published announcement found for ID: ${announcementId}`);
        return (
            <PublicPageLayout>
                <div className="p-8 max-w-4xl mx-auto mt-12 text-center">
                    <h1 className="text-4xl font-bold text-red-600">404</h1>
                    <p className="text-xl text-gray-700">The requested announcement could not be found or is not published.</p>
                </div>
            </PublicPageLayout>
        );
    }

    // 6. Render the full content
    return (
        <PublicPageLayout>
            <div className="p-8 max-w-4xl mx-auto mt-12">
                
                <header className="mb-8 border-b pb-4">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-2">
                        {announcement.title}
                    </h1>
                    <p className="text-md text-gray-500">
                        Published on: {new Date(announcement.created_at).toLocaleDateString()}
                    </p>
                </header>

                <Card className="shadow-xl border">
                    <CardContent className="pt-6">
                        <MarkdownRenderer content={announcement.content} />
                    </CardContent>
                </Card>

            </div>
        </PublicPageLayout>
    );
}