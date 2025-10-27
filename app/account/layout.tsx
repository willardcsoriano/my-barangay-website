// app/account/layout.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SharedNavbar } from '@/components/SharedNavbar';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    
    // Check session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return redirect('/auth/login');
    }
    
    // Check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('id', user.id)
      .single();

    const userRole = profile?.user_role || 'resident';
    
    return (
        <>
            <SharedNavbar userRole={userRole} />
            <main className="min-h-[calc(100vh-64px)]">{children}</main>
        </>
    );
}