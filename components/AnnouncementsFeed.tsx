// components/AnnouncementsFeed.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Announcement = {
  id: number;
  title: string;
  content: string; // HTML
  created_at: string;
};

interface AnnouncementsFeedProps {
  announcements: Announcement[];
}

const truncateHtml = (html: string, maxLength: number) =>
  html.length <= maxLength ? html : html.substring(0, maxLength) + '...';

export function AnnouncementsFeed({ announcements }: AnnouncementsFeedProps) {
  const MAX_PREVIEW_LENGTH = 150;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 border-b pb-2">
          📢 Latest Barangay Announcements
        </h2>

        {announcements.length === 0 ? (
          <p className="text-gray-600">No published announcements available at this time.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

              {announcements.map((announcement) => {
                const preview = truncateHtml(announcement.content, MAX_PREVIEW_LENGTH);

                return (
                  <Card key={announcement.id}>
                    <CardHeader>
                      <CardTitle className="text-lg break-words">
                        {announcement.title}
                      </CardTitle>

                      <p className="text-sm text-gray-500">
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </p>
                    </CardHeader>

                    <CardContent>
                      <div
                        className="h-28 overflow-hidden text-gray-700 text-sm mb-2 relative prose max-w-none
                                   prose-img:max-w-full prose-img:h-auto prose-img:rounded
                                   break-words"
                        dangerouslySetInnerHTML={{ __html: preview }}
                      />

                      <Link
                        href={`/announcements/${announcement.id}`}
                        className="text-blue-600 hover:underline mt-2 inline-block"
                      >
                        Read More →
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <Link href="/announcements" passHref>
                <Button variant="outline">View All Official Announcements →</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
