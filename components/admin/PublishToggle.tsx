// components/admin/PublishToggle.tsx
'use client';

import { Button } from '@/components/ui/button';
import { saveAnnouncement } from '@/lib/admin/actions';
import { useTransition, useState } from 'react';
import { Textarea } from '@/components/ui/textarea'; // Assuming you have this component

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

    const handleToggle = () => {
        // Create a fake FormData object to pass to the existing saveAnnouncement action
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        
        // The new status is the opposite of the current status
        const newStatus = !isPublished;
        if (newStatus) {
            formData.append('is_published', 'on');
        }

        startTransition(async () => {
            // Note: We're calling saveAnnouncement with all existing data, just flipping the published flag.
            const result = await saveAnnouncement(formData, authorId, id);
            
            if (result.success) {
                // Optimistically update the local state. The page refresh will confirm it.
                setIsPublished(newStatus); 
            } else {
                console.error("Failed to toggle status:", result.error);
            }
        });
    };
    
    // Determine the button appearance
    const buttonText = isPublished ? 'Unpublish' : 'Publish';
    const variant = isPublished ? 'secondary' : 'default';

    return (
        <Button 
            onClick={handleToggle} 
            disabled={isPending} 
            variant={variant} 
            size="sm"
            className={!isPublished ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 hover:bg-gray-500'}
        >
            {isPending ? 'Updating...' : buttonText}
        </Button>
    );
}