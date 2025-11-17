// components/DirectorySection.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export function DirectorySection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        
        {/* Responsive heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          Meet Your Barangay Officials
        </h2>

        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          Dedicated to serving the community of Marikina Heights.
        </p>
        
        <Card className="w-full max-w-sm mx-auto shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl break-words">
              Barangay Captain Hon. Miguel “Greg” Punzalan
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-gray-600 mb-4 break-words">
              "We strive for a safe and progressive community."
            </p>

            <Button variant="secondary" className="w-full sm:w-auto" asChild>
              <Link href="/officials">View Full Directory</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
