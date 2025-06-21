"use client";

import { useUser } from "@civic/auth/react";
import { AppNavbar } from "./AppNavbar";
import { LandingNavbar } from "./LandingNavbar";

export function Navbar () {
  const { user } = useUser();

  return user ? <AppNavbar /> : <LandingNavbar />;
}
