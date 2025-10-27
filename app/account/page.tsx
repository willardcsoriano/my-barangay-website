// app/account/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth/actions'; // We will add this to lib/auth/actions.ts
import Link from 'next/link';

export default async function AccountPage() {
  // 1. Get the server-side client to check the user session
  const supabase = await createClient();

  // 2. Fetch the session data
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. SECURITY CHECK: If no user is found, redirect to login
  // NOTE: This is a secondary check; the middleware should handle most redirects.
  if (!user) {
    redirect('/login');
  }

  // 4. Determine the user's role (Requires the 'profiles' table data)
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_role')
    .eq('id', user.id)
    .single();

  const userRole = profile?.user_role || 'resident';


  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-4">Welcome, Resident!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Email: <span className="font-medium">{user.email}</span>
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Access Level: <span className="font-bold uppercase text-blue-600">{userRole}</span>
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">Account Services</h2>
        <div className="grid grid-cols-1 gap-3">
          <Button variant="outline" asChild>
             {/* This page will show the status of all requests by this resident */}
            <Link href="/account/request-status">View My Clearance Status</Link>
          </Button>
          {userRole === 'admin' && (
            <Button className="bg-red-700 hover:bg-red-800" asChild>
              {/* Only visible to the Admin role */}
              <Link href="/admin/dashboard">Go to Admin Dashboard</Link>
            </Button>
          )}
        </div>

        <form action={logout} className="mt-8">
          <Button type="submit" variant="destructive" className="w-full">
            Log Out
          </Button>
        </form>
      </div>
    </div>
  );
}