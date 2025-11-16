// components/admin/RichTextEditor.tsx
'use client';

import { useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';

import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import History from '@tiptap/extension-history';

import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconList,
  IconListNumbers,
  IconTable,
  IconUndo,
  IconRedo,
  IconLink,
  IconImage,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
} from './rich-icons';

interface RichTextEditorProps {
  initialContent?: string;
  contentInputId: string;
  placeholder?: string;
}

export default function RichTextEditor({
  initialContent = '',
  contentInputId,
  placeholder = 'Start writing…',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
        StarterKit.configure({
            heading: { levels: [1, 2, 3] },
        }),
        Underline,
        TextStyle,
        Color,
        Link.configure({ openOnClick: true }),
        Image,
        Table.configure({ resizable: true }),
        TableRow,
        TableHeader,
        TableCell,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        Placeholder.configure({ placeholder }),
    ],

    content: initialContent || '<p></p>',

    immediatelyRender: false,

    editorProps: {
        attributes: {
        key: contentInputId,
        },
    },
    });

  // sync editor HTML → hidden input
  useEffect(() => {
    if (!editor) return;

    const el = document.getElementById(contentInputId) as HTMLInputElement | null;
    if (!el) return;

    el.value = editor.getHTML();

    const update = () => {
      el.value = editor.getHTML();
      el.dispatchEvent(new Event('input', { bubbles: true }));
    };

    editor.on('update', update);

    return () => {
      if (editor) {
        editor.off('update', update);
      }
    };
  }, [editor, contentInputId]);

  const run = useCallback(
    (fn: (e: any) => void) => {
      if (!editor) return;
      fn(editor);
      editor.view.focus();
    },
    [editor]
  );

  if (!editor) return <div>Loading editor…</div>;

  return (
    <div className="prose max-w-none">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-3">
        <ToolbarButton onClick={() => run(e => e.chain().focus().toggleBold().run())} active={editor.isActive('bold')}>
          <IconBold />
        </ToolbarButton>

        <ToolbarButton onClick={() => run(e => e.chain().focus().toggleItalic().run())} active={editor.isActive('italic')}>
          <IconItalic />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => run(e => e.chain().focus().toggleUnderline().run())}
          active={editor.isActive('underline')}
        >
          <IconUnderline />
        </ToolbarButton>

        <ToolbarButton onClick={() => run(e => e.chain().focus().toggleBulletList().run())} active={editor.isActive('bulletList')}>
          <IconList />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => run(e => e.chain().focus().toggleOrderedList().run())}
          active={editor.isActive('orderedList')}
        >
          <IconListNumbers />
        </ToolbarButton>

        <ToolbarButton onClick={() => run(e => e.chain().focus().setTextAlign('left').run())} active={editor.isActive({ textAlign: 'left' })}>
          <IconAlignLeft />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => run(e => e.chain().focus().setTextAlign('center').run())}
          active={editor.isActive({ textAlign: 'center' })}
        >
          <IconAlignCenter />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => run(e => e.chain().focus().setTextAlign('right').run())}
          active={editor.isActive({ textAlign: 'right' })}
        >
          <IconAlignRight />
        </ToolbarButton>

        <ToolbarButton onClick={() => run(e => e.chain().focus().undo().run())}>
          <IconUndo />
        </ToolbarButton>

        <ToolbarButton onClick={() => run(e => e.chain().focus().redo().run())}>
          <IconRedo />
        </ToolbarButton>

        {/* Link */}
        <ToolbarButton
          onClick={() => {
            const url = prompt('Enter URL');
            if (url) run(e => e.chain().focus().extendMarkRange('link').setLink({ href: url }).run());
          }}
        >
          <IconLink />
        </ToolbarButton>

        {/* Image */}
        <ToolbarButton
          onClick={() => {
            const src = prompt('Image URL');
            if (src) run(e => e.chain().focus().setImage({ src }).run());
          }}
        >
          <IconImage />
        </ToolbarButton>

        {/* Table */}
        <ToolbarButton onClick={() => run(e => e.chain().focus().insertTable({ rows: 2, cols: 3, withHeaderRow: true }).run())}>
          <IconTable />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div className="border rounded p-4 bg-white h-[400px] overflow-y-auto">
        <EditorContent
            editor={editor}
            className="h-full outline-none overflow-y-auto ProseMirror-editor"
        />
      </div>


    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  active,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`inline-flex items-center justify-center px-2 py-1 border rounded text-sm ${
        active ? 'bg-gray-200' : 'bg-white'
      } hover:bg-gray-100`}
    >
      {children}
    </button>
  );
}
