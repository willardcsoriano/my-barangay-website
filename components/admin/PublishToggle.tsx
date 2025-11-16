// components/admin/PublishToggle.tsx

'use client';

import { Button } from '@/components/ui/button';
import { saveAnnouncement } from '@/lib/admin/actions'; // ⬅️ DIRECT server action
import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';

interface PublishToggleProps {
    id: number;
    currentStatus: boolean;
    title: string;
    content: string;
    authorId: string;
}

export function PublishToggle({ id, currentStatus, title, content, authorId }: PublishToggleProps) {
    const [isPending, startTransition] = useTransition();
    const [isPublished, setIsPublished] = useState(currentStatus);
    const router = useRouter();

    const handleToggle = () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);

        const newStatus = !isPublished;

        if (newStatus) {
            formData.append('is_published', 'on');
        }

        startTransition(async () => {
            const result = await saveAnnouncement(formData, authorId, id);

            if (result.success) {
                setIsPublished(newStatus);
                router.refresh();
            } else {
                console.error("Failed to toggle publish status:", result.error);
            }
        });
    };

    const buttonText = isPublished ? 'Unpublish' : 'Publish';
    const variant = isPublished ? 'secondary' : 'default';

    return (
        <Button
            onClick={handleToggle}
            disabled={isPending}
            variant={variant}
            size="sm"
            className={
                isPublished
                    ? 'bg-gray-400 hover:bg-gray-500'
                    : 'bg-green-600 hover:bg-green-700'
            }
        >
            {isPending ? 'Updating...' : buttonText}
        </Button>
    );
}
