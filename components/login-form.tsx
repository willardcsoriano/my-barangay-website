// components/auth/LoginForm.tsx
'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from "next/link"; // <<< ADDED LINK IMPORT
import { useState } from 'react';

// NOTE: Uses the secure Server Action
import { login } from '@/lib/auth/actions'; 

export function LoginForm() { // Removed props/className since the wrapper page handles styling
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    
    // ADDED: Simple client-side password validation (optional, but good practice)
    if (!formData.get('password')) {
         setError("Please enter a password.");
         return;
    }

    const result = await login(formData);
    
    if (result?.error) {
      setError(result.error);
    }
    // If successful, the server action handles the redirect to /account
  };

  return (
    // FIX: Wrapped content in a div for better structure, mirroring the scaffold UX
    <div className="grid gap-4"> 
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
      
            {/* Password Input with Forgot Link */}
            <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                        href="/auth/forgot-password"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                        Forgot your password?
                    </Link>
                </div>
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

            {/* Sign Up Link */}
            <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/auth/sign-up" className="underline underline-offset-4">
                    Sign up
                </Link>
            </div>
        </form>
    </div>
  );
}