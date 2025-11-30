"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

// Fracture Portal routes - these should NOT show the legacy Navbar
const FRACTURE_ROUTES = [
  "/haven",
  "/void",
  "/nexus",
  "/conspire",
  "/scrolls",
];

export function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFractureRoute = FRACTURE_ROUTES.some(route => pathname?.startsWith(route));
  
  // Only show legacy Navbar for non-Fracture routes
  if (isFractureRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950/80">
      <Navbar />
      {children}
    </div>
  );
}

