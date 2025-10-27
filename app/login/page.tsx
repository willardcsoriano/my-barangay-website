// app/login/page.tsx
import { LoginForm } from '@/components/auth/LoginForm'; // Component to be created next
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Resident Login</CardTitle>
          <CardDescription>
            Access your services and track clearance requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          
          {/* Placeholder: The actual form component where the logic lives.
            We will create this next.
          */}
          <LoginForm /> 
          
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="underline text-blue-600">
              Sign Up
            </Link>
          </div>
          <div className="mt-2 text-center text-sm">
            <Link href="/forgot-password" className="underline text-gray-500">
              Forgot Password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}