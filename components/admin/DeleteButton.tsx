// components/admin/DeleteButton.tsx 
'use client';

import { Button } from '@/components/ui/button';
import { useTransition, useState } from 'react';
import { Trash2 } from 'lucide-react'; // Added an icon for better UX

// Define the expected function signature for the action prop
interface DeleteButtonProps {
    id: number;
    // Server Action that accepts a number (the ID) and returns a result object
    action: (id: number) => Promise<{ error?: string, success?: boolean, message?: string }>;
    // ADDED: Optional callback to run after successful action completion
    onActionComplete?: () => void; 
}

export function DeleteButton({ id, action, onActionComplete }: DeleteButtonProps) { 
    const [isPending, startTransition] = useTransition();
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const handleDelete = () => {
        // Simple confirmation dialog
        if (!confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
            return;
        }
        
        setStatusMessage(null);
        startTransition(async () => {
            const result = await action(id); 
            
            if (result.error) {
                setStatusMessage(`❌ Delete failed: ${result.message || result.error}`);
            } else if (result.success) {
                setStatusMessage('✅ Deleted successfully!');
                // CALL THE CALLBACK HERE
                if (onActionComplete) {
                    onActionComplete();
                }
            } else {
                setStatusMessage('⚠️ Action completed, but result was unexpected.');
            }
        });
    };

    return (
        // Using an inline-block form for layout
        <form onSubmit={(e) => { e.preventDefault(); handleDelete(); }} className="inline-block">
            <Button 
                variant="destructive" 
                size="sm" 
                disabled={isPending}
                type="submit"
            >
                {isPending ? (
                    'Deleting...'
                ) : (
                    <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </>
                )}
            </Button>
            {/* Optional status message display */}
            {statusMessage && (
                <span className={`text-xs ml-2 ${statusMessage.startsWith('❌') ? 'text-red-500' : 'text-green-500'}`}>
                    {statusMessage}
                </span>
            )}
        </form>
    );
}