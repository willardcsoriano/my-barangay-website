// components/admin/AnnouncementManagerClient.tsx

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { PublishToggle } from '@/components/admin/PublishToggle';

type Announcement = {
    id: number;
    title: string;
    content: string;
    is_published: boolean;
    created_at: string;
    author_id: string;
};

export function AnnouncementManagerClient({ announcements }: { announcements: Announcement[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const editingId = searchParams.get('edit')
        ? Number(searchParams.get('edit'))
        : null;

    return (
        <div className="space-y-4">

            {announcements
                .filter(a => a.id !== editingId) // ⬅ Hide the active announcement
                .map(a => (
                    <Card key={a.id} className="border-l-4 shadow-sm">
                        <CardHeader className="flex justify-between items-start">
                            <CardTitle>{a.title}</CardTitle>

                            <span className={`text-xs px-2 py-1 rounded font-semibold ${
                                a.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                                {a.is_published ? 'PUBLISHED' : 'DRAFT'}
                            </span>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">
                                {a.content.substring(0, 100)}...
                            </p>

                            <div className="flex space-x-2">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => router.push(`?edit=${a.id}`)}
                                >
                                    Edit
                                </Button>

                                <DeleteButton id={a.id} />

                                <PublishToggle
                                    id={a.id}
                                    currentStatus={a.is_published}
                                    title={a.title}
                                    content={a.content}
                                    authorId={a.author_id}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
        </div>
    );
}
