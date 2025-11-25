// app/admin/dashboard/page.tsx

export const dynamic = 'force-dynamic'; // Explicitly enforce dynamic rendering

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function AdminDashboardOverview() {
    const supabase = await createClient();

    // Authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    // Authorization
    const { data: profile } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('id', user.id)
        .single();
    if (profile?.user_role !== 'admin') return redirect('/account');

    // Metrics Queries
    const { count: pendingCount, error: pendingError } = await supabase
        .from('clearance_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pending');

    const { count: publishedCount, error: publishedError } = await supabase
        .from('announcements')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

    const { count: officialsCount, error: officialsError } = await supabase
        .from('officials')
        .select('*', { count: 'exact', head: true });

    if (pendingError || publishedError || officialsError) {
        console.error(
            'Dashboard Fetch Error:',
            pendingError?.message || publishedError?.message || officialsError?.message
        );
        return <div className="p-8 text-red-700">Error loading metrics.</div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <Card>
                    <CardHeader>
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

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">
                            Published Announcements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
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

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Officials Directory</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">
                            {officialsCount || 0}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            <Link href="/admin/officials" className="underline text-blue-600">
                                Manage Officials →
                            </Link>
                        </p>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
