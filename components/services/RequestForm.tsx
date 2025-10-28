// components/services/RequestForm.tsx
'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'; // Assuming you add this shadcn component
import { useState } from 'react';
import { submitClearanceRequest } from '@/lib/services/actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Assuming you add this shadcn component

interface RequestFormProps {
  residentId: string;
}

export function RequestForm({ residentId }: RequestFormProps) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clearanceType, setClearanceType] = useState<string>('');

  // Use the form action pattern for secure submission
  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setStatusMessage(null);
    
    // We pass the user's ID explicitly to the Server Action
    const result = await submitClearanceRequest(formData, residentId);
    
    if (result.error) {
      setStatusMessage(`Error: ${result.error}`);
    } else {
      setStatusMessage(`Success: ${result.message}`);
      // Optionally reset form fields here
    }
    setIsSubmitting(false);
  };

  return (
    <form action={handleSubmit} className="grid gap-6">
      
      {/* 1. Clearance Type Selection */}
      <div className="grid gap-2">
        <Label htmlFor="clearance_type">Type of Clearance/Permit</Label>
        <Select name="clearance_type" onValueChange={setClearanceType} required>
            <SelectTrigger id="clearance_type">
                <SelectValue placeholder="Select a service..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Certificate of Residency">Certificate of Residency</SelectItem>
                <SelectItem value="Business Permit Renewal">Business Permit Renewal</SelectItem>
                <SelectItem value="Indigency Certificate">Certificate of Indigency</SelectItem>
                <SelectItem value="Barangay ID">Barangay ID Application</SelectItem>
            </SelectContent>
        </Select>
      </div>

      {/* 2. Purpose/Details Input */}
      <div className="grid gap-2">
        <Label htmlFor="purpose">Purpose of Request / Details</Label>
        <Textarea 
          id="purpose" 
          name="purpose"
          placeholder="e.g., Required for job application at ABC Company, Renewal for Sari-Sari Store, etc."
          rows={4}
          required
        />
      </div>
      
      {/* 3. Status Message */}
      {statusMessage && (
        <p className={`text-sm font-medium p-3 rounded-md ${statusMessage.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {statusMessage}
        </p>
      )}

      {/* 4. Submit Button */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting Request..." : "Submit Request"}
      </Button>
    </form>
  );
}