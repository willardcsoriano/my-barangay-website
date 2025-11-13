// app/admin/officials/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { saveOfficial, deleteOfficial } from '@/lib/admin/actions';
import { DeleteButton } from '@/components/admin/DeleteButton'; // Re-use the delete component logic

// Define the Official type
type Official = {
    id: number;
    name: string;
    position: string;
    contact_number: string | null;
    ordering: number;
};

// --- Form Component (Server Component Wrapper for Save/Update) ---
async function OfficialForm({ official }: { official?: Official }) {
    
    // Server Action Wrapper that calls the core saveOfficial function
    async function actionWrapper(formData: FormData) {
        'use server';
        // Note: The form handles creating a new official or updating an existing one
        const result = await saveOfficial(formData, official?.id);
        console.log(result.message);
        // In a real app, you would handle client-side messages
    }

    return (
        <Card className="mt-4 border-2 border-dashed p-4">
            <CardTitle className="mb-4">{official ? 'Edit Official' : 'Add New Official'}</CardTitle>
            
            <form action={actionWrapper} className="grid gap-4 md:grid-cols-2">
                
                <div className="grid gap-2">
                    <Label htmlFor="position">Position Title</Label>
                    <Input id="position" name="position" defaultValue={official?.position} placeholder="Barangay Captain" required />
                </div>
                
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" defaultValue={official?.name} placeholder="Hon. Juan Dela Cruz" required />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="contact_number">Contact Number</Label>
                    <Input id="contact_number" name="contact_number" defaultValue={official?.contact_number || ''} placeholder="09XX-XXX-XXXX" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="ordering">Order (Lower is first)</Label>
                    <Input id="ordering" name="ordering" type="number" defaultValue={official?.ordering} placeholder="10" />
                </div>
                
                <Button type="submit" className="w-full md:col-span-2 mt-4">
                    {official ? 'Save Changes' : 'Add Official'}
                </Button>
            </form>
        </Card>
    );
}

// --- Main Server Component (Page) ---
export default async function AdminOfficialsPage() {
    const supabase = await createClient();

    // Security Check (ensured by app/admin/layout.tsx, but good to retain basic checks)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');
    // Note: The admin role check is mandatory in app/admin/layout.tsx

    // Fetch ALL officials
    const { data: officials, error } = await supabase
        .from('officials')
        .select('*')
        .order('ordering', { ascending: true })
        .order('name', { ascending: true }) as { data: Official[] | null, error: any };

    if (error) {
        console.error('Officials Fetch Error:', error.message);
        return <div>Error loading officials list.</div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Manage Officials Directory ({officials?.length || 0})</h1>

            {/* Form to Add New Official */}
            <OfficialForm />

            <h2 className="text-2xl font-semibold mt-10 mb-4 border-b pb-2">Current Officials</h2>
            
            <div className="space-y-4">
                {(officials || []).map((official) => (
                    <Card key={official.id} className="shadow-sm border-l-4 border-blue-500">
                        <CardHeader className="flex flex-row justify-between items-start">
                            <div>
                                <CardTitle className="text-xl">{official.position}</CardTitle>
                                <p className="text-lg font-semibold text-gray-700">{official.name}</p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                Order: {official.ordering}
                            </span>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">Contact: {official.contact_number || 'N/A'}</p>
                            
                            <div className="flex space-x-2">
                                {/* Use Delete Button component */}
                                <DeleteButton id={official.id} action={deleteOfficial} />
                                {/* Placeholder for Edit (This would toggle the OfficialForm with data) */}
                                <Button variant="secondary" size="sm">Edit</Button> 
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}