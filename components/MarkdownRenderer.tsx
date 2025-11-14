// components/MarkdownRenderer.tsx
'use client'; 

import ReactMarkdown, { Components, ExtraProps } from 'react-markdown'; // Import ExtraProps
import remarkGfm from 'remark-gfm';
import { ClassAttributes, HTMLAttributes, OlHTMLAttributes, BlockquoteHTMLAttributes } from 'react'; // Import necessary HTML attributes

// 1. Define a robust generic type for custom element renderers.
// This type merges the standard HTML attributes with the required ExtraProps 
// passed by react-markdown, satisfying the compiler.
type CustomComponentProps<T extends HTMLElement> = 
  ClassAttributes<T> & 
  HTMLAttributes<T> & 
  ExtraProps & 
  // For safety, explicitly extend common list and blockquote attributes here if needed,
  // though HTMLAttributes<T> often covers them for styling.
  (T extends HTMLOListElement ? OlHTMLAttributes<T> : {}) &
  (T extends HTMLQuoteElement ? BlockquoteHTMLAttributes<T> : {});


// 2. Define the components object using Partial<Components> and the new type structure.
// NOTE: We MUST remove the 'node' destructuring from the component signature 
// or ensure we use the props object spread correctly to satisfy the type check.
const components: Partial<Components> = {
  // Headings
  h1: (props: CustomComponentProps<HTMLHeadingElement>) => <h1 className="text-2xl font-bold mt-6 mb-2 text-gray-900" {...props} />,
  
  // FIX: Removed the redundant 'className' that caused error 17001, and applied correct type.
  h2: (props: CustomComponentProps<HTMLHeadingElement>) => <h2 className="text-xl font-semibold mt-4 mb-2 border-b pb-1 text-gray-800" {...props} />,
  
  // Paragraphs
  p: (props: CustomComponentProps<HTMLParagraphElement>) => <p className="mb-4 leading-relaxed" {...props} />,
  
  // Lists
  ul: (props: CustomComponentProps<HTMLUListElement>) => <ul className="list-disc ml-6 mb-4 space-y-1 text-gray-700" {...props} />,
  ol: (props: CustomComponentProps<HTMLOListElement>) => <ol className="list-decimal ml-6 mb-4 space-y-1 text-gray-700" {...props} />,
  
  // Emphasis
  strong: (props: CustomComponentProps<HTMLElement>) => <strong className="font-extrabold text-gray-900" {...props} />,
  em: (props: CustomComponentProps<HTMLElement>) => <em className="italic text-gray-600" {...props} />,

  // Horizontal Rule
  hr: (props: CustomComponentProps<HTMLHRElement>) => <hr className="my-4 border-t border-gray-200" {...props} />,

  // Blockquotes
  blockquote: (props: CustomComponentProps<HTMLQuoteElement>) => <blockquote className="border-l-4 border-blue-400 pl-4 py-2 italic text-gray-600" {...props} />,
};

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  return (
    <div className="markdown-body">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        components={components} 
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}