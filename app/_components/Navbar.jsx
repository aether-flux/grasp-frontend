"use client";

import { useUser } from "@civic/auth/react";

export function Navbar () {
  const { user } = useUser();

  return session ? <AppNavbar /> : <LandingNavbar />;
}
