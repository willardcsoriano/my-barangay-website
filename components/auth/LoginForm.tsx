// components/auth/LoginForm.tsx
'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

// NOTE: The 'login' function will be created in a Server Action file next!
import { login } from '@/lib/auth/actions'; 

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);

  // We use the HTML 'formAction' attribute to call the server action securely
  // The 'action' prop would typically be used for a form submission
  const handleSubmit = async (formData: FormData) => {
    setError(null);
    const result = await login(formData);
    
    if (result?.error) {
      setError(result.error);
    }
    // If successful, the server action will handle the redirect.
  };

  return (
    <form action={handleSubmit} className="grid gap-4">
      
      {/* Email Input */}
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          placeholder="juan.dela.cruz@example.com" 
          required 
        />
      </div>
      
      {/* Password Input */}
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          name="password" 
          type="password" 
          required 
        />
      </div>
      
      {/* Error Display */}
      {error && (
        <p className="text-sm font-medium text-red-500 bg-red-50 p-2 rounded">
          {error}
        </p>
      )}

      {/* Submit Button */}
      <Button type="submit" className="w-full mt-2">
        Log In
      </Button>
    </form>
  );
}