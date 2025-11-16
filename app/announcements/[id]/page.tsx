import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PublicPageLayout } from '@/components/PublicPageLayout';
import { Card, CardContent } from '@/components/ui/card';

type Announcement = {
  id: number;
  title: string;
  content: string; // HTML
  created_at: string;
};

export default async function FullAnnouncementPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  if (!params?.id || isNaN(Number(params.id))) {
    return redirect('/announcements');
  }

  const announcementId = Number(params.id);

  const { data: results, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', announcementId)
    .eq('is_published', true)
    .limit(1);

  const announcement = results?.[0];

  if (!announcement) {
    return (
      <PublicPageLayout>
        <div className="p-8 max-w-4xl mx-auto mt-12 text-center">
          <h1 className="text-4xl font-bold text-red-600">404</h1>
          <p className="text-xl text-gray-700">The requested announcement was not found.</p>
        </div>
      </PublicPageLayout>
    );
  }

  return (
    <PublicPageLayout>
      <div className="p-8 max-w-4xl mx-auto mt-12">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-2">
            {announcement.title}
          </h1>
          <p className="text-md text-gray-500">
            Published on: {new Date(announcement.created_at).toLocaleDateString()}
          </p>
        </header>

        <Card className="shadow-xl border">
          <CardContent className="pt-6">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: announcement.content }}
            />
          </CardContent>
        </Card>
      </div>
    </PublicPageLayout>
  );
}
