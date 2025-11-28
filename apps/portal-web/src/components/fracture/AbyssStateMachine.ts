"use client";

import { useState, useCallback } from "react";
import { generateKeys, type GeneratedAbyssIdentity } from "@/lib/fracture/crypto/generateKeys";

export type AbyssState = "idle" | "checking" | "reject" | "accept" | "binding" | "confirm";

export interface AbyssContext {
  username: string;
  seedPhrase?: string;
  error?: string;
}

/**
 * useAbyssStateMachine
 * 
 * React hook for managing the AbyssID ritual state machine.
 * Controls the flow: idle → checking → reject|accept → binding → confirm
 */
export function useAbyssStateMachine() {
  const [state, setState] = useState<AbyssState>("idle");
  const [context, setContext] = useState<AbyssContext>({
    username: "",
  });

  const setUsername = useCallback((value: string) => {
    setContext((prev) => ({
      ...prev,
      username: value,
      error: undefined,
    }));
    // Reset to idle if previously reject/accept
    if (state === "reject" || state === "accept") {
      setState("idle");
    }
  }, [state]);

  const startChecking = useCallback(async () => {
    if (!context.username.trim()) {
      return;
    }

    setState("checking");

    // Simulate availability check
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // TODO: Replace with real backend availability API
    // TEMPORARY implementation:
    const username = context.username.trim();
    
    if (username.length < 3) {
      setState("reject");
      setContext((prev) => ({
        ...prev,
        error: "Username too short",
      }));
      return;
    }

    // Deterministic coin flip for testing
    if (username.toLowerCase().includes("test")) {
      setState("reject");
      setContext((prev) => ({
        ...prev,
        error: "Username contains 'test'",
      }));
      return;
    }

    // Accept
    setState("accept");
  }, [context.username]);

  const triggerReject = useCallback((reason?: string) => {
    setState("reject");
    if (reason) {
      setContext((prev) => ({
        ...prev,
        error: reason,
      }));
    }
  }, []);

  const triggerAccept = useCallback(() => {
    setState("accept");
  }, []);

  const startBinding = useCallback(async () => {
    setState("binding");

    try {
      const generated = await generateKeys(context.username);
      setContext((prev) => ({
        ...prev,
        seedPhrase: generated.seedPhrase,
      }));
    } catch (error) {
      console.error("Failed to generate keys:", error);
      setState("reject");
      setContext((prev) => ({
        ...prev,
        error: "Failed to generate keys",
      }));
    }
  }, [context.username]);

  const confirmAndProceed = useCallback(() => {
    setState("confirm");
    // Actual routing to /haven will be handled in the dialog component
  }, []);

  return {
    state,
    context,
    setUsername,
    startChecking,
    triggerReject,
    triggerAccept,
    startBinding,
    confirmAndProceed,
  };
}
