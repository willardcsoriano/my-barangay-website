// app/announcements/page.tsx
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

// Define the Announcement type structure
type Announcement = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  
  // 1. Fetch ALL published announcements.
  // This query relies on the RLS policy that limits public access to rows where is_published = true.
  const { data: announcements, error } = await supabase
    .from('announcements')
    .select('id, title, content, created_at')
    .eq('is_published', true) // Essential RLS condition for public pages
    .order('created_at', { ascending: false }) as { data: Announcement[] | null, error: any };

  if (error) {
    console.error('Public Announcement Fetch Error:', error.message);
    return <div>Failed to load announcements. Please check public RLS policy.</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-blue-700 border-b pb-2">
        Barangay Official News & Updates
      </h1>

      {(announcements || []).length === 0 ? (
        <p className="text-gray-600">There are no official announcements published at this time.</p>
      ) : (
        <div className="space-y-6">
          {(announcements || []).map((announcement) => (
            <Card key={announcement.id} className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">{announcement.title}</CardTitle>
                <p className="text-sm text-gray-500">
                  Published: {new Date(announcement.created_at).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                {/* Note: In a real app, you would parse the full content here. */}
                <p className="text-gray-700">{announcement.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}