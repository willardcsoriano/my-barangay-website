// components/PublicPageLayout.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button'; 
import React from 'react';

// The Public Header component
function PublicHeader() {
  return (
    <header className="w-full border-b bg-white shadow-sm sticky top-0 z-10">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        <Link href="/" className="text-xl font-extrabold text-blue-700">
          BARANGAY PORTAL
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/announcements" className="text-sm hover:underline text-gray-700">Announcements</Link>
          <Link href="/officials" className="text-sm hover:underline text-gray-700">Officials</Link>
          
          <Link href="/auth/login" passHref>
              <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                  Login/Services
              </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

// The Footer component
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
      <PublicHeader />
      <main className="flex-grow">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}