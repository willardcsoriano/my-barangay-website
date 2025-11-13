'use client';

import { useState } from 'react';
import { redirect, useRouter } from 'next/navigation'; 

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Assuming these Server Actions are correctly defined elsewhere
import { saveOfficial, deleteOfficial } from '@/lib/admin/actions';
import { DeleteButton } from '@/components/admin/DeleteButton'; 

import { OFFICIAL_HIERARCHY } from '@/lib/utils/official-hierarchy';

// Define the Official type (Cleaned up: No 'ordering' field)
type Official = {
    id: number;
    name: string;
    position: string; 
    contact_number: string | null;
    image_url: string | null;
    email: string | null;     
};

// --- OfficialForm Component ---
function OfficialForm({ official, onSave }: { official?: Official, onSave: () => void }) {
    
    // Server Action Wrapper
    async function actionWrapper(formData: FormData) {
        // REMOVED: All code related to reading and setting 'ordering' from the form
        
        // The saveOfficial server action handles the file upload and database update
        const result = await saveOfficial(formData, official?.id);
        console.log(result.message);
        
        onSave();
    }

    return (
        <Card className={`mt-4 border-2 p-4 ${official ? 'border-yellow-400' : 'border-dashed border-blue-500'}`}>
            <CardTitle className="mb-4">{official ? 'Edit Official' : 'Add New Official'}</CardTitle>
            
            <form action={actionWrapper} className="grid gap-4 md:grid-cols-2">
                
                {/* --- UPDATED FIELD: Position Dropdown --- */}
                <div className="grid gap-2">
                    <Label htmlFor={`position-${official?.id || 'new'}`}>Position Title (Order is fixed)</Label>
                    <select 
                        id={`position-${official?.id || 'new'}`} 
                        name="position" 
                        defaultValue={official?.position} 
                        required 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="" disabled>Select a Position</option>
                        {OFFICIAL_HIERARCHY.map((p) => (
                            <option key={p.id} value={p.title}>
                                {p.title} (Order: {p.order})
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="grid gap-2">
                    <Label htmlFor={`name-${official?.id || 'new'}`}>Name</Label>
                    <Input id={`name-${official?.id || 'new'}`} name="name" defaultValue={official?.name} placeholder="Hon. Juan Dela Cruz" required />
                </div>

                {/* --- NEW FIELD: Email --- */}
                <div className="grid gap-2">
                    <Label htmlFor={`email-${official?.id || 'new'}`}>Email Address</Label>
                    <Input 
                        id={`email-${official?.id || 'new'}`} 
                        name="email" 
                        type="email" 
                        defaultValue={official?.email || ''} 
                        placeholder="juan.delacruz@barangay.ph" 
                    />
                </div>
                
                {/* --- UPDATED FIELD: File Input for Photo --- */}
                <div className="grid gap-2">
                    <Label htmlFor={`image-${official?.id || 'new'}`}>Profile Photo (Upload)</Label>
                    <Input 
                        id={`image-${official?.id || 'new'}`} 
                        name="image" 
                        type="file" 
                        accept="image/*"
                    />
                    {/* Hidden field to pass existing URL back to the action */}
                    <input 
                        type="hidden" 
                        name="current_image_url" 
                        defaultValue={official?.image_url || ''} 
                    />
                    {official?.image_url && (
                        <p className="text-xs text-gray-500 mt-1">Current photo is set. Uploading a new file will replace it.</p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor={`contact_number-${official?.id || 'new'}`}>Contact Number</Label>
                    <Input id={`contact_number-${official?.id || 'new'}`} name="contact_number" defaultValue={official?.contact_number || ''} placeholder="09XX-XXX-XXXX" />
                </div>
                
                {/* REMOVED: The old 'ordering' input field */}

                <Button type="submit" className="w-full md:col-span-2 mt-4">
                    {official ? 'Save Changes' : 'Add Official'}
                </Button>
            </form>
        </Card>
    );
}

// --- OfficialList Component ---
function OfficialList({ initialOfficials }: { initialOfficials: Official[] }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const router = useRouter(); 

    const handleActionComplete = () => {
        setEditingId(null); 
        router.refresh(); 
    };
    
    // For a new official, we'll force a full navigation to ensure the new item appears
    const handleNewOfficialSave = () => {
        router.push('/admin/officials');
        router.refresh();
    };

    // Helper to find the order number for display purposes
    const getDisplayOrder = (position: string) => {
        const item = OFFICIAL_HIERARCHY.find(p => p.title === position);
        return item ? item.order : 'N/A';
    };

    return (
        <div className="space-y-4">
             {/* Pass the save handler for adding new officials */}
             <OfficialForm onSave={handleNewOfficialSave} /> 

             <h2 className="text-2xl font-semibold mt-10 mb-4 border-b pb-2">Current Officials</h2>
             
            {initialOfficials.map((official) => (
                <Card key={official.id} className={`shadow-sm transition-all duration-300 ${editingId === official.id ? 'border-4 border-yellow-500' : 'border-l-4 border-blue-500'}`}>
                    {editingId === official.id ? (
                        <CardContent className="p-6">
                            <OfficialForm official={official} onSave={handleActionComplete} />
                            <Button 
                                variant="outline" 
                                onClick={() => setEditingId(null)}
                                className="mt-4 w-full"
                            >
                                Cancel Edit
                            </Button>
                        </CardContent>
                    ) : (
                        // Render the official display card
                        <div className="flex items-center p-6"> 
                            
                            {/* --- Official Photo Display (using image_url) --- */}
                            <div className="mr-4 flex-shrink-0">
                                <img 
                                    src={official.image_url || 'https://via.placeholder.com/64x64?text=No+Photo'} 
                                    alt={official.name} 
                                    className="w-16 h-16 rounded-full object-cover border"
                                />
                            </div>
                            
                            <div className="flex-grow">
                                <CardHeader className="flex flex-row justify-between items-start p-0 mb-2">
                                    <div>
                                        <CardTitle className="text-xl">{official.position}</CardTitle>
                                        <p className="text-lg font-semibold text-gray-700">{official.name}</p>
                                    </div>
                                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                        Order: {getDisplayOrder(official.position)} {/* FIXED: Get order from position */}
                                    </span>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {/* --- NEW: Email Display --- */}
                                    <p className="text-sm text-gray-600">Email: **{official.email || 'N/A'}**</p>
                                    <p className="text-sm text-gray-600 mb-4">Contact: **{official.contact_number || 'N/A'}**</p>
                                    
                                    <div className="flex space-x-2">
                                        <Button 
                                            variant="secondary" 
                                            size="sm"
                                            onClick={() => setEditingId(official.id)}
                                        >
                                            Edit Official
                                        </Button> 
                                        <DeleteButton id={official.id} action={deleteOfficial} onActionComplete={handleActionComplete} />
                                    </div>
                                </CardContent>
                            </div>
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );
}

// Export the main client component wrapper
export default OfficialList;