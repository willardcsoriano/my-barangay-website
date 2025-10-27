// components/HeroSection.tsx
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="text-center py-16 bg-blue-50/50">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
        Welcome to Barangay [Your Barangay Name]
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Your reliable source for public services, announcements, and community updates.
      </p>
      
      {/* Primary CTAs */}
      <div className="flex justify-center space-x-4">
        {/* Link to the Clearance Request Form */}
        <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
          <Link href="/services/clearance-request">
            Request a Clearance/Permit
          </Link>
        </Button>
        
        {/* Link to the Login Page */}
        <Button variant="outline" size="lg" asChild>
          <Link href="/login">
            Resident Login / Status
          </Link>
        </Button>
      </div>
    </section>
  );
}