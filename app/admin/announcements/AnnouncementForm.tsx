// app/admin/announcements/AnnouncementForm.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { saveAnnouncement } from '@/lib/admin/actions';
import { redirect } from 'next/navigation';
import React from 'react';

import RichTextEditorWrapper from '@/components/admin/RichTextEditorWrapper';

type Announcement = {
  id: number;
  title: string;
  content: string;
  is_published: boolean;
  created_at: string;
  author_id: string;
};

export default function AnnouncementForm({ user, announcement }: { user: any; announcement?: Announcement }) {
  async function handleSubmit(formData: FormData) {
    'use server';
    await saveAnnouncement(formData, user.id, announcement?.id);
    redirect('/admin/announcements');
  }

  const contentInputId = `announcement-content-${announcement?.id ?? 'new'}`;

  return (
    <Card className="border p-4">
      <CardHeader>
        <CardTitle>{announcement ? 'Edit Announcement' : 'Create Announcement'}</CardTitle>
      </CardHeader>

      <CardContent>
        <form action={handleSubmit} className="grid gap-4">
          <input
            name="title"
            type="text"
            defaultValue={announcement?.title}
            placeholder="Title"
            required
            className="border p-2 rounded"
          />

          <input
            id={contentInputId}
            name="content"
            type="hidden"
            defaultValue={announcement?.content ?? ''}
          />

          <RichTextEditorWrapper
            initialContent={announcement?.content ?? ''}
            contentInputId={contentInputId}
            placeholder="Write your announcement..."
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              id={`publish-${announcement?.id || 'new'}`}
              name="is_published"
              defaultChecked={announcement?.is_published || false}
            />
            <label htmlFor={`publish-${announcement?.id || 'new'}`}>Publish Immediately</label>
          </div>

          <Button type="submit" className="w-full">
            {announcement ? 'Save Changes' : 'Publish Announcement'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
