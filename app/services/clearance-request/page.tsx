// app/services/clearance-request/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // <<< ADDED BUTTON IMPORT
import Link from 'next/link';                     // <<< ADDED LINK IMPORT
import { RequestForm } from '@/components/services/RequestForm';

export default async function ClearanceRequestPage() {
  const supabase = await createClient();
  
  // 1. Mandatory Security Check: Ensure user is logged in
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/auth/login');
  }

  return (
    <div className="flex flex-col items-center p-8 bg-gray-50 min-h-[calc(100vh-64px)]">
      
      {/* --- ADDED: Back Button --- */}
      <div className="w-full max-w-2xl mb-4">
        <Button variant="ghost" className="text-gray-600" asChild>
          {/* Link goes back to the resident's primary dashboard */}
          <Link href="/account">
            ← Back to Dashboard
          </Link>
        </Button>
      </div>
      
      {/* --- Main Request Card --- */}
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-700">Online Clearance Request</CardTitle>
          <p className="text-gray-600">
            Digital form for applying for Certificates of Residency, Business Permits, and other clearances.
          </p>
        </CardHeader>
        <CardContent>
          
          {/* Form Component - Passes the logged-in user's ID for submission */}
          <RequestForm residentId={user.id} />
          
        </CardContent>
      </Card>
    </div>
  );
}