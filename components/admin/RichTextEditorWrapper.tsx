// components/admin/RichTextEditorWrapper.tsx

'use client';

import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
});

export default function RichTextEditorWrapper(props: {
  initialContent?: string;
  contentInputId: string;
  placeholder?: string;
}) {
  return <RichTextEditor {...props} />;
}
