"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet, Coins, Sparkles, Award, ArrowLeft } from "lucide-react";
import QRCode from "react-qr-code";
import { callRpc } from "@/lib/rpc";
import { toAeonId } from "@/lib/aeonId";
import { exportVault, importVault } from "@/lib/vault";
import { DEMIURGE_RPC_URL } from "@/config/demiurge";

type AeonProfile = {
  address: string;
  display_name: string;
  bio?: string;
  handle?: string | null;
  gnosis_xp: number;
  syzygy_score: number;
  ascension_level: number;
  badges: string[];
  created_at_height: number;
};

type AscensionStats = {
  gnosis_xp: number;
  syzygy_score: number;
  ascension_level: number;
  badges: string[];
};

type Nft = {
  id: number;
  owner: string;
  creator: string;
  fabric_root_hash: string;
  royalty_bps?: number;
};

export default function AeonPage() {
  const router = useRouter();
  const [step, setStep] = useState<"onboarding" | "dashboard">("onboarding");
  const [address, setAddress] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [profile, setProfile] = useState<AeonProfile | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [ascension, setAscension] = useState<AscensionStats | null>(null);
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [handleInput, setHandleInput] = useState("");
  const [handleStatus, setHandleStatus] = useState<string | null>(null);
  const [vaultStatus, setVaultStatus] = useState<string | null>(null);

  // Check if user already has a wallet
  useEffect(() => {
    const storedAddress = localStorage.getItem("demiurge_aeon_wallet_address");
    const storedKey = localStorage.getItem("demiurge_aeon_wallet_key");
    if (storedAddress && storedKey) {
      setAddress(storedAddress);
      setPrivateKey(storedKey);
      setStep("dashboard");
      loadDashboard(storedAddress);
    }
  }, []);

  const generateKeypair = () => {
    // Generate random 32-byte address (stub - later use Ed25519)
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    const addrHex = Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const keyHex = Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    setAddress(addrHex);
    setPrivateKey(keyHex);
  };

  const createAeon = async () => {
    if (!address || !displayName.trim()) {
      setError("Address and display name are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const profile = await callRpc<AeonProfile>("aeon_create", {
        address,
        display_name: displayName,
        bio: bio.trim() || null,
      });

      // Store wallet locally
      localStorage.setItem("demiurge_aeon_wallet_address", address);
      localStorage.setItem("demiurge_aeon_wallet_key", privateKey);

      setProfile(profile);
      setStep("dashboard");
      await loadDashboard(address);
    } catch (err: any) {
      setError(err.message || "Failed to create Aeon profile");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async (addr: string) => {
    try {
      // Load profile
      const profile = await callRpc<AeonProfile | null>("aeon_get", {
        address: addr,
      });
      if (profile) {
        setProfile(profile);
        setHandleInput(profile.handle || "");
      }

      // Load balance
      const balanceRes = await callRpc<{ balance: number }>("cgt_getBalance", {
        address: addr,
      });
      setBalance(balanceRes.balance);

      // Load ascension
      const ascensionRes = await callRpc<AscensionStats | null>(
        "aeon_getAscension",
        { address: addr }
      );
      if (ascensionRes) {
        setAscension(ascensionRes);
      }

      // Load NFTs
      const nftsRes = await callRpc<{ nfts: Nft[] }>("cgt_getNftsByOwner", {
        address: addr,
      });
      setNfts(nftsRes.nfts || []);
    } catch (err: any) {
      console.error("Failed to load dashboard:", err);
    }
  };

  if (step === "onboarding") {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <motion.div
          className="space-y-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-semibold text-slate-50">
            Become an Aeon
          </h1>
          <p className="text-sm text-slate-300">
            Create your on-chain identity in the Demiurge Pantheon. Every user
            is an Aeon with progression stats, badges, and the ability to mint
            D-GEN NFTs.
          </p>

          {!address && (
            <div className="space-y-4">
              <button
                onClick={generateKeypair}
                className="rounded-full bg-sky-500 px-6 py-3 text-sm font-medium text-slate-950 shadow-lg shadow-sky-500/30 hover:bg-sky-400"
              >
                Generate Aeon Vault
              </button>
            </div>
          )}

          {address && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <div className="mb-2 text-xs font-medium text-slate-400">
                  Aeon Vault Address
                </div>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-xs break-all text-sky-300 max-w-full">
                    {address}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(address);
                    }}
                    className="rounded-md border border-slate-600 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-800 whitespace-nowrap flex-shrink-0"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-rose-800 bg-rose-950/30 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-rose-400">
                  <Wallet className="h-4 w-4" />
                  Private Key
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <code className="font-mono text-xs break-all text-rose-300 max-w-full">
                    {privateKey}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(privateKey);
                    }}
                    className="rounded-md border border-rose-700 px-2 py-1 text-[11px] text-rose-300 hover:bg-rose-900/50 whitespace-nowrap flex-shrink-0"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-rose-400">
                  ⚠️ Save this key. Losing it means losing access forever.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your Aeon name"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Bio (Optional)
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about your Aeon..."
                    rows={3}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={createAeon}
                  disabled={loading || !displayName.trim()}
                  className="w-full rounded-full bg-violet-500 px-6 py-3 text-sm font-medium text-slate-50 shadow-lg shadow-violet-500/30 hover:bg-violet-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create Aeon Profile"}
                </button>

                {error && (
                  <p className="text-xs text-rose-400">{error}</p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </main>
    );
  }

  // Dashboard view
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-12">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("demiurge_aeon_wallet_address");
            localStorage.removeItem("demiurge_aeon_wallet_key");
            router.push("/aeon");
          }}
          className="text-xs text-slate-500 hover:text-slate-300"
        >
          Sign Out
        </button>
      </div>

      {profile && (
        <motion.div
          className="space-y-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-50">
                {profile.display_name}
              </h1>
              <h2 className="mt-1 text-lg font-semibold text-slate-50">
                Aeon:{" "}
                <span className="font-mono text-sm text-slate-300">
                  {profile.address.slice(0, 6)}...{profile.address.slice(-4)}
                </span>
              </h2>
            </div>
            {ascension && ascension.badges.length > 0 && (
              <div className="flex gap-2">
                {ascension.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-400"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>

          {profile.bio && (
            <p className="text-sm text-slate-300">{profile.bio}</p>
          )}

          {/* Aeon Vault Section */}
          <section className="mt-4 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            <h3 className="text-xs font-semibold text-slate-400">
              Aeon Vault
            </h3>

            <div className="mt-2 space-y-2">
              <div>
                <div className="text-[11px] text-slate-500 mb-1">
                  Hex Address
                </div>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-[11px] break-all text-slate-200">
                    {profile.address}
                  </code>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(profile.address)}
                    className="rounded-md border border-slate-600 px-2 py-[2px] text-[10px] text-slate-200 hover:bg-slate-800"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500 mb-1">
                  Aeon ID (bech32)
                </div>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-[11px] break-all text-slate-200">
                    {toAeonId(profile.address)}
                  </code>
                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText(toAeonId(profile.address))
                    }
                    className="rounded-md border border-slate-600 px-2 py-[2px] text-[10px] text-slate-200 hover:bg-slate-800"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 mt-2">
                <div className="text-[11px] text-slate-500 mb-2">
                  Scan Aeon Vault
                </div>
                <div className="inline-block rounded-md bg-slate-900 p-2">
                  <QRCode value={profile.address} size={96} />
                </div>
              </div>
            </div>
          </section>

          {/* Handle Section */}
          <section className="mt-4 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            <h3 className="text-xs font-semibold text-slate-400">
              Aeon Handle
            </h3>

            <div className="mt-2 text-[11px] text-slate-400">
              Choose a unique handle other Aeons can use to find you.
            </div>

            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-slate-500">@</span>
              <input
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value.toLowerCase())}
                className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 outline-none focus:border-sky-500"
                placeholder="yourname"
              />
              <button
                type="button"
                onClick={async () => {
                  setHandleStatus(null);
                  try {
                    const updated = await callRpc<AeonProfile>("aeon_setHandle", {
                      address: profile.address,
                      handle: handleInput.replace(/^@/, ""),
                    });
                    setProfile(updated);
                    setHandleStatus("Handle saved.");
                  } catch (err: any) {
                    setHandleStatus(err?.message ?? "Failed to save handle.");
                  }
                }}
                className="rounded-md border border-slate-600 px-3 py-1 text-[12px] text-slate-50 hover:bg-slate-800"
              >
                Save
              </button>
            </div>

            {profile.handle && (
              <div className="mt-2 text-[12px] text-slate-300">
                Current: <span className="font-mono text-sky-400">@{profile.handle}</span>
              </div>
            )}

            {handleStatus && (
              <div className="mt-1 text-[11px] text-slate-400">
                {handleStatus}
              </div>
            )}
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Balance */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                <Coins className="h-4 w-4 text-emerald-400" />
                CGT Balance
              </div>
              <p className="text-2xl font-mono font-semibold text-emerald-400">
                {balance !== null
                  ? balance.toLocaleString()
                  : "—"}{" "}
                CGT
              </p>
            </div>

            {/* Ascension Level */}
            {ascension && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                  <Award className="h-4 w-4 text-violet-400" />
                  Ascension Level
                </div>
                <p className="text-2xl font-semibold text-violet-400">
                  {ascension.ascension_level}
                </p>
              </div>
            )}
          </div>

          {/* Progression Stats */}
          {ascension && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <div className="mb-1 text-xs font-medium text-slate-400">
                  Gnosis XP
                </div>
                <p className="text-lg font-mono font-semibold text-sky-300">
                  {ascension.gnosis_xp.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <div className="mb-1 text-xs font-medium text-slate-400">
                  Syzygy Score
                </div>
                <p className="text-lg font-mono font-semibold text-violet-300">
                  {ascension.syzygy_score.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* NFTs */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Sparkles className="h-4 w-4 text-violet-400" />
                D-GEN NFTs
              </div>
              <span className="text-xs text-slate-500">
                {nfts.length} owned
              </span>
            </div>
            {nfts.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {nfts.map((nft) => (
                  <div
                    key={nft.id}
                    className="rounded-lg border border-slate-700 bg-slate-800/30 p-3 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sky-300">#{nft.id}</span>
                      <span className="text-slate-500 text-[10px]">
                        {nft.fabric_root_hash.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No NFTs yet</p>
            )}
          </div>

          {/* Vault Export/Import Section */}
          <section className="mt-4 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            <h3 className="text-xs font-semibold text-slate-400">
              Aeon Vault (Export / Import)
            </h3>

            <div className="mt-2 text-[11px] text-slate-400">
              Export an encrypted backup of your Aeon Vault, or import an existing one.
            </div>

            <div className="mt-3 flex flex-col gap-3">
              {/* EXPORT */}
              <div>
                <button
                  type="button"
                  onClick={async () => {
                    const password = prompt("Enter a password to encrypt your vault:");
                    if (!password) return;

                    try {
                      // Retrieve wallet from localStorage
                      const storedAddress = localStorage.getItem("demiurge_aeon_wallet_address");
                      const storedKey = localStorage.getItem("demiurge_aeon_wallet_key");
                      if (!storedAddress || !storedKey) {
                        throw new Error("No local wallet found.");
                      }

                      const wallet = { address: storedAddress, privateKey: storedKey };
                      const vault = await exportVault(wallet, password);

                      const blob = new Blob([JSON.stringify(vault, null, 2)], {
                        type: "application/json",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `aeon-vault-${wallet.address.slice(0, 8)}.json`;
                      a.click();
                      URL.revokeObjectURL(url);

                      setVaultStatus("Vault exported successfully.");
                    } catch (err: any) {
                      setVaultStatus(err?.message ?? "Failed to export vault.");
                    }
                  }}
                  className="rounded-md border border-slate-600 px-3 py-1 text-[12px] text-slate-50 hover:bg-slate-800"
                >
                  Export Vault
                </button>
              </div>

              {/* IMPORT */}
              <div>
                <input
                  type="file"
                  accept="application/json"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const password = prompt("Enter the password used to encrypt this vault:");
                    if (!password) return;

                    try {
                      const text = await file.text();
                      const vault = JSON.parse(text);
                      const restored = await importVault(vault, password);

                      const newWallet = {
                        address: restored.address,
                        privateKey: restored.privateKey,
                      };

                      localStorage.setItem("demiurge_aeon_wallet_address", restored.address);
                      localStorage.setItem("demiurge_aeon_wallet_key", restored.privateKey);

                      setVaultStatus("Vault imported and set as active Aeon.");
                      // Reload dashboard with new address
                      setAddress(restored.address);
                      await loadDashboard(restored.address);
                    } catch (err: any) {
                      setVaultStatus(err?.message ?? "Failed to import vault.");
                    } finally {
                      e.target.value = "";
                    }
                  }}
                  className="mt-1 text-[11px] text-slate-300 file:mr-3 file:rounded-md file:border file:border-slate-600 file:bg-slate-900 file:px-3 file:py-1 file:text-[11px] file:text-slate-100 hover:file:bg-slate-800"
                />
              </div>
            </div>

            {vaultStatus && (
              <div className="mt-2 text-[11px] text-slate-400">{vaultStatus}</div>
            )}
          </section>
        </motion.div>
      )}
    </main>
  );
}

