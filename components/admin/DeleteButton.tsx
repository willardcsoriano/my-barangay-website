// components/admin/DeleteButton.tsx 
'use client';

import { Button } from '@/components/ui/button';
import { useTransition, useState } from 'react';

// Define the expected function signature for the action prop
interface DeleteButtonProps {
    id: number;
    // Server Action that accepts a number (the ID) and returns a result object
    action: (id: number) => Promise<{ error?: string, success?: boolean, message?: string }>; 
}

export function DeleteButton({ id, action }: DeleteButtonProps) { 
    const [isPending, startTransition] = useTransition();
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        
        setStatusMessage(null);
        startTransition(async () => {
            // FIX: Call the passed action function
            const result = await action(id); 
            
            if (result.error) {
                setStatusMessage("❌ Delete failed.");
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