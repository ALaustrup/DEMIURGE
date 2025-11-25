"use client";

import { FractureShell } from "@/components/fracture/FractureShell";
import { HeroPanel } from "@/components/fracture/HeroPanel";
import Link from "next/link";
import { ArrowRight, Code, FolderKanban, BookOpen } from "lucide-react";

export default function VoidPage() {
  return (
    <FractureShell>
      <HeroPanel
        title="Void"
        subtitle="Developer HQ: Build, deploy, and manage your Demiurge projects"
      />

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Legacy Developers Link */}
          <Link
            href="/developers"
            className="group p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                <Code className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-zinc-100 mb-1">
                  Developer Portal
                </h3>
                <p className="text-sm text-zinc-400">
                  Access the Developer Registry, projects, and tools
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-zinc-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          {/* Dev Capsules */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-fuchsia-500/20 border border-fuchsia-500/30">
                <FolderKanban className="h-6 w-6 text-fuchsia-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100">
                Dev Capsules
              </h3>
            </div>
            <p className="text-sm text-zinc-400 mb-4">
              TODO: Milestone 4.1 – integrate Dev Capsules management interface
            </p>
            <p className="text-xs text-zinc-500">
              Create and manage project-bound execution environments tracked on-chain.
            </p>
          </div>
        </div>

        {/* Recursion Engine */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
              <Code className="h-6 w-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-zinc-100 mb-1">
                Recursion Engine
              </h3>
              <p className="text-sm text-zinc-400">
                Chain-native game engine for creating sovereign worlds
              </p>
            </div>
            <Link
              href="/scrolls/developers/recursion"
              className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all text-sm font-medium"
            >
              <BookOpen className="h-4 w-4 inline mr-2" />
              Docs
            </Link>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 border border-cyan-500/20 rounded-xl">
          <h3 className="text-lg font-semibold text-zinc-100 mb-2">
            About Void
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Void is the command center for developers building on Demiurge. Here you can manage your projects,
            create Dev Capsules, interact with the Recursion Engine, and access all developer tools and resources.
            This is where the future of sovereign development takes shape.
          </p>
        </div>
      </div>
    </FractureShell>
  );
}

