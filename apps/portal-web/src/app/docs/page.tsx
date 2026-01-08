"use client";

import { motion } from "framer-motion";
import {
  Book,
  Code,
  Terminal,
  Rocket,
  Shield,
  Zap,
  FileText,
  Github,
  ExternalLink,
  Download,
} from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  const sections = [
    {
      title: "Getting Started",
      icon: Rocket,
      color: "from-orange-500 to-red-600",
      docs: [
        { title: "Quick Start Guide", href: "#quickstart", description: "Get up and running in 5 minutes" },
        { title: "Installing QOR Launcher", href: "#install", description: "Download and install the launcher" },
        { title: "Creating Your QOR ID", href: "#qorid", description: "Set up your sovereign identity" },
        { title: "Funding Your Wallet", href: "#wallet", description: "Add CGT to your wallet" },
      ],
    },
    {
      title: "Development",
      icon: Code,
      color: "from-cyan-500 to-blue-600",
      docs: [
        { title: "Smart Contract Development", href: "#contracts", description: "Build WASM contracts in Rust" },
        { title: "RPC API Reference", href: "#rpc", description: "Complete RPC method documentation" },
        { title: "GraphQL API", href: "#graphql", description: "Query blockchain data" },
        { title: "SDK Documentation", href: "#sdk", description: "TypeScript and Rust SDKs" },
      ],
    },
    {
      title: "Mining & Staking",
      icon: Zap,
      color: "from-purple-500 to-pink-600",
      docs: [
        { title: "Mining Guide", href: "#mining", description: "Start mining CGT with CPU/GPU" },
        { title: "Validator Setup", href: "#validator", description: "Run a validator node" },
        { title: "Staking Rewards", href: "#staking", description: "Earn by staking CGT" },
        { title: "Node Requirements", href: "#requirements", description: "Hardware and software specs" },
      ],
    },
    {
      title: "NFTs & DRC-369",
      icon: FileText,
      color: "from-pink-500 to-purple-600",
      docs: [
        { title: "DRC-369 Standard", href: "#drc369", description: "NFT standard specification" },
        { title: "Minting NFTs", href: "#minting", description: "Create and mint your NFTs" },
        { title: "Royalties", href: "#royalties", description: "Set up creator royalties" },
        { title: "Marketplace API", href: "#marketplace-api", description: "Build NFT marketplaces" },
      ],
    },
    {
      title: "Security",
      icon: Shield,
      color: "from-green-500 to-emerald-600",
      docs: [
        { title: "Key Management", href: "#keys", description: "Securely store your private keys" },
        { title: "Security Best Practices", href: "#security", description: "Protect your assets" },
        { title: "Bug Bounty Program", href: "#bounty", description: "Report vulnerabilities" },
        { title: "Audit Reports", href: "#audits", description: "Third-party security audits" },
      ],
    },
    {
      title: "Advanced Topics",
      icon: Terminal,
      color: "from-gray-500 to-gray-700",
      docs: [
        { title: "Chain Specifications", href: "#chainspec", description: "Technical architecture details" },
        { title: "Consensus Mechanism", href: "#consensus", description: "GRANDPA + BABE explained" },
        { title: "P2P Networking", href: "#p2p", description: "libp2p integration" },
        { title: "Cross-chain Bridges", href: "#bridges", description: "Connect to other chains" },
      ],
    },
  ];

  const resources = [
    {
      title: "GitHub Repository",
      description: "Full source code, examples, and contributions",
      icon: Github,
      href: "https://github.com/ALaustrup/DEMIURGE",
      external: true,
    },
    {
      title: "Whitepaper",
      description: "Complete technical specification and vision",
      icon: Book,
      href: "/whitepaper",
      external: false,
    },
    {
      title: "Download Launcher",
      description: "Get the QOR Launcher for your platform",
      icon: Download,
      href: "/",
      external: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-bold mb-8">
            <Book className="h-5 w-5" />
            DOCUMENTATION
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Developer Resources
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Everything you need to build, deploy, and scale on the DEMIURGE blockchain.
          </p>
        </motion.div>

        {/* Quick Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mb-20"
        >
          {resources.map((resource, index) => (
            <Link
              key={index}
              href={resource.href}
              target={resource.external ? "_blank" : undefined}
              rel={resource.external ? "noopener noreferrer" : undefined}
              className="group p-8 bg-black/60 border-2 border-gray-800 rounded-2xl backdrop-blur-sm hover:border-cyan-500/50 hover:bg-black/80 transition-all duration-300 hover:scale-105"
            >
              <resource.icon className="h-12 w-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                {resource.title}
                {resource.external && <ExternalLink className="h-4 w-4" />}
              </h3>
              <p className="text-gray-300">{resource.description}</p>
            </Link>
          ))}
        </motion.div>

        {/* Documentation Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto space-y-12"
        >
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${section.color}`}>
                  <section.icon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">{section.title}</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {section.docs.map((doc, docIndex) => (
                  <Link
                    key={docIndex}
                    href={doc.href}
                    className="group p-6 bg-black/60 border-2 border-gray-800 rounded-xl backdrop-blur-sm hover:border-gray-600 hover:bg-black/80 transition-all duration-300"
                  >
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {doc.title} →
                    </h3>
                    <p className="text-gray-400 text-sm">{doc.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* API Reference Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mt-20"
        >
          <div className="p-12 bg-gradient-to-br from-cyan-900/40 via-purple-900/40 to-pink-900/40 border-2 border-cyan-500/30 rounded-3xl backdrop-blur-sm text-center">
            <Terminal className="h-16 w-16 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">
              API Endpoints
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect to DEMIURGE blockchain infrastructure
            </p>

            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
              <div className="p-6 bg-black/60 border border-gray-700 rounded-xl">
                <code className="text-sm text-cyan-400 font-mono block mb-2">
                  https://rpc.demiurge.cloud/rpc
                </code>
                <p className="text-gray-400 text-sm">RPC Node Endpoint</p>
              </div>

              <div className="p-6 bg-black/60 border border-gray-700 rounded-xl">
                <code className="text-sm text-purple-400 font-mono block mb-2">
                  https://api.demiurge.cloud/graphql
                </code>
                <p className="text-gray-400 text-sm">GraphQL API</p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/#"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all hover:scale-105"
              >
                <Code className="h-6 w-6" />
                View Full API Docs
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mt-20 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            Need Help?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Can't find what you're looking for? We're here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/ALaustrup/DEMIURGE/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-black/60 border-2 border-gray-700 text-white font-semibold rounded-lg hover:border-gray-500 transition-all"
            >
              Report an Issue
            </a>
            <Link
              href="/"
              className="px-8 py-3 bg-black/60 border-2 border-gray-700 text-white font-semibold rounded-lg hover:border-gray-500 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
