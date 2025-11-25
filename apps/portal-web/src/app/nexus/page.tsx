"use client";

import { FractureShell } from "@/components/fracture/FractureShell";
import { HeroPanel } from "@/components/fracture/HeroPanel";
import { Network, Activity, Upload, Download } from "lucide-react";

export default function NexusPage() {
  return (
    <FractureShell>
      <HeroPanel
        title="Nexus"
        subtitle="P2P analytics, seeding controls, and network insights"
      />

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* P2P Analytics */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                <Activity className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100">
                P2P Analytics
              </h3>
            </div>
            <p className="text-sm text-zinc-400 mb-4">
              TODO: Milestone 4.1 – integrate P2P network analytics dashboard
            </p>
            <p className="text-xs text-zinc-500">
              Future: Real-time network topology, peer connections, bandwidth usage, and latency metrics.
            </p>
          </div>

          {/* Seeding Controls */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-fuchsia-500/20 border border-fuchsia-500/30">
                <Upload className="h-6 w-6 text-fuchsia-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100">
                Seeding Controls
              </h3>
            </div>
            <p className="text-sm text-zinc-400 mb-4">
              TODO: Milestone 4.1 – integrate Fabric seeding management
            </p>
            <p className="text-xs text-zinc-500">
              Future: Manage pinned content, seeding rewards, Syzygy score tracking, and storage allocation.
            </p>
          </div>
        </div>

        {/* Network Status */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
              <Network className="h-6 w-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-zinc-100 mb-1">
                Network Status
              </h3>
              <p className="text-sm text-zinc-400">
                TODO: Milestone 4.1 – display live network health and connectivity
              </p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 border border-cyan-500/20 rounded-xl">
          <h3 className="text-lg font-semibold text-zinc-100 mb-2">
            About Nexus
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Nexus is the control center for P2P operations on Demiurge. Here you can monitor network activity,
            manage your seeding contributions, track Syzygy rewards, and gain insights into the distributed
            infrastructure powering the chain. This is where the mesh network becomes visible.
          </p>
        </div>
      </div>
    </FractureShell>
  );
}

