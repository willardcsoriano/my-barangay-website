// components/admin/CancelEditButton.tsx
'use client';

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export default function CancelEditButton() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const cancel = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('edit');
        router.push(`?${params.toString()}`);
    };

    return (
        <Button
            variant="outline"
            onClick={cancel}
            className="mt-4"
        >
            Cancel Edit
        </Button>
    );
}
