"use client";

import { motion } from "framer-motion";
import { Activity, CircuitBoard, Sparkles, Users } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { DEMIURGE_RPC_URL } from "@/config/demiurge";

type ChainInfo = {
  height: number;
};

export default function HomePage() {
  const [chainInfo, setChainInfo] = useState<ChainInfo | null>(null);
  const [rpcError, setRpcError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChainInfo = async () => {
      try {
        const res = await axios.post(DEMIURGE_RPC_URL, {
          jsonrpc: "2.0",
          method: "cgt_getChainInfo",
          params: null,
          id: 1,
        });

        if (res.data.error) {
          setRpcError(res.data.error.message ?? "Unknown RPC error");
          setChainInfo(null);
          return;
        }

        setChainInfo(res.data.result as ChainInfo);
        setRpcError(null);
      } catch (err: any) {
        setRpcError(err.message ?? "Failed to reach Demiurge node");
        setChainInfo(null);
      }
    };

    fetchChainInfo();
    const interval = setInterval(fetchChainInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-16 px-6 py-12 overflow-hidden">
      {/* Logo Background with Glass Effect */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-5xl max-h-5xl mx-auto">
            {/* Logo Image with blur and transparency */}
            <img
              src="/demiurge-logo2.png"
              alt="Demiurge Logo"
              className="absolute inset-0 w-full h-full object-contain"
              style={{
                opacity: 0.12,
                filter: "blur(4px) brightness(0.85) contrast(1.2)",
              }}
              onError={(e) => {
                // Silently handle missing logo - don't show broken image
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {/* Glass morphism overlay with salmon pink tint */}
            <div 
              className="absolute inset-0 backdrop-blur-2xl"
              style={{
                background: "radial-gradient(circle at center, rgba(251, 113, 133, 0.08) 0%, transparent 65%)",
                maskImage: "radial-gradient(ellipse at center, black 35%, transparent 70%)",
                WebkitMaskImage: "radial-gradient(ellipse at center, black 35%, transparent 70%)",
                mixBlendMode: "overlay",
              }}
            />
            {/* Additional glow effect */}
            <div 
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse at center, rgba(251, 113, 133, 0.12) 0%, rgba(244, 63, 94, 0.06) 40%, transparent 70%)",
                mixBlendMode: "screen",
                filter: "blur(20px)",
              }}
            />
            {/* Subtle border glow */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(ellipse at center, transparent 60%, rgba(251, 113, 133, 0.1) 80%, transparent 100%)",
                filter: "blur(40px)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Content with relative positioning */}
      <div className="relative z-10">
      {/* HERO */}
      <section className="grid gap-10 md:grid-cols-[2fr,1fr] items-center">
        <div className="space-y-6">
          <motion.h1
            className="text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Demiurge
            <span className="block text-xl font-normal text-slate-400 sm:text-2xl">
              The Sovereign Digital Pantheon for creators, gamers, and AI.
            </span>
          </motion.h1>

          <motion.p
            className="max-w-2xl text-sm text-slate-300 sm:text-base"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            A sovereign L1 blockchain where{" "}
            <span className="font-semibold text-sky-400">UrgeIDs</span> (sovereign identities, accessible via "My Void" in the portal) and{" "}
            <span className="font-semibold text-violet-300">Archons</span> (creators) mint, trade, and experience D-GEN NFTs, streamed over the Fabric P2P
            network and traded in the Abyss marketplace. Through{" "}
            <span className="font-semibold text-violet-300">Syzygy</span> (P2P data seeding),
            UrgeIDs earn Syzygy Scores and level up, earning CGT rewards.{" "}
            <span className="font-semibold text-amber-400">Luminaries</span> emerge as
            distinguished badges for those who reach the highest Syzygy thresholds. The platform includes a full social layer with World Chat, Direct Messages, and media sharing, all powered by the Creator God
            Token (CGT).
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <button
              onClick={() => (window.location.href = "/urgeid")}
              className="rounded-full bg-rose-500 px-5 py-2 text-sm font-medium text-slate-950 shadow-lg shadow-rose-500/30 hover:bg-rose-400"
            >
              Enter My Void
            </button>
            <button 
              onClick={() => window.location.href = "/docs"}
              className="rounded-full border border-slate-700 px-5 py-2 text-sm text-slate-200 hover:border-slate-500"
            >
              Read the Architecture
            </button>
          </motion.div>
        </div>

        {/* LIVE CHAIN CARD */}
        <motion.div
          className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-sky-900/30"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
              <Activity className="h-4 w-4 text-sky-400" />
              Live Chain Status
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
              PHASE 5 • DEVNET
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            {chainInfo && !rpcError && (
              <>
                <div className="flex justify-between">
                  <span>Height</span>
                  <span className="font-mono text-sky-300">
                    #{chainInfo.height}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>RPC</span>
                  <span className="max-w-[180px] truncate font-mono text-slate-400">
                    {DEMIURGE_RPC_URL}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Health</span>
                  <span className="font-semibold text-emerald-400">
                    NODE ONLINE
                  </span>
                </div>
              </>
            )}

            {rpcError && (
              <div className="space-y-2">
                <p className="text-xs text-rose-400">
                  Unable to reach Demiurge node.
                </p>
                <p className="text-[11px] text-slate-500">
                  Check that the Rust node is running on{" "}
                  <span className="font-mono">127.0.0.1:8545</span> or set{" "}
                  <span className="font-mono">NEXT_PUBLIC_DEMIURGE_RPC_URL</span>.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* PILLARS */}
      <section className="grid gap-6 md:grid-cols-3">
        <PillarCard
          icon={<CircuitBoard className="h-4 w-4" />}
          title="Sovereign L1"
          body="A custom Rust L1 with Forge PoW, CGT, and verifiable runtime modules for bank, NFTs, Fabric, and Abyss."
        />
        <PillarCard
          icon={<Users className="h-4 w-4" />}
          title="My Void & Syzygy"
          body="Every user has an UrgeID (accessible via 'My Void' in the portal) — a sovereign identity on the Demiurge chain. Through Syzygy (P2P data seeding), UrgeIDs earn Syzygy Scores and level up, automatically earning 10 CGT per level. Luminaries are badges earned at the highest thresholds."
        />
        <PillarCard
          icon={<Sparkles className="h-4 w-4" />}
          title="D-GEN NFTs"
          body="AI-native, provenance-rich NFTs anchored to Fabric content and traded in the Abyss marketplace with programmable royalties."
        />
      </section>

      {/* HIGH-LEVEL ARCHITECTURE TEXT BLOCK */}
      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
        <h2 className="text-lg font-semibold text-slate-100">
          The Demiurge Stack
        </h2>
        <p className="text-sm text-slate-300">
          Demiurge is a modular but sovereign L1: UrgeID-operated nodes run Forge
          PoW and host Fabric content; the CGT bank module tracks balances; the
          D-GEN runtime mints NFTs with embedded AI provenance; Fabric anchors
          immutable content roots; the UrgeID Registry tracks profiles, handles, and badges;
          and Abyss provides a native marketplace for licenses and assets.
        </p>
        <p className="text-xs text-slate-500">
          This portal is a first window into the Pantheon. Create your UrgeID, mint D-GEN NFTs,
          earn CGT for seeding other creators' work, and browse live Fabric
          worlds and Abyss listings directly.
        </p>
      </section>
      </div>
    </main>
  );
}

function PillarCard(props: { icon: React.ReactNode; title: string; body: string }) {
  const { icon, title, body } = props;
  return (
    <motion.div
      className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 shadow-md shadow-slate-950/40"
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/15 text-sky-300">
          {icon}
        </span>
        {title}
      </div>
      <p className="text-xs text-slate-300">{body}</p>
    </motion.div>
  );
}
