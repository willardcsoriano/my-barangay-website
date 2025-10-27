// components/DirectorySection.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export function DirectorySection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Meet Your Barangay Officials
        </h2>
        <p className="text-gray-600 mb-8">
          Dedicated to serving the community of [Your Barangay Name].
        </p>
        
        {/* Placeholder Card for Barangay Captain */}
        <Card className="w-full max-w-sm mx-auto shadow-xl">
          <CardHeader>
            <CardTitle>Barangay Captain [Name]</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              "We strive for a safe and progressive community."
            </p>
            <Button variant="secondary" asChild>
              <Link href="/officials">View Full Directory</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}