// components/PublicPageLayout.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/button'; 
import React from 'react';

// ⬅️ Import the new Client Component for the header
import { PublicHeaderClient } from './PublicHeaderClient'; 

// The Public Header component (Removed, or commented out if you keep the file)
// function PublicHeader() { ... } 

// The Footer component (remains the same)
function PublicFooter() {
  return (
    <footer className="w-full border-t p-4 text-center text-sm text-gray-500 bg-gray-50 mt-12">
      © {new Date().getFullYear()} Barangay [Your Barangay Name]. All Rights Reserved.
    </footer>
  );
}

// The main layout component that wraps the content
export function PublicPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ⬅️ Use the new responsive client header */}
      <PublicHeaderClient /> 
      <main className="flex-grow">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}