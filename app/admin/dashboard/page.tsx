// app/admin/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; 
import { Button } from '@/components/ui/button';
import Link from 'next/link';
// Assuming the necessary imports for layout checks are handled in the layout.tsx file
// We still need redirect for the security check logic if the layout fails.

export default async function AdminDashboardOverview() {
    const supabase = await createClient();

    // NOTE: Security checks for user and role must run, usually done via the layout.
    // For a standalone page, these checks are crucial:
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');
    const { data: profile } = await supabase.from('profiles').select('user_role').eq('id', user.id).single();
    if (profile?.user_role !== 'admin') return redirect('/account');

    // 1. Fetch the COUNT of Pending Requests
    const { count: pendingCount, error: pendingError } = await supabase
        .from('clearance_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pending');
    
    // 2. Fetch the COUNT of Published Announcements
    const { count: publishedCount, error: publishedError } = await supabase
        .from('announcements')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true); // Only count posts visible to the public

    // Handle initial fetch errors (optional, but good practice)
    if (pendingError || publishedError) {
        console.error('Dashboard Fetch Error:', pendingError?.message || publishedError?.message);
        // Display a general error message
        return <div className="p-8 text-red-700">Error loading metrics.</div>;
    }


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
                            {pendingCount || 0}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            <Link href="/admin/requests" className="underline text-blue-600">
                                View Full Queue →
                            </Link>
                        </p>
                    </CardContent>
                </Card>
                
                {/* Metric 2: Published Announcements (FIXED) */}
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Published Announcements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Use the dynamically fetched count */}
                        <div className="text-4xl font-bold">
                            {publishedCount || 0} 
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            <Link href="/admin/announcements" className="underline text-blue-600">
                                Manage Announcements →
                            </Link>
                        </p>
                    </CardContent>
                 </Card>

                 {/* You can add more metrics here */}

            </div>
        </div>
    );
}