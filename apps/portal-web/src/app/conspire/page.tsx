"use client";

import { FractureShell } from "@/components/fracture/FractureShell";
import { HeroPanel } from "@/components/fracture/HeroPanel";
import { Sparkles, MessageSquare, Zap, BookOpen } from "lucide-react";

export default function ConspirePage() {
  return (
    <FractureShell>
      <HeroPanel
        title="Conspire"
        subtitle="Commune with the Archon: AI-powered assistance for developers and creators"
      />

      <div className="space-y-6">
        {/* Main Chat Interface Placeholder */}
        <div className="p-8 bg-white/5 border border-white/10 rounded-xl min-h-[400px] flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 border border-cyan-500/30">
              <Sparkles className="h-6 w-6 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-zinc-100 mb-1">
                ArchonAI Assistant
              </h3>
              <p className="text-sm text-zinc-400">
                TODO: Milestone 4.1 – integrate ArchonAI chat interface
              </p>
            </div>
          </div>

          {/* Chat Placeholder */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4 max-w-md">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 border border-cyan-500/30">
                <MessageSquare className="h-8 w-8 text-cyan-400" />
              </div>
              <div>
                <p className="text-zinc-300 font-medium mb-2">
                  ArchonAI Chat Interface
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  This will integrate an LLM assistant for dev tasks, documentation queries,
                  creation workflows, and general assistance with the Demiurge ecosystem.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <div className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30 w-fit mb-4">
              <Zap className="h-5 w-5 text-cyan-400" />
            </div>
            <h4 className="text-lg font-semibold text-zinc-100 mb-2">
              Dev Assistance
            </h4>
            <p className="text-sm text-zinc-400">
              Get help with SDK integration, API usage, and development workflows.
            </p>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <div className="p-3 rounded-lg bg-fuchsia-500/20 border border-fuchsia-500/30 w-fit mb-4">
              <BookOpen className="h-5 w-5 text-fuchsia-400" />
            </div>
            <h4 className="text-lg font-semibold text-zinc-100 mb-2">
              Documentation
            </h4>
            <p className="text-sm text-zinc-400">
              Query the docs, get code examples, and understand system architecture.
            </p>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30 w-fit mb-4">
              <Sparkles className="h-5 w-5 text-purple-400" />
            </div>
            <h4 className="text-lg font-semibold text-zinc-100 mb-2">
              Creation Workflows
            </h4>
            <p className="text-sm text-zinc-400">
              Guidance on minting NFTs, creating worlds, and building on-chain experiences.
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 border border-cyan-500/20 rounded-xl">
          <h3 className="text-lg font-semibold text-zinc-100 mb-2">
            About Conspire
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Conspire is your gateway to ArchonAI, an intelligent assistant powered by advanced language models.
            Use it to get help with development tasks, understand documentation, explore creation workflows,
            and receive guidance on building within the Demiurge ecosystem. This is where human creativity
            meets artificial intelligence in service of sovereign creation.
          </p>
        </div>
      </div>
    </FractureShell>
  );
}

