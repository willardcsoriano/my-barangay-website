import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PublicPageLayout } from '@/components/PublicPageLayout'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarkdownRenderer } from '@/components/MarkdownRenderer'; 

// Define the type for the data fetching (simplified for context)
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

export default async function FullAnnouncementPage({ params }: AnnouncementPageProps) {
    const supabase = await createClient();
    const announcementId = Number(params.id);

    if (isNaN(announcementId)) {
        return redirect('/announcements');
    }

    // 1. Fetch the single announcement record
    const { data: announcement, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('id', announcementId)
        .eq('is_published', true)
        .single() as { data: Announcement | null, error: any };

    // 2. Handle errors (404 Not Found)
    if (error || !announcement) {
        // ... (Error handling remains the same) ...
        return (
            <PublicPageLayout>
                <div className="p-8 max-w-4xl mx-auto mt-12 text-center">
                    <h1 className="text-4xl font-bold text-red-600">404</h1>
                    <p className="text-xl text-gray-700">The requested announcement could not be found or is not published.</p>
                </div>
            </PublicPageLayout>
        );
    }

    // 3. Render the full content
    return (
        <PublicPageLayout>
            <div className="p-8 max-w-4xl mx-auto mt-12">
                
                {/* Public Header Content */}
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
                        {/* 🎯 CRITICAL FIX: The wrapper for the MarkdownRenderer must NOT have fixed height or overflow-hidden */}
                        {/* It now renders the FULL announcement content */}
                        <MarkdownRenderer content={announcement.content} />
                    </CardContent>
                </Card>

            </div>
        </PublicPageLayout>
    );
}