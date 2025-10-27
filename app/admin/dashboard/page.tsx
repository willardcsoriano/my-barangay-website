// app/admin/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; 
import { Button } from '@/components/ui/button';
import Link from 'next/link';
// ... (The rest of the imports and security checks from the old file's layout)

export default async function AdminDashboardOverview() {
    // ... Security check (similar to the layout file, ensuring role is 'admin') ...
    // NOTE: For simplicity, the security logic should be in app/admin/layout.tsx

    const supabase = await createClient();
    
    // 1. Fetch the COUNT of Pending Requests
    const { count, error } = await supabase
        .from('clearance_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pending');

    // 2. Render Overview Metrics
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Metric 1: Pending Queue Count (CRITICAL) */}
                <Card className="shadow-lg border-l-4 border-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Urgent: Pending Requests
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-red-600">
                            {count || 0}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            <Link href="/admin/requests" className="underline text-blue-600">
                                View Full Queue →
                            </Link>
                        </p>
                    </CardContent>
                </Card>
                
                {/* Metric 2: Placeholder for Announcements */}
                 <Card>
                    <CardHeader><CardTitle className="text-sm font-medium">Published Announcements</CardTitle></CardHeader>
                    <CardContent><div className="text-4xl font-bold">3</div></CardContent>
                 </Card>

            </div>
        </div>
    );
}