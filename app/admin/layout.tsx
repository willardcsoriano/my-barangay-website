// app/admin/layout.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SharedNavbar } from '@/components/SharedNavbar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    
    // Check session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return redirect('/auth/login');
    }
    
    // Check role (Server-side)
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('id', user.id)
      .single();

    if (profile?.user_role !== 'admin') {
      return redirect('/account');
    }
    
    // Pass the role to the Navbar
    const userRole = profile?.user_role || 'resident';

    return (
        <>
            <SharedNavbar userRole={userRole} />
            <main className="min-h-[calc(100vh-64px)]">{children}</main>
            {/* You can add a footer here if needed, but a simple footer is often in the main layout */}
        </>
    );
}