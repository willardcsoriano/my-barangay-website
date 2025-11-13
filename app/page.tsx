// app/page.tsx (Final composition)
import { createClient } from '@/lib/supabase/server'; 
import { HeroSection } from '@/components/HeroSection';
import { AnnouncementsFeed } from '@/components/AnnouncementsFeed';
import { DirectorySection } from '@/components/DirectorySection';
import { PublicPageLayout } from '@/components/PublicPageLayout'; // 

// Define the type again here for the data fetching
type Announcement = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

export default async function HomePage() {
  const supabase = await createClient();

  // 1. Fetch data for the AnnouncementsFeed
  const { data: announcements } = await supabase
    .from('announcements')
    .select('id, title, content, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(3) as { data: Announcement[] | null, error: any };

// 2. Compose the final page using the new layout wrapper
  return (
    <PublicPageLayout>
      <HeroSection />
      <AnnouncementsFeed announcements={announcements || []} />
      <DirectorySection />
    </PublicPageLayout>
  );
}