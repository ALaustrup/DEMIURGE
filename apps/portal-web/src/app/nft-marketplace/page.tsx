"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Palette,
  Plus,
  TrendingUp,
  Sparkles,
  Upload,
  DollarSign,
  Users,
  Image as ImageIcon,
  Music,
  Video,
  FileText,
  Grid,
  List,
} from "lucide-react";
import Link from "next/link";

export default function NFTMarketplacePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All NFTs", icon: Grid },
    { id: "art", name: "Art", icon: Palette },
    { id: "music", name: "Music", icon: Music },
    { id: "video", name: "Video", icon: Video },
    { id: "documents", name: "Documents", icon: FileText },
  ];

  const stats = [
    { label: "Total Volume", value: "12,456 CGT", icon: DollarSign },
    { label: "Total Sales", value: "3,421", icon: TrendingUp },
    { label: "Active Creators", value: "892", icon: Users },
    { label: "Listed NFTs", value: "5,234", icon: Sparkles },
  ];

  const featuredNFTs = [
    {
      id: 1,
      title: "Genesis Creation #001",
      creator: "archon.qor",
      price: "150 CGT",
      image: "/placeholder-nft.jpg",
      category: "art",
      trending: true,
    },
    {
      id: 2,
      title: "Sovereign Symphony",
      creator: "nomad.qor",
      price: "75 CGT",
      image: "/placeholder-nft.jpg",
      category: "music",
      trending: false,
    },
    {
      id: 3,
      title: "Digital Pantheon",
      creator: "creator.qor",
      price: "200 CGT",
      image: "/placeholder-nft.jpg",
      category: "art",
      trending: true,
    },
    {
      id: 4,
      title: "Decentralized Dreams",
      creator: "artist.qor",
      price: "95 CGT",
      image: "/placeholder-nft.jpg",
      category: "video",
      trending: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white font-bold mb-8">
            <Palette className="h-5 w-5" />
            DRC-369 NFT MARKETPLACE
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            Create, Trade & Collect
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            The premier NFT marketplace on DEMIURGE blockchain. Mint, buy, and sell DRC-369 NFTs with built-in royalties and zero platform fees.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-pink-500/50 transition-all hover:scale-105">
              <Plus className="h-6 w-6" />
              Create NFT
            </button>
            <button className="flex items-center gap-2 px-8 py-4 bg-black/60 border-2 border-purple-500 text-purple-400 font-bold text-lg rounded-xl hover:bg-purple-500/10 transition-all hover:scale-105">
              <Upload className="h-6 w-6" />
              Upload Collection
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-6 bg-black/60 border-2 border-gray-800 rounded-xl backdrop-blur-sm text-center"
            >
              <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-600/20 mb-3">
                <stat.icon className="h-6 w-6 text-pink-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Why DRC-369?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 bg-gradient-to-br from-pink-900/20 to-black/60 border-2 border-pink-500/30 rounded-2xl backdrop-blur-sm">
              <DollarSign className="h-12 w-12 text-pink-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Built-in Royalties</h3>
              <p className="text-gray-300 leading-relaxed">
                Creators earn on every secondary sale. Set your royalty percentage (0-10%) and earn perpetually.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-purple-900/20 to-black/60 border-2 border-purple-500/30 rounded-2xl backdrop-blur-sm">
              <Sparkles className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Rich Metadata</h3>
              <p className="text-gray-300 leading-relaxed">
                Store metadata on-chain or IPFS. Support for images, audio, video, 3D models, and more.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-cyan-900/20 to-black/60 border-2 border-cyan-500/30 rounded-2xl backdrop-blur-sm">
              <TrendingUp className="h-12 w-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Zero Platform Fees</h3>
              <p className="text-gray-300 leading-relaxed">
                Only pay blockchain transaction fees. No hidden costs, no middlemen taking a cut.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-black/60 border-2 border-gray-800 rounded-xl backdrop-blur-sm">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <category.icon className="h-4 w-4" />
                  {category.name}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-pink-500 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-pink-500 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* NFT Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-4 gap-6" : "space-y-4"}>
            {featuredNFTs.map((nft, index) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="bg-black/60 border-2 border-gray-800 rounded-xl overflow-hidden hover:border-pink-500/50 transition-all hover:scale-105">
                  {/* Image Placeholder */}
                  <div className="relative aspect-square bg-gradient-to-br from-pink-900/40 to-purple-900/40 flex items-center justify-center">
                    <ImageIcon className="h-20 w-20 text-gray-600" />
                    {nft.trending && (
                      <div className="absolute top-3 right-3 px-3 py-1 bg-orange-500 rounded-full text-xs font-bold text-white flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Trending
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2 truncate">
                      {nft.title}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-400">{nft.creator}</span>
                      <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                        {nft.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-pink-400">{nft.price}</span>
                      <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-pink-500/50 transition-all">
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            How to Get Started
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-black/60 border-2 border-gray-800 rounded-2xl backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Create QOR ID</h3>
              <p className="text-gray-300 leading-relaxed">
                Sign up for a free QOR ID to access the marketplace and manage your NFTs securely.
              </p>
            </div>

            <div className="text-center p-8 bg-black/60 border-2 border-gray-800 rounded-2xl backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Upload & Mint</h3>
              <p className="text-gray-300 leading-relaxed">
                Upload your creation, set metadata and royalties, then mint your DRC-369 NFT on-chain.
              </p>
            </div>

            <div className="text-center p-8 bg-black/60 border-2 border-gray-800 rounded-2xl backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-4">List & Earn</h3>
              <p className="text-gray-300 leading-relaxed">
                List your NFT for sale or auction. Earn CGT on every sale, with automatic royalty payments.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/qorid"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-pink-500/50 transition-all hover:scale-105"
            >
              Get Started Now
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
