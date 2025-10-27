// app/admin/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';

// Import the required type and action (ClearanceStatus is now correctly exported)
import { type ClearanceStatus } from '@/lib/admin/actions'; 

// Import the new Client Component wrapper for the update buttons
import { StatusUpdateForm } from '@/components/admin/StatusUpdateForm'; 

// Define a type for the requests fetched from the DB
type Request = {
    id: number;
    clearance_type: string;
    status: ClearanceStatus;
    resident_id: string;
    created_at: string;
    profiles: { first_name: string; last_name: string; contact_number: string } | null;
};

// --- Main Server Component ---
export default async function AdminDashboard() {
    // 1. Initialize the standard client to perform session and role checks
    const supabase = await createClient();

    // 2. Get User and Check Role (First layer of security)
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // Redirect if not logged in (secondary check, middleware should handle primary)
        return redirect('/login');
    }

    // 3. Fetch the user's role
    const { data: profile } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('id', user.id)
        .single();

    // 4. If user is not an Admin, redirect them out (Second layer of security)
    if (profile?.user_role !== 'admin') {
        return redirect('/account');
    }
    
    // 5. Fetch ALL Clearance Requests (Admin Privileged Read)
    // NOTE: This relies on an RLS policy that allows the 'authenticated' role (if Admin) to SELECT all.
    const { data: requests, error } = await supabase
        .from('clearance_requests')
        .select(`
            id, 
            clearance_type, 
            status, 
            created_at,
            profiles (first_name, last_name, contact_number)
        `)
        .order('created_at', { ascending: true }) as { data: Request[] | null, error: any };

    if (error) {
        console.error('Admin Fetch Error:', error.message);
        return <div>Error loading requests. Ensure the RLS policy for Admins allows SELECT ALL on `clearance_requests`.</div>;
    }
    
    // 6. Render Dashboard
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Admin Processing Dashboard</h1>
            <p className="mb-4 text-sm text-red-600 font-semibold">
                This page is secured. Only users with the 'admin' role can view it.
            </p>

            <div className="space-y-4">
                {requests?.length === 0 ? (
                    <p>No clearance requests pending.</p>
                ) : (
                    requests?.map((request) => (
                        <div key={request.id} className="p-4 border rounded-lg shadow-sm flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{request.clearance_type} - Request #{request.id}</p>
                                <p className="text-sm text-gray-600">
                                    Resident: {request.profiles?.first_name} {request.profiles?.last_name} ({request.profiles?.contact_number})
                                </p>
                                <p className="text-sm font-medium">Status: <span className={`px-2 py-1 rounded-full text-xs ${request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{request.status}</span></p>
                            </div>
                            
                            {/* NEW COMPONENT: Status Update Form (Client-Side Action Handler) */}
                            {/* This component wraps the Server Action to handle the return value and UI transition */}
                            <StatusUpdateForm 
                                requestId={request.id} 
                                currentStatus={request.status} 
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}