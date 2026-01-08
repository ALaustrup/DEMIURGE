"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Download, 
  Rocket, 
  Shield, 
  Zap,
  FileText,
  Github,
  Network,
  Palette
} from "lucide-react";
import { LaunchCountdown } from "@/components/countdown/LaunchCountdown";
import { DownloadModal } from "@/components/modals/DownloadModal";
import { QorIDDialog } from "@/components/fracture/QorIDDialog";
import { ServerStatus } from "@/components/status/ServerStatus";
import { BackgroundVideo } from "@/components/video/BackgroundVideo";
import Link from "next/link";

export default function HomePage() {
  const [showDownload, setShowDownload] = useState(false);
  const [showQorID, setShowQorID] = useState(false);
  
  const launchDate = new Date('2026-01-10T12:00:00Z');

  const features = [
    {
      icon: Shield,
      title: "QOR ID Identity",
      description: "Sovereign digital identity with on-chain authentication and encrypted storage",
      color: "from-cyan-500 to-blue-600",
    },
    {
      icon: Zap,
      title: "Native Mining",
      description: "CPU/GPU mining with 10x efficiency compared to web-based solutions",
      color: "from-orange-500 to-red-600",
    },
    {
      icon: Palette,
      title: "DRC-369 NFTs",
      description: "Creator-first NFT standard with built-in royalties and metadata",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Network,
      title: "P2P Network",
      description: "Decentralized content delivery and earn CGT by seeding",
      color: "from-green-500 to-emerald-600",
    },
  ];

  return (
    <>
      {/* Background */}
      <BackgroundVideo className="z-0" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-24 pb-16">
          {/* Server Status - Top Right */}
          <div className="fixed top-20 right-4 z-50">
            <ServerStatus />
          </div>

          {/* Countdown Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 bg-black/40 border-2 border-orange-500/30 rounded-2xl backdrop-blur-xl max-w-4xl mx-auto"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    ALPHA LAUNCH
                  </h3>
                  <p className="text-sm text-gray-300">
                    DEMIURGE QOR v1.0
                  </p>
                </div>
              </div>
              <LaunchCountdown targetDate={launchDate} compact={false} />
            </div>
          </motion.div>

          {/* Hero Content */}
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-sm font-bold text-white shadow-lg"
            >
              SOVEREIGN L1 BLOCKCHAIN
            </motion.div>

            {/* Main Title - Improved Readability */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold"
              style={{
                background: "linear-gradient(135deg, #FF6B35 0%, #00D9FF 50%, #9D4EDD 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 0 80px rgba(255,107,53,0.3)",
                lineHeight: 1.1,
              }}
            >
              DEMIURGE
            </motion.h1>

            {/* Subtitle - High Contrast */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-white font-semibold max-w-3xl mx-auto leading-relaxed"
              style={{
                textShadow: "0 2px 20px rgba(0,0,0,0.8)",
              }}
            >
              The Sovereign Digital Pantheon for Creators, Builders, and Sovereign Entities
            </motion.p>

            {/* Description - Better Contrast */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed px-6 py-4 bg-black/40 rounded-xl backdrop-blur-sm"
            >
              A Layer-1 blockchain built for autonomy, privacy, and true digital ownership. 
              Deploy nodes, mint NFTs, earn CGT, and build the decentralized future.
            </motion.p>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <button
                onClick={() => setShowDownload(true)}
                className="group relative px-10 py-5 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold text-white text-xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <Download className="h-7 w-7" />
                  <span>DOWNLOAD QOR LAUNCHER</span>
                </div>
              </button>

              <button
                onClick={() => setShowQorID(true)}
                className="px-10 py-5 bg-black/60 border-2 border-cyan-500 text-cyan-400 font-bold text-xl rounded-xl backdrop-blur-sm hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300 hover:scale-105"
              >
                CREATE QOR ID
              </button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-6 pt-8"
            >
              {["Windows • macOS • Linux", "Free Forever", "Open Source", "Alpha v1.0"].map((stat, i) => (
                <div
                  key={i}
                  className="px-6 py-3 bg-black/60 border border-gray-700 rounded-lg text-sm font-semibold text-gray-200 backdrop-blur-sm"
                >
                  {stat}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
              Built for Sovereignty
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-8 bg-black/60 border-2 border-gray-800 rounded-2xl backdrop-blur-sm hover:border-gray-600 hover:bg-black/80 transition-all duration-300"
                >
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Links Section - High Visibility */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            <Link
              href="/whitepaper"
              className="group p-8 bg-gradient-to-br from-purple-900/40 to-black/60 border-2 border-purple-500/30 rounded-2xl backdrop-blur-sm hover:border-purple-400 transition-all duration-300 hover:scale-105"
            >
              <FileText className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Whitepaper</h3>
              <p className="text-gray-300 text-lg">
                Complete technical documentation and vision
              </p>
            </Link>

            <Link
              href="/nft-marketplace"
              className="group p-8 bg-gradient-to-br from-pink-900/40 to-black/60 border-2 border-pink-500/30 rounded-2xl backdrop-blur-sm hover:border-pink-400 transition-all duration-300 hover:scale-105"
            >
              <Palette className="h-12 w-12 text-pink-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">NFT Marketplace</h3>
              <p className="text-gray-300 text-lg">
                Create, trade, and sell DRC-369 NFTs
              </p>
            </Link>

            <a
              href="https://github.com/ALaustrup/DEMIURGE"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-8 bg-gradient-to-br from-gray-900/40 to-black/60 border-2 border-gray-500/30 rounded-2xl backdrop-blur-sm hover:border-gray-400 transition-all duration-300 hover:scale-105"
            >
              <Github className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">GitHub</h3>
              <p className="text-gray-300 text-lg">
                Open source • MIT License • Contribute
              </p>
            </a>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center p-12 bg-gradient-to-br from-orange-900/40 via-purple-900/40 to-cyan-900/40 border-2 border-orange-500/30 rounded-3xl backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Build the Future?
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Join the sovereign digital revolution. Download the launcher, create your identity, and start earning CGT.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowDownload(true)}
                className="px-10 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300"
              >
                Download Now
              </button>
              <Link
                href="/whitepaper"
                className="px-10 py-4 bg-black/60 border-2 border-white/30 text-white font-bold text-lg rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                Read Whitepaper
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DownloadModal 
        open={showDownload} 
        onClose={() => setShowDownload(false)}
        launchDate={launchDate}
      />
      
      <QorIDDialog
        open={showQorID}
        onClose={() => setShowQorID(false)}
      />
    </>
  );
}
