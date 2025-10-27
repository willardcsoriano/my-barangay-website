// components/SharedNavbar.tsx
"use client";

import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";

interface SharedNavbarProps {
  userRole: 'resident' | 'admin';
}

export function SharedNavbar({ userRole }: SharedNavbarProps) {
  
  // --- Conditional Styling & Content ---
  const isAdmin = userRole === 'admin';
  
  const headerClasses = isAdmin 
    ? "bg-red-700 text-white shadow-xl" // Admin: High-contrast, serious tone
    : "bg-white text-gray-900 border-b"; // Resident: Clean, standard tone

  const homeLink = isAdmin ? '/admin/dashboard' : '/account';

  return (
    <header className={`sticky top-0 z-40 w-full ${headerClasses}`}>
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        
        {/* Logo/Home Link - Uses Role to determine where "Home" goes */}
        <Link 
          href={homeLink} 
          className="text-lg font-bold"
        >
          {isAdmin ? 'ADMIN PORTAL' : 'Barangay Services'}
        </Link>
        
        {/* Navigation & Actions */}
        <nav className="flex items-center space-x-4">
          
          {/* 1. Primary Action Link */}
          {isAdmin ? (
             <Button variant="outline" className="text-red-700 bg-white hover:bg-gray-100" asChild>
                <Link href="/admin/requests">Process Queue</Link>
             </Button>
          ) : (
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/services/clearance-request">Request Clearance</Link>
            </Button>
          )}

          {/* 2. User/Role Identifier */}
          <span className={isAdmin ? 'text-white' : 'text-gray-600'}>
            (Role: {isAdmin ? 'ADMIN' : 'RESIDENT'})
          </span>

          {/* 3. Essential Logout Button */}
          <LogoutButton />
          
        </nav>
      </div>
    </header>
  );
}