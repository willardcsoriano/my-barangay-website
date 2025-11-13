// app/officials/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OfficialsPage() {
  const officials = [
    { position: "Barangay Captain", name: "Hon. Juan Dela Cruz", contact: "0917-XXX-XXXX" },
    { position: "Barangay Secretary", name: "Ms. Maria Santos", contact: "0918-XXX-XXXX" },
    // Add other officials here...
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-blue-700 border-b pb-2">
        Barangay Officials and Directory
      </h1>
      <p className="mb-8 text-gray-600">
        Contact information and positions of the current Barangay leadership.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {officials.map((official) => (
          <Card key={official.name} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">{official.position}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{official.name}</p>
              <p className="text-sm text-gray-600">Contact: {official.contact}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}