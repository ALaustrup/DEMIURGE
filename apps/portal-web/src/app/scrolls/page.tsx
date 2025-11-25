"use client";

import { FractureShell } from "@/components/fracture/FractureShell";
import { HeroPanel } from "@/components/fracture/HeroPanel";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, GraduationCap } from "lucide-react";

export default function ScrollsPage() {
  return (
    <FractureShell>
      <HeroPanel
        title="Scrolls"
        subtitle="Documentation, lore, and knowledge repository"
      />

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Legacy Docs Link */}
          <Link
            href="/docs"
            className="group p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                <BookOpen className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-zinc-100 mb-1">
                  Documentation
                </h3>
                <p className="text-sm text-zinc-400">
                  Access technical docs, API references, and guides
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-zinc-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          {/* Learning Resources */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-fuchsia-500/20 border border-fuchsia-500/30">
                <GraduationCap className="h-6 w-6 text-fuchsia-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100">
                Learning
              </h3>
            </div>
            <p className="text-sm text-zinc-400 mb-4">
              TODO: Milestone 4.1 – integrate learning resources and tutorials
            </p>
            <p className="text-xs text-zinc-500">
              Future: Interactive tutorials, video guides, and step-by-step walkthroughs.
            </p>
          </div>
        </div>

        {/* Lore Section */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
              <FileText className="h-6 w-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-zinc-100 mb-1">
                Lore & Mythology
              </h3>
              <p className="text-sm text-zinc-400">
                TODO: Milestone 4.1 – integrate Demiurge lore repository
              </p>
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-4">
            Future: Explore the rich mythology of the Demiurge universe, the Seven Archons, the Nomads,
            and the stories that shape the sovereign digital pantheon.
          </p>
        </div>

        {/* Info Section */}
        <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 border border-cyan-500/20 rounded-xl">
          <h3 className="text-lg font-semibold text-zinc-100 mb-2">
            About Scrolls
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Scrolls is the repository of all knowledge within the Demiurge ecosystem. Here you can find
            technical documentation, learn how to build on the chain, explore the lore and mythology,
            and access all resources needed to understand and contribute to the sovereign digital pantheon.
          </p>
        </div>
      </div>
    </FractureShell>
  );
}

