// components/PublicHeaderClient.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; 
import { Menu, X } from 'lucide-react'; // Assuming you have lucide-react installed

export function PublicHeaderClient() {
  const [isOpen, setIsOpen] = useState(false);
  
  const NavLinks = (
    <>
      <Link href="/announcements" className="text-sm hover:underline text-gray-700" onClick={() => setIsOpen(false)}>Announcements</Link>
      <Link href="/officials" className="text-sm hover:underline text-gray-700" onClick={() => setIsOpen(false)}>Officials</Link>
      
      <Link href="/auth/login" passHref>
          <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => setIsOpen(false)}>
              Login/Services
          </Button>
      </Link>
    </>
  );

  return (
    <header className="w-full border-b bg-white shadow-sm sticky top-0 z-10">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        
        {/* Logo/Title */}
        <Link href="/" className="text-xl font-extrabold text-blue-700">
          BARANGAY PORTAL
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {NavLinks}
        </nav>

        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown (Conditionally Rendered) */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-white border-t shadow-lg z-20">
          <nav className="flex flex-col space-y-3 p-4">
            {/* The links are rendered vertically for mobile */}
            {NavLinks}
          </nav>
        </div>
      )}
    </header>
  );
}