"use client";

import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_BROWSER_PERFORMANCE_SIGNALS,
  YOTEI_PERFORMANCE_STORAGE_KEY,
  getAdaptiveMotionDebugSummary,
  normalizePerformanceMode,
  readBrowserPerformanceSignals,
  resolveAdaptivePerformanceProfile,
  type AdaptivePerformanceProfile,
  type BrowserPerformanceSignals,
  type PerformanceMode,
} from "@/app/lib/performance";

type PerformanceContextValue = {
  profile: AdaptivePerformanceProfile;
  mode: PerformanceMode;
  setMode: (mode: PerformanceMode) => void;
};

const defaultProfile = resolveAdaptivePerformanceProfile();

const PerformanceContext = createContext<PerformanceContextValue>({
  profile: defaultProfile,
  mode: "auto",
  setMode: (_mode) => {},
});

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<PerformanceMode>("auto");
  const [signals, setSignals] = useState<BrowserPerformanceSignals>(
    DEFAULT_BROWSER_PERFORMANCE_SIGNALS,
  );
  const [hasDetectedBrowserSignals, setHasDetectedBrowserSignals] = useState(false);
  const debugSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedMode = normalizePerformanceMode(
      window.localStorage.getItem(YOTEI_PERFORMANCE_STORAGE_KEY),
    );

    if (storedMode !== "auto") {
      setModeState(storedMode);
    }

    const updateSignals = () => {
      setSignals(readBrowserPerformanceSignals());
      setHasDetectedBrowserSignals(true);
    };

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    const finePointerQuery = window.matchMedia("(pointer: fine)");
    const slowUpdateQuery = window.matchMedia("(update: slow)");
    const connection = (
      navigator as Navigator & {
        connection?: EventTarget;
      }
    ).connection;

    updateSignals();

    reducedMotionQuery.addEventListener("change", updateSignals);
    coarsePointerQuery.addEventListener("change", updateSignals);
    finePointerQuery.addEventListener("change", updateSignals);
    slowUpdateQuery.addEventListener("change", updateSignals);
    connection?.addEventListener?.("change", updateSignals);

    return () => {
      reducedMotionQuery.removeEventListener("change", updateSignals);
      coarsePointerQuery.removeEventListener("change", updateSignals);
      finePointerQuery.removeEventListener("change", updateSignals);
      slowUpdateQuery.removeEventListener("change", updateSignals);
      connection?.removeEventListener?.("change", updateSignals);
    };
  }, []);

  const profile = useMemo(
    () =>
      resolveAdaptivePerformanceProfile({
        mode,
        signals,
      }),
    [mode, signals],
  );

  useEffect(() => {
    document.documentElement.dataset.yoteiPerformanceMode = mode;
    document.documentElement.dataset.yoteiPerformanceTier = profile.tier;
    document.documentElement.dataset.yoteiSafeMode = String(profile.safeMode);

    return () => {
      delete document.documentElement.dataset.yoteiPerformanceMode;
      delete document.documentElement.dataset.yoteiPerformanceTier;
      delete document.documentElement.dataset.yoteiSafeMode;
    };
  }, [mode, profile.safeMode, profile.tier]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" || !hasDetectedBrowserSignals) {
      return;
    }

    const motionDebug = getAdaptiveMotionDebugSummary(profile);
    const debugPayload = {
      mode,
      tier: profile.tier,
      safeMode: profile.safeMode,
      reducedMotion: profile.reducedMotion,
      saveData: profile.saveData,
      lowPowerDevice: profile.lowPowerDevice,
      finePointer: profile.finePointer,
      coarsePointer: profile.coarsePointer,
      allowDecorativeMotion: profile.allowDecorativeMotion,
      allowAmbientMotion: profile.allowAmbientMotion,
      allowBlurEffects: profile.allowBlurEffects,
      deviceMemory: signals.deviceMemory ?? "unknown",
      hardwareConcurrency: signals.hardwareConcurrency ?? "unknown",
      slowUpdate: signals.slowUpdate,
      blockedBy: motionDebug.blockedBy,
      motionPolicy: motionDebug.motionPolicy,
      tierPolicy: motionDebug.tierPolicy,
    };
    const nextSignature = JSON.stringify(debugPayload);

    if (debugSignatureRef.current === nextSignature) {
      return;
    }

    debugSignatureRef.current = nextSignature;
    const eventLabel = `Yotei performance detection (${motionDebug.motionPolicy})`;

    console.groupCollapsed(eventLabel);
    console.table(debugPayload);
    console.groupEnd();
  }, [
    hasDetectedBrowserSignals,
    mode,
    profile,
    signals.deviceMemory,
    signals.hardwareConcurrency,
    signals.slowUpdate,
  ]);

  const setMode = useCallback((nextMode: PerformanceMode) => {
    setModeState(nextMode);

    if (typeof window === "undefined") {
      return;
    }

    if (nextMode === "auto") {
      window.localStorage.removeItem(YOTEI_PERFORMANCE_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(YOTEI_PERFORMANCE_STORAGE_KEY, nextMode);
  }, []);

  const contextValue = useMemo(
    () => ({ profile, mode, setMode }),
    [mode, profile, setMode],
  );

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function useAdaptivePerformance() {
  return useContext(PerformanceContext);
}
