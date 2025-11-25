"use client";

import { FractureShell } from "@/components/fracture/FractureShell";
import { HeroPanel } from "@/components/fracture/HeroPanel";
import Link from "next/link";
import { ArrowRight, Home, User } from "lucide-react";

export default function HavenPage() {
  return (
    <FractureShell>
      <HeroPanel
        title="Haven"
        subtitle="Your sovereign home and profile on the Demiurge chain"
      />

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Legacy My Void Link */}
          <Link
            href="/urgeid"
            className="group p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                <Home className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-zinc-100 mb-1">
                  My Void
                </h3>
                <p className="text-sm text-zinc-400">
                  Access your UrgeID dashboard, wallet, and assets
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-zinc-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          {/* Profile Section */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-fuchsia-500/20 border border-fuchsia-500/30">
                <User className="h-6 w-6 text-fuchsia-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100">
                Profile
              </h3>
            </div>
            <p className="text-sm text-zinc-400 mb-4">
              TODO: Milestone 4.1 – integrate comprehensive user profile view
            </p>
            <p className="text-xs text-zinc-500">
              Future: Display user stats, achievements, Syzygy score, leveling progress, and more.
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 border border-cyan-500/20 rounded-xl">
          <h3 className="text-lg font-semibold text-zinc-100 mb-2">
            About Haven
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Haven is your personal sanctuary within the Demiurge ecosystem. Here you can manage your identity,
            view your assets, track your progress, and access all your sovereign tools. This is where your
            journey on the chain begins and evolves.
          </p>
        </div>
      </div>
    </FractureShell>
  );
}

