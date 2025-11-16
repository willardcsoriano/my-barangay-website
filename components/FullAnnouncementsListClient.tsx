// app/components/FullAnnouncementsListClient.tsx

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Announcement = {
  id: number;
  title: string;
  content: string; // HTML
  created_at: string;
};

export function FullAnnouncementsListClient({ announcements }: { announcements: Announcement[] }) {
  if (announcements.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        No published announcements are currently available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {announcements.map((announcement) => (
        <Card key={announcement.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-blue-700">{announcement.title}</CardTitle>
            <p className="text-xs text-gray-500 mt-1">
              Published: {new Date(announcement.created_at).toLocaleDateString()}
            </p>
          </CardHeader>

          <CardContent className="text-gray-700 text-sm">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: announcement.content }}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
