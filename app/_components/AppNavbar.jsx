"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUser } from "@civic/auth/react";

export const AppNavbar = () => {
  const pathname = usePathname();
  const { signOut } = useUser();

  const navLinks = [
    { href: '/upload', label: 'Upload' },
    { href: '/graph', label: 'Graph' },
    // { href: '/threads', label: 'Threads' },
    { href: '/flashcards', label: 'Flashcards' },
  ];

  const isActiveRoute = (href) => pathname === href;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="px-6 py-3 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-indigo-600">
          Grasp
        </Link>

        <div className="flex gap-1 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-indigo-600 px-3 py-2 transition-all rounded-md ${
                isActiveRoute(link.href)
                  ? 'bg-indigo-100 text-indigo-600 border-b-2 border-indigo-500'
                  : 'text-gray-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">
              U
            </AvatarFallback>
          </Avatar>
          <Button
            onClick={signOut}
            className="bg-red-500 hover:bg-red-600 text-white rounded px-3 py-1 text-sm cursor-pointer"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};
