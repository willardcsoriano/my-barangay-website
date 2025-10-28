// app/account/request-status/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Define a type for the requests fetched from the DB (same as the Admin dashboard)
type Request = {
    id: number;
    clearance_type: string;
    status: string; // Will use the ClearanceStatus type implicitly
    created_at: string;
};

export default async function RequestStatusPage() {
    const supabase = await createClient();
    
    // 1. Mandatory Security Check: Ensure user is logged in
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/auth/login');
    }

    // 2. Fetch Requests for the CURRENT USER ONLY
    // RLS Policy Check: This query relies on the RLS policy created for residents
    // that allows them to SELECT requests where resident_id = auth.uid().
    const { data: requests, error } = await supabase
        .from('clearance_requests')
        .select(`id, clearance_type, status, created_at`)
        .eq('resident_id', user.id) // Crucially filters by the logged-in user's ID
        .order('created_at', { ascending: false }) as { data: Request[] | null, error: any };

    if (error) {
        console.error('Resident Status Fetch Error:', error.message);
        return <div>Error loading status. Please ensure your RLS policy allows residents to view their own requests.</div>;
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-blue-700">My Clearance Request Status</h1>
            
            {requests?.length === 0 ? (
                <Card>
                    <CardContent className="py-6 text-center text-gray-600">
                        You have no submitted requests. Click <a href="/services/clearance-request" className="underline">here</a> to apply for a clearance.
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {requests?.map((request) => (
                        <Card key={request.id} className="shadow-md border-l-4 border-gray-300">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span className="text-xl">{request.clearance_type}</span>
                                    {/* Status Badge */}
                                    <span 
                                        className={`px-3 py-1 text-sm font-semibold rounded-full 
                                        ${request.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                                          request.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                                          'bg-blue-100 text-blue-700'}`}
                                    >
                                        {request.status.toUpperCase()}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500">
                                    Submitted: {new Date(request.created_at).toLocaleDateString()}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}