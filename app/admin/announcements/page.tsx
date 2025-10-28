// app/admin/announcements/page.tsx
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { deleteAnnouncement, saveAnnouncement } from '@/lib/admin/actions';
import { redirect } from 'next/navigation'; // <<< FIX 1: ADD MISSING REDIRECT IMPORT

// Import the new client component
import { DeleteButton } from '@/components/admin/DeleteButton'; 

// Define the Announcement type
type Announcement = {
    id: number;
    title: string;
    content: string;
    is_published: boolean;
    created_at: string;
    author_id: string;
};

// --- Form Component (Server Component Wrapper for Save/Update) ---
// (No changes here, as it's a valid Server Action wrapper)
async function AnnouncementForm({ user, announcement }: { user: any, announcement?: Announcement }) {
  async function actionWrapper(formData: FormData) {
      'use server'; 
      // The saveAnnouncement Server Action is called here
      const result = await saveAnnouncement(formData, user.id, announcement?.id);
      console.log(result.message);
    }
    
    return (
        <Card className="mt-4 border-2 border-dashed p-4">
            <CardTitle>{announcement ? 'Edit Announcement' : 'New Announcement'}</CardTitle>
            
            <form action={actionWrapper} className="grid gap-4 mt-4">
                <input type="text" name="title" defaultValue={announcement?.title} placeholder="Title" required className="border p-2 rounded" />
                <textarea name="content" defaultValue={announcement?.content} placeholder="Content" rows={5} required className="border p-2 rounded" />
                
                <div className="flex items-center space-x-2">
                    <Checkbox id={`publish-${announcement?.id || 'new'}`} name="is_published" defaultChecked={announcement?.is_published || false} />
                    <label htmlFor={`publish-${announcement?.id || 'new'}`} className="text-sm font-medium leading-none">
                        Publish Immediately
                    </label>
                </div>
                
                <Button type="submit" className="w-full">
                    {announcement ? 'Save Changes' : 'Publish New Announcement'}
                </Button>
            </form>
        </Card>
    );
}


// --- Main Server Component (Page) ---
export default async function AdminAnnouncementsPage() {
    const supabase = await createClient();
    
    // Security check (inherited from layout.tsx, but added here for safety)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    // Fetch ALL announcements (Relies on the Admin RLS policy)
    const { data: announcements, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false }) as { data: Announcement[] | null, error: any };

    if (error) {
        console.error('Admin Fetch Error:', error.message);
        return <div>Error loading announcements. Check RLS policies.</div>;
    }
    
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Manage Announcements ({announcements?.length || 0})</h1>
            
            <AnnouncementForm user={user} />
            
            <h2 className="text-2xl font-semibold mt-10 mb-4 border-b pb-2">All Announcements</h2>
            
            <div className="space-y-4">
                {announcements?.map((announcement) => (
                    <Card key={announcement.id} className={`shadow-sm ${announcement.is_published ? 'border-l-4 border-green-500' : 'border-l-4 border-gray-400'}`}>
                        <CardHeader className="flex flex-row justify-between items-start">
                            <CardTitle>{announcement.title}</CardTitle>
                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${announcement.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                {announcement.is_published ? 'PUBLISHED' : 'DRAFT'}
                            </span>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">{announcement.content.substring(0, 100)}...</p>
                            
                            <div className="flex space-x-2">
                                {/* FIX 2: Use the dedicated Client Component for Delete */}
                                <DeleteButton id={announcement.id} />
                                {/* You can add an Edit button placeholder here */}
                                <Button variant="secondary" size="sm">Edit</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}