"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Code, Network, BookOpen, Sparkles, Fingerprint } from "lucide-react";
import { useState } from "react";
import { AbyssIDDialog } from "./AbyssIDDialog";

const navItems = [
  { href: "/haven", label: "Haven", icon: Home, description: "User home & profile" },
  { href: "/void", label: "Void", icon: Code, description: "Developer HQ" },
  { href: "/nexus", label: "Nexus", icon: Network, description: "P2P analytics & seeding" },
  { href: "/scrolls", label: "Scrolls", icon: BookOpen, description: "Docs & lore" },
  { href: "/conspire", label: "Conspire", icon: Sparkles, description: "AI/LLM interaction" },
];

export function FractureNav() {
  const pathname = usePathname();
  const [showAbyssID, setShowAbyssID] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo / Brand */}
            <Link
              href="/"
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-500 hover:from-cyan-300 hover:via-fuchsia-400 hover:to-purple-400 transition-all duration-300"
            >
              FRACTURE
            </Link>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-lg
                      transition-all duration-200 ease-in-out
                      ${isActive
                        ? "text-cyan-400 bg-white/10"
                        : "text-zinc-400 hover:text-cyan-300 hover:bg-white/5"
                      }
                      group
                    `}
                    title={item.description}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* AbyssID Button */}
            <button
              onClick={() => setShowAbyssID(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 border border-cyan-500/30 text-cyan-300 hover:from-cyan-500/30 hover:to-fuchsia-500/30 hover:text-cyan-200 transition-all duration-200"
            >
              <Fingerprint className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">AbyssID</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-white/10">
          <div className="flex items-center justify-around px-2 py-2 overflow-x-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex flex-col items-center justify-center px-3 py-2 rounded-lg min-w-[60px]
                    transition-all duration-200
                    ${isActive
                      ? "text-cyan-400 bg-white/10"
                      : "text-zinc-400"
                    }
                  `}
                  title={item.description}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* AbyssID Dialog */}
      {showAbyssID && (
        <AbyssIDDialog
          open={showAbyssID}
          onClose={() => setShowAbyssID(false)}
        />
      )}
    </>
  );
}

