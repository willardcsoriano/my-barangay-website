// components/admin/DeleteButton.tsx
'use client';

import { Button } from '@/components/ui/button';
import { deleteAnnouncement } from '@/lib/admin/actions';
import { useTransition, useState } from 'react';

export function DeleteButton({ id }: { id: number }) {
    const [isPending, startTransition] = useTransition();
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const handleDelete = () => {
        setStatusMessage(null);
        startTransition(async () => {
            const result = await deleteAnnouncement(id);
            if (result.error) {
                setStatusMessage("❌ Delete failed.");
            } else {
                // If successful, the page will refresh via revalidatePath,
                // so no need for a visible message long-term.
            }
        });
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleDelete(); }} className="inline-block">
            <Button 
                variant="destructive" 
                size="sm" 
                disabled={isPending}
                type="submit"
            >
                {isPending ? 'Deleting...' : 'Delete'}
            </Button>
            {statusMessage && <span className="text-xs text-red-500 ml-2">{statusMessage}</span>}
        </form>
    );
}