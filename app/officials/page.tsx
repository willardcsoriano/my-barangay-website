// app/officials/page.tsx

import { createClient } from '@/lib/supabase/server'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicPageLayout } from '@/components/PublicPageLayout'; // Assuming you use this layout
// Import the hierarchy to sort the results if needed, or rely on DB sorting
import { OFFICIAL_HIERARCHY } from '@/lib/utils/official-hierarchy'; 

// Define the Official type (must match DB/Server components)
type Official = {
    id: number;
    name: string;
    position: string;
    contact_number: string | null;
    image_url: string | null;
    email: string | null;
};

// --- Public Directory List Component (A simple function) ---
function PublicOfficialList({ officials }: { officials: Official[] }) {
    
    // Sort the fetched data by the fixed hierarchy order
    const sortedOfficials = officials.sort((a, b) => {
        const orderA = OFFICIAL_HIERARCHY.find(p => p.title === a.position)?.order || 99;
        const orderB = OFFICIAL_HIERARCHY.find(p => p.title === b.position)?.order || 99;
        return orderA - orderB;
    });

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedOfficials.map((official) => (
                <Card key={official.id}>
                    <CardHeader className="p-4 flex flex-row items-center">
                        <img 
                            src={official.image_url || 'https://via.placeholder.com/64x64?text=Photo'} 
                            alt={official.name} 
                            className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                        <div>
                            <CardTitle className="text-lg">{official.position}</CardTitle>
                            <p className="text-md font-semibold">{official.name}</p>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-sm text-gray-600">
                        <p>Contact: {official.contact_number || 'N/A'}</p>
                        <p>Email: {official.email || 'N/A'}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// --- Main Server Component (Public Page) ---
export default async function OfficialsDirectoryPage() {
    const supabase = await createClient();

    // ⚠️ CRITICAL: DO NOT check for 'user' or redirect for a public page!
    
    // Fetch ALL officials
    const { data: officials, error } = await supabase
        .from('officials')
        .select('*')
        .order('position', { ascending: true }) // Initial DB sort
        .order('name', { ascending: true }) as { data: Official[] | null, error: any };

    if (error) {
        console.error('Public Officials Fetch Error:', error.message);
        return <PublicPageLayout><div>Error loading directory.</div></PublicPageLayout>;
    }

    return (
        <PublicPageLayout>
            <div className="p-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">Barangay Officials Directory</h1>
                <PublicOfficialList officials={officials || []} />
            </div>
        </PublicPageLayout>
    );
}