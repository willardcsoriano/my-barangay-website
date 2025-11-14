// components/AnnouncementsFeed.tsx

'use client'; // ⬅️ Must be a client component to use MarkdownRenderer

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; 
import Link from 'next/link';
import { MarkdownRenderer } from '@/components/MarkdownRenderer'; // ⬅️ Import MarkdownRenderer

// Define the Announcement type structure
type Announcement = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

// This component expects the announcements data as a prop
interface AnnouncementsFeedProps {
  announcements: Announcement[]; 
}

// Function to truncate the raw Markdown content
const truncateMarkdown = (markdown: string, maxLength: number): string => {
  // Simple character-based truncation is usually enough for a preview
  if (markdown.length <= maxLength) {
    return markdown;
  }
  return markdown.substring(0, maxLength) + '...';
};

export function AnnouncementsFeed({ announcements }: AnnouncementsFeedProps) {
  // Define maximum characters for the preview
  const MAX_PREVIEW_LENGTH = 150; 

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
              {announcements.map((announcement) => {
                // Truncate the content for the card preview
                const previewContent = truncateMarkdown(announcement.content, MAX_PREVIEW_LENGTH);
                
                return (
                  <Card key={announcement.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <p className="text-sm text-gray-500">
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </p>
                    </CardHeader>
                    
                    <CardContent>
                      {/* 🎯 CRITICAL FIX: Use a fixed height container and MarkdownRenderer */}
                      <div className="h-28 overflow-hidden text-gray-700 text-sm mb-2 relative">
                        {/* Render the truncated Markdown */}
                        <MarkdownRenderer content={previewContent} />
                        
                        {/* Optional: Add a subtle fade effect if content is long */}
                        {announcement.content.length > MAX_PREVIEW_LENGTH && (
                           <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                        )}
                      </div>
                      
                      {/* Link to the full announcement detail page */}
                      <Link href={`/announcements/${announcement.id}`} className="text-blue-600 hover:underline mt-2 inline-block">
                        Read More →
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Link to the full list of announcements */}
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