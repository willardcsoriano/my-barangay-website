'use client'; 

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarkdownRenderer } from '@/components/MarkdownRenderer'; 
import Link from 'next/link';

// Define the type (needs to be available here too)
type Announcement = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

// --- CLIENT COMPONENT: Handles Rendering Markdown and Links ---
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
                        {/* 🎯 FIX: REMOVED max-h-48, overflow-hidden, and the fade effect */}
                        <div className="relative"> 
                           {/* Renders the full Markdown content */}
                           <MarkdownRenderer content={announcement.content} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}