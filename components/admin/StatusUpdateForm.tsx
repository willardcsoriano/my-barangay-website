// components/admin/StatusUpdateForm.tsx
'use client';

import { Button } from '@/components/ui/button';
import { useTransition, useState } from 'react';
// Import the action and type from your lib/admin/actions.ts
import { updateRequestStatus, type ClearanceStatus } from '@/lib/admin/actions'; 

interface StatusUpdateFormProps {
    requestId: number;
    currentStatus: ClearanceStatus;
}

export function StatusUpdateForm({ requestId, currentStatus }: StatusUpdateFormProps) {
    const [isPending, startTransition] = useTransition();
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const handleUpdate = (newStatus: ClearanceStatus) => {
        setStatusMessage(null); // Clear previous messages

        // This ensures UI updates while the Server Action runs
        startTransition(async () => {
            const result = await updateRequestStatus(requestId, newStatus);
            if (result.error) {
                setStatusMessage(`❌ Error: ${result.error}`);
            } else {
                setStatusMessage(`✅ Success: ${result.message}`);
            }
        });
    };

    return (
        <div className="flex flex-col space-y-2">
            {currentStatus === 'Pending' && (
                <Button 
                    onClick={() => handleUpdate('Processing')}
                    disabled={isPending}
                    size="sm"
                    className="w-40"
                >
                    {isPending ? 'Processing...' : 'Start Processing'}
                </Button>
            )}
            
            {currentStatus === 'Processing' && (
                <Button 
                    onClick={() => handleUpdate('Ready for Pickup')}
                    disabled={isPending}
                    size="sm"
                    className="w-40 bg-blue-600 hover:bg-blue-700"
                >
                    {isPending ? 'Updating...' : 'Mark Ready for Pickup'}
                </Button>
            )}

            {/* Display message after action */}
            {statusMessage && (
                <p className="text-xs self-center" style={{ color: statusMessage.startsWith('❌') ? 'red' : 'green' }}>
                    {statusMessage}
                </p>
            )}
        </div>
    );
}