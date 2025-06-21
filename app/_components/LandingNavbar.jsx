"use client";

import Link from "next/link";
import { useUser } from "@civic/auth/react";
import { Button } from "@/components/ui/button";

export function LandingNavbar () {
  const { signIn } = useUser();

  const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-md border-b border-gray-100 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
          <a href="/" className="font-semibold text-xl text-indigo-600">Grasp</a>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => scrollToSection('features')} 
              className="hover:underline underline-offset-4 transition text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              Features
            </button>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-md px-4 py-1.5 cursor-pointer" onClick={signIn}>
              Login
            </Button>
          </div>
        </nav>

    );
  }
