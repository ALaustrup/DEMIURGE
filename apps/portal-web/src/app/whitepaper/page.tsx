"use client";

import { motion } from "framer-motion";
import { FileText, Download, Github, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function WhitepaperPage() {
  const sections = [
    {
      title: "1. Executive Summary",
      content: `DEMIURGE is a sovereign Layer-1 blockchain designed for true digital autonomy. Built on Substrate, DEMIURGE provides creators, developers, and sovereign entities with the infrastructure to build, deploy, and monetize decentralized applications without gatekeepers or middlemen.`,
    },
    {
      title: "2. Vision & Mission",
      content: `Our mission is to create a digital pantheon where individuals maintain complete sovereignty over their identity, data, and creations. DEMIURGE enables a creator economy built on transparency, fairness, and immutable ownership.`,
    },
    {
      title: "3. Core Technology",
      subsections: [
        {
          subtitle: "3.1 Blockchain Architecture",
          content: `Built on Substrate framework, DEMIURGE leverages GRANDPA consensus for finality and BABE for block production. The chain supports up to 1000 TPS with sub-second block times.`,
        },
        {
          subtitle: "3.2 QOR ID Identity System",
          content: `QOR ID is a decentralized identity protocol that provides users with sovereign control over their digital identity. Each QOR ID is cryptographically secured and tied to an on-chain address, enabling seamless authentication across the ecosystem without centralized identity providers.`,
        },
        {
          subtitle: "3.3 Smart Contracts",
          content: `DEMIURGE supports WASM-based smart contracts through Substrate's contracts pallet, enabling developers to write contracts in Rust, AssemblyScript, or any language that compiles to WebAssembly.`,
        },
      ],
    },
    {
      title: "4. Tokenomics",
      subsections: [
        {
          subtitle: "4.1 CGT Token",
          content: `Cognitive Governance Token (CGT) is the native token of the DEMIURGE blockchain. Total supply: 1,000,000,000 CGT. Distribution: 40% Mining Rewards, 30% Ecosystem Fund, 20% Team & Development (4-year vesting), 10% Initial Liquidity.`,
        },
        {
          subtitle: "4.2 Mining & Staking",
          content: `Miners earn CGT by validating transactions and producing blocks. Stakers earn rewards by locking CGT and participating in governance. Base mining reward: 100 CGT per block, halving every 2 years.`,
        },
        {
          subtitle: "4.3 Transaction Fees",
          content: `Transaction fees are dynamically calculated based on network congestion and computational complexity. 70% of fees are burned, 30% go to block producers.`,
        },
      ],
    },
    {
      title: "5. DRC-369 NFT Standard",
      content: `DRC-369 is DEMIURGE's native NFT standard designed for creators. Features include:
      
• **Built-in Royalties**: Creators earn on every secondary sale
• **Rich Metadata**: On-chain and IPFS storage options
• **Fractional Ownership**: Split NFT ownership among multiple parties
• **Dynamic NFTs**: Metadata can evolve based on on-chain events
• **Cross-chain Bridge**: Compatible with Ethereum, Polygon, and other EVM chains`,
    },
    {
      title: "6. QLOUD OS",
      content: `QLOUD OS is a web-based operating system that runs entirely in the browser, providing users with a familiar desktop environment for interacting with the blockchain. Features include native apps for wallet management, NFT creation, file storage, and more.`,
    },
    {
      title: "7. QOR Desktop & Launcher",
      content: `The QOR Launcher is a native desktop application that provides:

• **Full Node Deployment**: Run a complete DEMIURGE validator or light node
• **Native Mining**: CPU/GPU mining with optimized performance
• **Integrated Wallet**: Secure storage for CGT and DRC-369 assets
• **P2P Content Delivery**: Earn CGT by seeding content on the network
• **QOR OS Environment**: Full desktop experience with native performance`,
    },
    {
      title: "8. Governance",
      content: `DEMIURGE features on-chain governance allowing CGT holders to propose and vote on network upgrades, parameter changes, and treasury spending. Voting power is proportional to staked CGT, with a quadratic voting mechanism to prevent plutocracy.`,
    },
    {
      title: "9. Roadmap",
      subsections: [
        {
          subtitle: "Phase 1 - Alpha (Q1 2026)",
          content: `Launch QOR Launcher, enable mining, deploy QLOUD OS, QOR ID authentication, basic DRC-369 NFT support`,
        },
        {
          subtitle: "Phase 2 - Beta (Q2 2026)",
          content: `Smart contract deployment, governance activation, cross-chain bridge, mobile apps, advanced NFT marketplace`,
        },
        {
          subtitle: "Phase 3 - Mainnet (Q3 2026)",
          content: `Full validator network, DeFi integrations, enterprise partnerships, developer grants program`,
        },
        {
          subtitle: "Phase 4 - Expansion (Q4 2026+)",
          content: `Layer-2 scaling solutions, ZK-rollups, DAO tooling, metaverse integration, IoT device support`,
        },
      ],
    },
    {
      title: "10. Security",
      content: `DEMIURGE employs multiple layers of security:

• **Cryptographic Standards**: Ed25519 signatures, SHA3-256 hashing
• **Economic Security**: Slashing for malicious validators
• **Formal Verification**: Critical pallets undergo formal verification
• **Bug Bounty Program**: Up to $100,000 for critical vulnerabilities
• **Regular Audits**: Quarterly third-party security audits`,
    },
    {
      title: "11. Team & Development",
      content: `DEMIURGE is built by a global team of blockchain engineers, cryptographers, and designers committed to digital sovereignty. Development is open source under the MIT license, with all code publicly available on GitHub.`,
    },
    {
      title: "12. Conclusion",
      content: `DEMIURGE represents the future of sovereign digital infrastructure. By combining a high-performance blockchain with intuitive user experiences, we're building the foundation for the next generation of decentralized applications and digital economies.`,
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
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-white font-bold mb-8">
            <FileText className="h-5 w-5" />
            TECHNICAL WHITEPAPER
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-cyan-500 to-purple-500 bg-clip-text text-transparent">
            DEMIURGE
          </h1>

          <p className="text-2xl text-gray-300 font-semibold mb-4">
            A Sovereign Layer-1 Blockchain for the Digital Pantheon
          </p>

          <p className="text-gray-400 mb-8">
            Version 1.0 • January 2026 • MIT License
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all">
              <Download className="h-5 w-5" />
              Download PDF
            </button>
            <a
              href="https://github.com/ALaustrup/DEMIURGE"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-black/60 border-2 border-gray-700 text-white font-semibold rounded-lg hover:border-gray-500 transition-all"
            >
              <Github className="h-5 w-5" />
              View on GitHub
            </a>
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-black/60 border-2 border-gray-700 text-white font-semibold rounded-lg hover:border-gray-500 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-black/60 border-2 border-gray-800 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
            <div className="prose prose-invert prose-lg max-w-none">
              {sections.map((section, index) => (
                <div key={index} className="mb-12 last:mb-0">
                  <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-gray-800 pb-4">
                    {section.title}
                  </h2>
                  
                  {section.content && (
                    <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line mb-6">
                      {section.content}
                    </p>
                  )}
                  
                  {section.subsections && (
                    <div className="space-y-6 ml-4">
                      {section.subsections.map((subsection, subIndex) => (
                        <div key={subIndex}>
                          <h3 className="text-2xl font-semibold text-cyan-400 mb-3">
                            {subsection.subtitle}
                          </h3>
                          <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line">
                            {subsection.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t-2 border-gray-800">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-gray-400 mb-2">
                    © 2026 DEMIURGE Project. All rights reserved.
                  </p>
                  <p className="text-gray-500 text-sm">
                    This whitepaper is for informational purposes only and does not constitute financial advice.
                  </p>
                </div>
                <div className="flex gap-4">
                  <a
                    href="https://github.com/ALaustrup/DEMIURGE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Github className="h-6 w-6" />
                  </a>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <ExternalLink className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
