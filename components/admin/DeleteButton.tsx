// components/admin/DeleteButton.tsx

'use client';

import { Button } from '@/components/ui/button';
import { useTransition, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface DeleteButtonProps {
    id: number;
    action: (id: number) => Promise<{ error?: string; success?: boolean; message?: string }>;
    onActionComplete?: () => void;
}

export function DeleteButton({ id, action, onActionComplete }: DeleteButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
            return;
        }

        setStatusMessage(null);

        startTransition(async () => {
            const result = await action(id);

            if (result.error) {
                setStatusMessage(`❌ Delete failed: ${result.message || result.error}`);
            } else {
                setStatusMessage('✅ Deleted successfully!');

                // If parent component wants to refresh something
                if (onActionComplete) onActionComplete();

                router.refresh();
            }
        });
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleDelete();
            }}
            className="inline-block"
        >
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

            {statusMessage && (
                <span
                    className={`text-xs ml-2 ${
                        statusMessage.startsWith('❌') ? 'text-red-500' : 'text-green-500'
                    }`}
                >
                    {statusMessage}
                </span>
            )}
        </form>
    );
}
