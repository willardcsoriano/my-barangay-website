// components/HeroSection.tsx
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="text-center py-16 bg-blue-50/50 px-4">
      {/* Responsive heading */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
        Welcome to Barangay Marikina Heights
      </h1>

      <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto">
        Your reliable source for public services, announcements, and community updates.
      </p>

      {/* CTAs - stack on mobile */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md mx-auto">
        
        <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto" asChild>
          <Link href="/services/clearance-request">
            Request Clearance/Permit
          </Link>
        </Button>

        <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
          <Link href="/auth/login">
            Resident Login / Status
          </Link>
        </Button>

      </div>
    </section>
  );
}
