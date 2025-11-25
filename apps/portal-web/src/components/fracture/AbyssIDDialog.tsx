"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2, XCircle, Loader2, Fingerprint, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AbyssIDDialogProps {
  open: boolean;
  onClose: () => void;
}

type AvailabilityStatus = "checking" | "available" | "taken" | null;

export function AbyssIDDialog({ open, onClose }: AbyssIDDialogProps) {
  const [abyssId, setAbyssId] = useState("");
  const [availability, setAvailability] = useState<AvailabilityStatus>(null);
  const [isEngaging, setIsEngaging] = useState(false);
  const [step, setStep] = useState<"input" | "generating" | "success" | "backup">("input");

  // TODO: Milestone 4.1 – connect to AbyssID state
  // This should integrate with actual AbyssID registration system

  useEffect(() => {
    if (!open) {
      setAbyssId("");
      setAvailability(null);
      setStep("input");
      setIsEngaging(false);
    }
  }, [open]);

  // Stub availability check
  useEffect(() => {
    if (!abyssId.trim()) {
      setAvailability(null);
      return;
    }

    // Basic validation
    const isValid = /^[a-z0-9_-]{3,20}$/i.test(abyssId);
    if (!isValid) {
      setAvailability("taken");
      return;
    }

    setAvailability("checking");

    // Simulate API call
    const timer = setTimeout(() => {
      // Stub: Randomly assign availability (replace with real check)
      const isAvailable = Math.random() > 0.3;
      setAvailability(isAvailable ? "available" : "taken");
    }, 500);

    return () => clearTimeout(timer);
  }, [abyssId]);

  const handleEngage = async () => {
    if (availability !== "available") return;

    setIsEngaging(true);
    setStep("generating");

    // TODO: Integrate with actual keypair generation and wallet binding
    // Simulate generation process
    setTimeout(() => {
      setStep("backup");
      setIsEngaging(false);
    }, 2000);
  };

  const handleComplete = () => {
    // TODO: Complete registration flow
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Step 1: Input */}
          {step === "input" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 border border-cyan-500/30 mb-4">
                  <Fingerprint className="h-8 w-8 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-2">
                  Claim Your AbyssID
                </h2>
                <p className="text-zinc-400 text-sm">
                  Your sovereign identity on the Demiurge chain
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Desired AbyssID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={abyssId}
                      onChange={(e) => setAbyssId(e.target.value)}
                      placeholder="your-abyss-id"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {availability === "checking" && (
                        <Loader2 className="h-5 w-5 text-cyan-400 animate-spin" />
                      )}
                      {availability === "available" && (
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      )}
                      {availability === "taken" && (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Availability Feedback */}
                <AnimatePresence>
                  {availability === "available" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 rounded-lg bg-green-500/10 border border-green-500/30"
                    >
                      <p className="text-sm text-green-400 font-medium">
                        ✓ Available
                      </p>
                    </motion.div>
                  )}
                  {availability === "taken" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 rounded-lg bg-red-500/10 border border-red-500/30"
                    >
                      <p className="text-sm text-red-400 font-medium">
                        ✗ Already claimed or invalid
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleEngage}
                  disabled={availability !== "available" || isEngaging}
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-fuchsia-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isEngaging ? "Engaging..." : "Engage"}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Generating */}
          {step === "generating" && (
            <div className="text-center space-y-6 py-8">
              <Loader2 className="h-16 w-16 text-cyan-400 animate-spin mx-auto" />
              <div>
                <h3 className="text-xl font-bold text-zinc-100 mb-2">
                  Generating Keypair
                </h3>
                <p className="text-zinc-400 text-sm">
                  Creating your sovereign identity...
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Backup Warning */}
          {step === "backup" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/20 border border-yellow-500/30 mb-4">
                  <AlertTriangle className="h-8 w-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-zinc-100 mb-2">
                  Backup Your Keys
                </h3>
                <p className="text-zinc-400 text-sm">
                  TODO: Milestone 4.1 – integrate keypair backup flow
                </p>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-sm text-yellow-400">
                  ⚠️ Store your private key securely. If lost, your AbyssID cannot be recovered.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleComplete}
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-fuchsia-400 transition-all duration-200"
                >
                  I've Backed Up My Keys
                </button>
                <button
                  onClick={onClose}
                  className="w-full px-6 py-3 bg-white/5 border border-white/10 text-zinc-300 font-semibold rounded-lg hover:bg-white/10 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

