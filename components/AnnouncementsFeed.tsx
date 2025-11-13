// components/AnnouncementsFeed.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; 
import Link from 'next/link';

// Define the Announcement type structure
type Announcement = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

// This component expects the announcements data as a prop
interface AnnouncementsFeedProps {
  // Safe handling for null is done in the parent (app/page.tsx), 
  // but we still rely on it being an array here.
  announcements: Announcement[]; 
}

export function AnnouncementsFeed({ announcements }: AnnouncementsFeedProps) {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-2">
          📢 Latest Barangay Announcements
        </h2>
        
        {announcements.length === 0 ? (
          <p className="text-gray-600">No published announcements available at this time.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {announcements.map((announcement) => (
                <Card key={announcement.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 line-clamp-3">{announcement.content}</p>
                    
                    {/* Link to the full announcement detail page (assuming you have one) */}
                    <Link href={`/announcements/${announcement.id}`} className="text-blue-600 hover:underline mt-2 inline-block">
                      Read More →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* <<< ADDED: Link to the full list of announcements >>> */}
            <div className="mt-8 text-center">
              <Link href="/announcements" passHref>
                <Button variant="outline">
                  View All Official Announcements →
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}