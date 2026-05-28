"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type CSSProperties,
  type FormEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  LuArrowRight,
  LuBadgeCheck,
  LuChartNoAxesCombined,
  LuGithub,
  LuLayoutPanelTop,
  LuLayoutTemplate,
  LuMessageSquare,
  LuMusic4,
  LuRadio,
  LuShieldCheck,
  LuSparkles,
  LuTrophy,
  LuX,
} from "react-icons/lu";
import { useI18n } from "@/app/components/I18nProvider";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { useAdaptivePerformance } from "@/app/components/PerformanceProvider";
import { useBodyScrollLock } from "@/app/components/useBodyScrollLock";
import YoteiBrandMark from "@/app/components/YoteiBrandMark";
import {
  getAdaptiveMotionDebugSummary,
  shouldDisableAdaptiveMotion,
} from "@/app/lib/performance";

const heroChipKeys = [
  { key: "links", tone: "violet" },
  { key: "badges", tone: "pink" },
  { key: "music", tone: "blue" },
] as const;

const heroTrustItems = [
  { key: "free", icon: <LuBadgeCheck size={14} /> },
  { key: "noCard", icon: <LuShieldCheck size={14} /> },
] as const;

const identityCards = [
  { key: "identityCore", icon: <LuLayoutPanelTop size={18} />, accent: "violet" },
  { key: "creatorAura", icon: <LuSparkles size={18} />, accent: "pink" },
  { key: "profileSystems", icon: <LuShieldCheck size={18} />, accent: "blue" },
] as const;

const gamerCards = [
  { key: "discord", icon: <LuRadio size={18} />, accent: "violet" },
  { key: "spotify", icon: <LuMusic4 size={18} />, accent: "pink" },
  { key: "github", icon: <LuGithub size={18} />, accent: "blue" },
  { key: "badges", icon: <LuBadgeCheck size={18} />, accent: "pink" },
  { key: "comments", icon: <LuMessageSquare size={18} />, accent: "violet" },
  { key: "leaderboard", icon: <LuChartNoAxesCombined size={18} />, accent: "blue" },
] as const;

const collectibleTiers = [
  { key: "signal", accent: "violet" },
  { key: "rare", accent: "pink" },
  { key: "ascendant", accent: "blue" },
] as const;

const performanceItems = [
  { key: "adaptive", icon: <LuChartNoAxesCombined size={18} />, accent: "blue" },
  { key: "reducedMotion", icon: <LuShieldCheck size={18} />, accent: "violet" },
  { key: "lighterFx", icon: <LuSparkles size={18} />, accent: "pink" },
  { key: "fastSurface", icon: <LuLayoutTemplate size={18} />, accent: "violet" },
] as const;

function joinClassNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function HomePageClient() {
  const [username, setUsername] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { t } = useI18n();
  const { profile } = useAdaptivePerformance();
  const mobileMenuId = useId();
  const mobileMenuCloseRef = useRef<HTMLButtonElement>(null);
  const motionDebugSignatureRef = useRef<string | null>(null);
  const reducedHomeMotion = shouldDisableAdaptiveMotion(profile);
  const motionDebug = getAdaptiveMotionDebugSummary(profile);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const navLinks = [
    { label: t("nav.discord"), href: "#community" },
    { label: t("nav.leaderboard"), href: "/leaderboard" },
    { label: t("nav.help"), href: "#support" },
    { label: t("nav.pricing"), href: "/pricing" },
  ] as const;

  const localizedHeroChips = heroChipKeys.map((chip) => ({
    ...chip,
    label: t(`home.heroChips.${chip.key}`),
  }));
  const localizedHeroTrust = heroTrustItems.map((item) => ({
    ...item,
    label: t(`home.trust.${item.key}`),
  }));
  const localizedIdentityCards = identityCards.map((card) => ({
    ...card,
    title: t(`home.identity.cards.${card.key}.title`),
    body: t(`home.identity.cards.${card.key}.body`),
  }));
  const localizedGamerCards = gamerCards.map((card) => ({
    ...card,
    title: t(`home.gamers.cards.${card.key}.title`),
    body: t(`home.gamers.cards.${card.key}.body`),
  }));
  const localizedCollectibleTiers = collectibleTiers.map((tier) => ({
    ...tier,
    tag: t(`home.collectible.tiers.${tier.key}.tag`),
    title: t(`home.collectible.tiers.${tier.key}.title`),
    body: t(`home.collectible.tiers.${tier.key}.body`),
  }));
  const localizedPerformanceItems = performanceItems.map((item) => ({
    ...item,
    title: t(`home.performance.items.${item.key}.title`),
    body: t(`home.performance.items.${item.key}.body`),
  }));
  useBodyScrollLock(isMobileMenuOpen);

  const homeOrbitDuration = reducedHomeMotion
    ? "0s"
    : profile.tier === "high"
      ? "28s"
      : profile.tier === "medium"
        ? "38s"
        : "46s";
  const homeFloatDuration = reducedHomeMotion
    ? "0s"
    : profile.tier === "high"
      ? "6.6s"
      : profile.tier === "medium"
        ? "7.2s"
        : "8.1s";

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    mobileMenuCloseRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const desktopMediaQuery = window.matchMedia("(min-width: 921px)");
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMobileMenuOpen(false);
      }
    };

    if (desktopMediaQuery.matches) {
      setIsMobileMenuOpen(false);
    }

    desktopMediaQuery.addEventListener("change", handleDesktopChange);

    return () => {
      desktopMediaQuery.removeEventListener("change", handleDesktopChange);
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanUsername = username
      .trim()
      .replace(/^@+/, "")
      .replace(/\s+/g, "")
      .toLowerCase();

    router.push(
      cleanUsername
        ? `/register?username=${encodeURIComponent(cleanUsername)}`
        : "/register",
    );
  }

  const homeExperienceStyle = {
    ...pageStyle,
    "--home-atmosphere-opacity":
      profile.tier === "high" ? "1" : profile.tier === "medium" ? "0.76" : "0.58",
    "--home-glow-opacity":
      !reducedHomeMotion
        ? profile.tier === "high"
          ? "1"
          : profile.tier === "medium"
            ? "0.78"
            : "0.64"
        : "0.42",
    "--home-blur-scale": profile.allowBlurEffects ? profile.blurScale.toFixed(2) : "0",
    "--home-nav-blur": profile.allowBlurEffects
      ? profile.tier === "high"
        ? "10px"
        : "7px"
      : "0px",
    "--home-surface-blur": profile.allowBlurEffects
      ? profile.tier === "high"
        ? "14px"
        : "8px"
      : "0px",
    "--home-noise-opacity": profile.safeMode
      ? "0.018"
      : profile.tier === "high"
        ? "0.048"
        : "0.026",
    "--home-orbit-duration": homeOrbitDuration,
    "--home-float-duration": homeFloatDuration,
  } as CSSProperties;

  const rootClassName = joinClassNames(
    "yotei-scrollbar-hidden",
    "home-page",
    !reducedHomeMotion && "home-live-motion",
    reducedHomeMotion && "home-reduced-motion",
    profile.safeMode && "home-safe-mode"
  );

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const debugPayload = {
      tier: profile.tier,
      safeMode: profile.safeMode,
      reducedMotion: profile.reducedMotion,
      saveData: profile.saveData,
      allowDecorativeMotion: profile.allowDecorativeMotion,
      allowAmbientMotion: profile.allowAmbientMotion,
      allowBlurEffects: profile.allowBlurEffects,
      reducedHomeMotion,
      ybmAnimated: !reducedHomeMotion,
      blockedBy: motionDebug.blockedBy,
      orbitDuration: homeOrbitDuration,
      floatDuration: homeFloatDuration,
    };
    const nextSignature = JSON.stringify(debugPayload);

    if (motionDebugSignatureRef.current === nextSignature) {
      return;
    }

    motionDebugSignatureRef.current = nextSignature;

    console.groupCollapsed(`Yotei home motion (${motionDebug.motionPolicy})`);
    console.table(debugPayload);
    console.groupEnd();
  }, [
    homeFloatDuration,
    homeOrbitDuration,
    motionDebug.blockedBy,
    motionDebug.motionPolicy,
    profile.allowAmbientMotion,
    profile.allowBlurEffects,
    profile.allowDecorativeMotion,
    profile.reducedMotion,
    profile.safeMode,
    profile.saveData,
    profile.tier,
    reducedHomeMotion,
  ]);

  return (
    <main className={rootClassName} style={homeExperienceStyle}>
      <style>{`
        .home-page {
          position: relative;
          overflow-x: clip;
        }

        .home-shell {
          width: min(1200px, calc(100% - 32px));
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-orb-a,
        .page-orb-b,
        .page-orb-c,
        .page-beam,
        .page-grid,
        .page-noise,
        .page-scanline,
        .page-vignette {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .page-orb-a,
        .page-orb-b,
        .page-orb-c,
        .page-beam {
          inset: auto;
        }

        .page-orb-a {
          top: -220px;
          left: -160px;
          width: 620px;
          height: 620px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(122, 108, 255, 0.26) 0%, rgba(122, 108, 255, 0.08) 34%, rgba(122, 108, 255, 0) 74%);
          filter: blur(calc(30px * var(--home-blur-scale, 1)));
          opacity: calc(1 * var(--home-atmosphere-opacity, 1));
        }

        .page-orb-b {
          top: 24px;
          right: -180px;
          width: 580px;
          height: 580px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255, 110, 168, 0.18) 0%, rgba(255, 110, 168, 0.06) 34%, rgba(255, 110, 168, 0) 74%);
          filter: blur(calc(36px * var(--home-blur-scale, 1)));
          opacity: calc(1 * var(--home-atmosphere-opacity, 1));
        }

        .page-orb-c {
          top: 22%;
          left: 44%;
          width: 520px;
          height: 520px;
          border-radius: 999px;
          transform: translateX(-50%);
          background: radial-gradient(circle, rgba(90, 169, 255, 0.12) 0%, rgba(90, 169, 255, 0.04) 36%, rgba(90, 169, 255, 0) 74%);
          filter: blur(calc(40px * var(--home-blur-scale, 1)));
          opacity: calc(1 * var(--home-atmosphere-opacity, 1));
        }

        .page-beam {
          top: 0;
          left: 50%;
          width: min(980px, 100vw);
          height: 460px;
          transform: translateX(-50%);
          background:
            radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.08), transparent 34%),
            linear-gradient(180deg, rgba(124, 108, 255, 0.12), rgba(124, 108, 255, 0));
          opacity: calc(0.64 * var(--home-atmosphere-opacity, 1));
        }

        .page-grid {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 96px 96px;
          opacity: calc(0.22 * var(--home-atmosphere-opacity, 1));
          mask-image: linear-gradient(180deg, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.12));
        }

        .page-noise {
          opacity: var(--home-noise-opacity, 0.04);
          background-image:
            radial-gradient(rgba(255, 255, 255, 0.18) 0.65px, transparent 0.65px),
            radial-gradient(rgba(255, 255, 255, 0.12) 0.6px, transparent 0.6px);
          background-position: 0 0, 16px 16px;
          background-size: 30px 30px;
          mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.82), rgba(0, 0, 0, 0.14));
        }

        .page-scanline {
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0) 28%),
            repeating-linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.02) 0,
              rgba(255, 255, 255, 0.02) 1px,
              transparent 1px,
              transparent 6px
            );
          opacity: 0.2;
          mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.36), transparent 68%);
        }

        .page-vignette {
          background:
            radial-gradient(circle at top, rgba(70, 27, 49, 0.18), transparent 20%),
            radial-gradient(circle at center, rgba(0, 0, 0, 0) 48%, rgba(0, 0, 0, 0.28) 100%),
            linear-gradient(180deg, rgba(5, 6, 10, 0) 0%, rgba(5, 6, 10, 0.28) 100%);
        }

        .home-header {
          position: relative;
          z-index: 30;
          padding: 24px 0 0;
        }

        .nav-shell {
          position: relative;
          z-index: 40;
        }

        .home-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 16px 18px;
          border-radius: 999px;
          background:
            linear-gradient(180deg, rgba(20, 16, 28, 0.94), rgba(10, 9, 16, 0.94)),
            rgba(13, 11, 18, 0.86);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.05),
            0 24px 48px rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(var(--home-nav-blur, 10px));
        }

        .brand-link,
        .nav-link,
        .nav-mobile-link,
        .nav-cta,
        .nav-ghost,
        .nav-mobile-toggle,
        .signal-pill,
        .surface-card {
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease,
            color 180ms ease;
        }

        .brand-link {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          color: #ffffff;
          text-decoration: none;
        }

        .brand-mark-svg {
          flex-shrink: 0;
          transition: transform 180ms ease;
        }

        .brand-copy {
          display: grid;
          gap: 2px;
          min-width: 0;
        }

        .brand-copy strong {
          font-size: 15px;
          letter-spacing: -0.04em;
          white-space: nowrap;
        }

        .brand-copy span {
          font-size: 12px;
          color: #99a3bb;
          white-space: nowrap;
        }

        .nav-center,
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          min-width: 0;
        }

        .nav-center {
          justify-content: center;
          flex: 1;
        }

        .nav-link,
        .nav-mobile-link,
        .nav-ghost,
        .nav-cta {
          min-height: 42px;
          padding: 0 14px;
          border-radius: 999px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          border: 1px solid transparent;
        }

        .nav-link,
        .nav-mobile-link,
        .nav-ghost {
          color: #d7def0;
        }

        .nav-cta,
        .cta-primary,
        .claim-button {
          color: #ffffff;
          background:
            linear-gradient(135deg, rgba(124, 108, 255, 0.98), rgba(255, 110, 168, 0.94)),
            linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.16),
            0 16px 28px rgba(112, 92, 255, 0.24);
        }

        .nav-mobile-toggle {
          display: none;
          width: 46px;
          height: 46px;
          border-radius: 16px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.09);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03)),
            rgba(14, 12, 20, 0.88);
          color: #f5f7ff;
          cursor: pointer;
          flex-shrink: 0;
        }

        .nav-mobile-toggle i,
        .nav-mobile-toggle i::before,
        .nav-mobile-toggle i::after {
          display: block;
          width: 16px;
          height: 2px;
          border-radius: 999px;
          background: currentColor;
          transition: transform 180ms ease, opacity 180ms ease;
        }

        .nav-mobile-toggle i {
          position: relative;
        }

        .nav-mobile-toggle i::before,
        .nav-mobile-toggle i::after {
          content: "";
          position: absolute;
          left: 0;
        }

        .nav-mobile-toggle i::before {
          top: -5px;
        }

        .nav-mobile-toggle i::after {
          top: 5px;
        }

        .nav-mobile-toggle.is-open i {
          background: transparent;
        }

        .nav-mobile-toggle.is-open i::before {
          transform: translateY(5px) rotate(45deg);
        }

        .nav-mobile-toggle.is-open i::after {
          transform: translateY(-5px) rotate(-45deg);
        }

        .nav-mobile-backdrop {
          position: fixed;
          inset: 0;
          z-index: 80;
          border: 0;
          padding: 0;
          background: rgba(5, 7, 12, 0.72);
          backdrop-filter: blur(8px);
          cursor: pointer;
        }

        .nav-mobile-panel {
          position: absolute;
          top: calc(100% + 12px);
          left: 0;
          right: 0;
          z-index: 82;
          display: grid;
          gap: 14px;
          padding: 14px;
          border-radius: 26px;
          background:
            linear-gradient(180deg, rgba(17, 13, 24, 0.96), rgba(10, 9, 16, 0.98)),
            rgba(15, 11, 22, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.24);
          backdrop-filter: blur(var(--home-surface-blur, 12px));
        }

        .nav-mobile-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .nav-mobile-panel-title {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #f5f7ff;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .nav-mobile-close {
          min-width: 42px;
          min-height: 42px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          color: #f5f7ff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .nav-mobile-links,
        .nav-mobile-actions {
          display: grid;
          gap: 10px;
        }

        .nav-mobile-links {
          margin-bottom: 12px;
        }

        .nav-mobile-link,
        .nav-mobile-actions .nav-ghost,
        .nav-mobile-actions .nav-cta {
          width: 100%;
          justify-content: space-between;
          padding: 0 16px;
          box-sizing: border-box;
        }

        .hero-section {
          position: relative;
          padding: 52px 0 74px;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(420px, 1.1fr);
          gap: 68px;
          align-items: center;
          min-height: calc(100vh - 168px);
        }

        .hero-copy,
        .hero-visual {
          position: relative;
          z-index: 1;
          min-width: 0;
        }

        .launch-reveal {
          opacity: 0;
          transform: translateY(18px);
          animation: home-fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .launch-delay-1 { animation-delay: 0.04s; }
        .launch-delay-2 { animation-delay: 0.1s; }
        .launch-delay-3 { animation-delay: 0.16s; }
        .launch-delay-4 { animation-delay: 0.24s; }
        .launch-delay-5 { animation-delay: 0.32s; }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 38px;
          padding: 0 14px;
          border-radius: 999px;
          color: #ffd9eb;
          background:
            linear-gradient(180deg, rgba(255, 110, 168, 0.14), rgba(255, 110, 168, 0.08)),
            rgba(255, 110, 168, 0.08);
          border: 1px solid rgba(255, 110, 168, 0.16);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .hero-title {
          margin: 28px 0 0;
          max-width: 640px;
          font-size: clamp(46px, 7.1vw, 80px);
          line-height: 0.98;
          letter-spacing: -0.072em;
          font-weight: 950;
          text-wrap: balance;
          text-shadow: 0 16px 38px rgba(0, 0, 0, 0.22);
        }

        .hero-accent {
          display: block;
          background: linear-gradient(90deg, #ffffff 0%, #ddd4ff 26%, #95b6ff 58%, #ff8fc3 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 26px rgba(137, 121, 255, 0.14));
        }

        .hero-body {
          margin: 28px 0 0;
          max-width: 560px;
          color: #c9d2e5;
          font-size: 17px;
          line-height: 1.82;
          text-wrap: pretty;
        }

        .claim-caption {
          margin-top: 24px;
          color: #93a0b8;
          font-size: 13px;
          font-weight: 700;
        }

        .claim-form {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 12px;
          margin-top: 26px;
          width: 100%;
          max-width: 680px;
          padding: 12px;
          border-radius: 28px;
          background:
            linear-gradient(180deg, rgba(16, 12, 23, 0.96), rgba(10, 9, 16, 0.95)),
            rgba(14, 11, 21, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.04),
            0 28px 48px rgba(0, 0, 0, 0.24);
          box-sizing: border-box;
        }

        .claim-field {
          min-height: 62px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 18px;
          border-radius: 18px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.03)),
            rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .claim-prefix {
          color: #8793a8;
          font-size: 15px;
          font-weight: 700;
          white-space: nowrap;
        }

        .claim-input {
          flex: 1;
          min-width: 0;
          border: 0;
          padding: 0;
          background: transparent;
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          outline: none;
        }

        .claim-input::placeholder {
          color: #6f7b92;
        }

        .claim-button,
        .cta-primary,
        .cta-secondary {
          min-height: 62px;
          border-radius: 18px;
          border: 1px solid transparent;
          padding: 0 22px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          white-space: nowrap;
        }

        .cta-secondary {
          color: #d8e1f3;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)),
            rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.08);
        }

        .hero-trust {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 24px;
        }

        .signal-pill {
          min-height: 36px;
          padding: 0 14px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #d9e5ff;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
          font-size: 12px;
          font-weight: 700;
        }

        .hero-visual {
          display: block;
        }

        .reactor-panel {
          position: relative;
          display: grid;
          gap: 24px;
          padding: 30px;
          border-radius: 40px;
          background:
            radial-gradient(circle at top right, rgba(255, 110, 168, 0.1), transparent 30%),
            radial-gradient(circle at bottom left, rgba(90, 169, 255, 0.1), transparent 28%),
            linear-gradient(180deg, rgba(15, 13, 23, 0.98), rgba(8, 8, 14, 0.98));
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.04),
            0 40px 76px rgba(0, 0, 0, 0.28);
          overflow: hidden;
        }

        .reactor-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.06), transparent 18%),
            linear-gradient(180deg, transparent 68%, rgba(90, 169, 255, 0.04));
          pointer-events: none;
        }

        .reactor-panel-top {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 12px;
        }

        .reactor-topline {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #e6ebff;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .reactor-topline-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #ff7ab7;
          box-shadow: 0 0 14px rgba(255, 122, 183, 0.44);
        }

        .reactor-core-zone,
        .section-surface,
        .cta-panel {
          position: relative;
          border-radius: 28px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02)),
            rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }

        .reactor-core-zone {
          padding: 10px 10px 0;
          min-height: 520px;
          display: grid;
          align-items: center;
          justify-items: center;
          background: transparent;
          border: 0;
        }

        .reactor-core-zone::before {
          content: "";
          position: absolute;
          inset: 8%;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          pointer-events: none;
        }

        .reactor-center {
          position: relative;
          width: min(100%, 430px);
          aspect-ratio: 1 / 1;
          display: grid;
          place-items: center;
        }

        .reactor-aura,
        .reactor-orbit,
        .reactor-orbit::before,
        .reactor-orbit::after {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
        }

        .reactor-aura {
          background:
            radial-gradient(circle, rgba(126, 110, 255, 0.22) 0%, rgba(126, 110, 255, 0.08) 34%, rgba(126, 110, 255, 0) 72%),
            radial-gradient(circle at 68% 34%, rgba(255, 110, 168, 0.18) 0%, rgba(255, 110, 168, 0) 26%),
            radial-gradient(circle at 32% 72%, rgba(90, 169, 255, 0.14) 0%, rgba(90, 169, 255, 0) 24%);
          opacity: calc(0.96 * var(--home-glow-opacity, 1));
        }

        .reactor-orbit {
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .reactor-orbit::before,
        .reactor-orbit::after {
          content: "";
          inset: auto;
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.76);
          box-shadow: 0 0 18px rgba(155, 139, 255, 0.38);
        }

        .reactor-orbit-one {
          transform: rotate(-12deg);
        }

        .reactor-orbit-one::before {
          top: 18%;
          right: 14%;
          background: #ff93c7;
        }

        .reactor-orbit-one::after {
          bottom: 18%;
          left: 14%;
          background: #83caff;
        }

        .reactor-orbit-two {
          inset: 14%;
          transform: rotate(18deg);
          border-color: rgba(255, 255, 255, 0.05);
        }

        .reactor-orbit-two::before {
          top: 10%;
          left: 18%;
          background: #b29cff;
        }

        .reactor-orbit-two::after {
          right: 12%;
          bottom: 16%;
          background: #ffd4ea;
        }

        .reactor-mark {
          position: relative;
          z-index: 1;
          width: 48% !important;
          height: auto !important;
        }

        .reactor-chip {
          position: absolute;
          min-height: 36px;
          padding: 0 14px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)),
            rgba(10, 10, 16, 0.62);
          color: #eef2ff;
          backdrop-filter: blur(var(--home-surface-blur, 10px));
        }

        .reactor-chip::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: currentColor;
          opacity: 0.7;
        }

        .chip-violet { color: #c1b5ff; }
        .chip-pink { color: #ffb6d7; }
        .chip-blue { color: #9fd5ff; }
        .chip-soft { color: #e4ddff; }

        .reactor-chip-links { top: 12%; left: 6%; }
        .reactor-chip-badges { top: 18%; right: 4%; }
        .reactor-chip-music { bottom: 14%; left: 50%; transform: translateX(-50%); }

        .reactor-caption {
          position: relative;
          z-index: 1;
          display: grid;
          gap: 8px;
          text-align: center;
          max-width: 360px;
          margin: -4px auto 0;
        }

        .reactor-caption strong {
          font-size: 28px;
          letter-spacing: -0.05em;
        }

        .reactor-caption p {
          margin: 0;
          color: #a5b0c7;
          font-size: 14px;
          line-height: 1.72;
        }

        .reactor-footer {
          color: #8d98af;
          font-size: 12px;
          font-weight: 700;
          text-align: center;
        }

        .section-shell {
          position: relative;
          padding: 52px 0 20px;
        }

        .section-intro {
          display: grid;
          gap: 16px;
          max-width: 660px;
          margin-bottom: 34px;
        }

        .section-intro h2,
        .cta-copy h2 {
          margin: 0;
          font-size: clamp(34px, 5.4vw, 58px);
          line-height: 0.98;
          letter-spacing: -0.06em;
        }

        .section-intro p,
        .cta-copy p {
          margin: 0;
          color: #b8c3da;
          font-size: 17px;
          line-height: 1.72;
          text-wrap: pretty;
        }

        .section-surface {
          padding: 8px 0 0;
          display: grid;
          gap: 18px;
          background: transparent;
          border: 0;
        }

        .surface-grid {
          display: grid;
          gap: 18px;
        }

        .identity-card-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .creator-card-grid,
        .performance-card-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .surface-card {
          position: relative;
          display: grid;
          gap: 14px;
          padding: 24px;
          border-radius: 28px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015)),
            rgba(255, 255, 255, 0.015);
          border: 1px solid rgba(255, 255, 255, 0.05);
          min-width: 0;
        }

        .surface-card:hover {
          border-color: rgba(255, 255, 255, 0.12);
          box-shadow: 0 18px 34px rgba(0, 0, 0, 0.18);
        }

        .card-icon {
          width: 44px;
          height: 44px;
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .accent-violet {
          color: #c3b4ff;
          background: rgba(138, 118, 255, 0.12);
          border: 1px solid rgba(138, 118, 255, 0.2);
        }

        .accent-pink {
          color: #ffb5d9;
          background: rgba(255, 122, 183, 0.12);
          border: 1px solid rgba(255, 122, 183, 0.2);
        }

        .accent-blue {
          color: #9fd7ff;
          background: rgba(90, 169, 255, 0.12);
          border: 1px solid rgba(90, 169, 255, 0.2);
        }

        .surface-card h3,
        .collectible-card h3 {
          margin: 0;
          font-size: 20px;
          letter-spacing: -0.04em;
        }

        .surface-card p,
        .collectible-card p {
          margin: 0;
          color: #aab4cb;
          font-size: 14px;
          line-height: 1.68;
        }

        .creator-grid,
        .performance-grid {
          display: grid;
          gap: 18px;
        }

        .creator-card-grid {
          display: grid;
          gap: 14px;
        }

        .collectible-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .collectible-card {
          position: relative;
          display: grid;
          gap: 12px;
          padding: 20px;
          border-radius: 26px;
          background:
            radial-gradient(circle at top right, rgba(255, 255, 255, 0.06), transparent 28%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02)),
            rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.07);
          overflow: hidden;
        }

        .collectible-card::after {
          content: "";
          position: absolute;
          inset: auto 18px 18px;
          height: 3px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(138, 118, 255, 0.8), rgba(255, 122, 183, 0.8), rgba(90, 169, 255, 0.8));
          opacity: 0.72;
        }

        .collectible-tag {
          display: inline-flex;
          width: fit-content;
          min-height: 30px;
          padding: 0 12px;
          border-radius: 999px;
          align-items: center;
          color: #eef2ff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .collectible-footer {
          margin-top: 20px;
          display: grid;
          gap: 12px;
          color: #aab4cb;
          font-size: 14px;
          line-height: 1.68;
        }

        .performance-note {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          border-radius: 22px;
          background:
            linear-gradient(180deg, rgba(90, 169, 255, 0.08), rgba(90, 169, 255, 0.04)),
            rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(90, 169, 255, 0.12);
          color: #d9e7ff;
          font-size: 14px;
          font-weight: 700;
        }

        .cta-section {
          padding: 60px 0 92px;
        }

        .cta-panel {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 0.92fr);
          gap: 28px;
          padding: 30px;
          background:
            radial-gradient(circle at top left, rgba(124, 108, 255, 0.14), transparent 30%),
            radial-gradient(circle at bottom right, rgba(255, 110, 168, 0.12), transparent 28%),
            linear-gradient(180deg, rgba(16, 13, 24, 0.98), rgba(8, 8, 14, 0.98));
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.04),
            0 34px 64px rgba(0, 0, 0, 0.28);
        }

        .cta-copy {
          display: grid;
          gap: 14px;
          align-content: start;
        }

        .cta-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .cta-form-wrap {
          display: grid;
          gap: 14px;
          align-content: start;
        }

        .cta-helper {
          color: #8f9ab3;
          font-size: 13px;
          font-weight: 700;
        }

        .home-live-motion .reactor-aura {
          animation: home-breathe var(--home-float-duration, 6.6s) ease-in-out infinite;
        }

        .home-live-motion .reactor-orbit-one {
          animation: home-orbit var(--home-orbit-duration, 28s) linear infinite;
        }

        .home-live-motion .reactor-orbit-two {
          animation: home-orbit-reverse calc(var(--home-orbit-duration, 28s) * 1.2) linear infinite;
        }

        .home-live-motion .reactor-panel {
          animation: home-float-panel var(--home-float-duration, 6.6s) ease-in-out infinite;
        }

        @keyframes home-fade-up {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes home-orbit {
          to {
            transform: rotate(348deg);
          }
        }

        @keyframes home-orbit-reverse {
          to {
            transform: rotate(-342deg);
          }
        }

        @keyframes home-breathe {
          0%,
          100% {
            transform: scale(0.985);
            opacity: calc(0.82 * var(--home-glow-opacity, 1));
          }

          50% {
            transform: scale(1.03);
            opacity: calc(1 * var(--home-glow-opacity, 1));
          }
        }

        @keyframes home-float-panel {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        @media (hover: hover) and (pointer: fine) {
          .brand-link:hover,
          .nav-link:hover,
          .nav-mobile-link:hover,
          .nav-cta:hover,
          .nav-ghost:hover,
          .nav-mobile-toggle:hover,
          .surface-card:hover {
            transform: translateY(-2px);
          }

          .nav-link:hover,
          .nav-mobile-link:hover,
          .nav-ghost:hover {
            background: rgba(255, 255, 255, 0.04);
            border-color: rgba(255, 255, 255, 0.08);
          }

          .brand-link:hover .brand-mark-svg {
            transform: translateY(-1px) scale(1.02);
          }

          .nav-cta:hover,
          .claim-button:hover,
          .cta-primary:hover {
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.2),
              0 22px 38px rgba(118, 95, 255, 0.3);
          }
        }

        @media (max-width: 1120px) {
          .hero-grid,
          .cta-panel {
            grid-template-columns: 1fr;
          }

          .hero-grid {
            min-height: 0;
          }

          .hero-visual {
            max-width: 760px;
            width: 100%;
            margin: 0 auto;
          }

          .reactor-core-zone {
            min-height: 360px;
          }
        }

        @media (max-width: 920px) {
          .home-nav {
            padding: 14px 14px 14px 16px;
            border-radius: 26px;
            gap: 12px;
          }

          .brand-link {
            flex: 1;
          }

          .nav-center,
          .nav-actions {
            display: none;
          }

          .nav-mobile-toggle {
            display: inline-flex;
          }

          .hero-section {
            padding-top: 18px;
          }

          .hero-grid {
            gap: 30px;
          }

          .hero-copy {
            text-align: center;
          }

          .claim-form,
          .hero-trust {
            margin-left: auto;
            margin-right: auto;
            justify-content: center;
          }

          .eyebrow {
            justify-content: center;
          }

          .section-intro {
            text-align: center;
            margin-left: auto;
            margin-right: auto;
          }

          .cta-copy,
          .cta-form-wrap {
            text-align: center;
          }

          .cta-actions {
            justify-content: center;
          }
        }

        @media (max-width: 760px) {
          .identity-card-grid,
          .creator-card-grid,
          .collectible-grid,
          .performance-card-grid {
            grid-template-columns: 1fr;
          }

          .claim-form {
            grid-template-columns: 1fr;
          }

          .claim-button,
          .cta-primary,
          .cta-secondary {
            width: 100%;
          }

          .reactor-core-zone {
            min-height: 360px;
          }
        }

        @media (max-width: 640px) {
          .home-shell {
            width: min(100% - 24px, 1200px);
          }

          .home-header {
            padding-top: 14px;
          }

          .hero-section,
          .section-shell {
            padding-top: 20px;
          }

          .cta-section {
            padding-top: 20px;
            padding-bottom: 64px;
          }

          .hero-title {
            font-size: clamp(38px, 11.5vw, 56px);
            line-height: 0.96;
            text-shadow: none;
          }

          .hero-body,
          .section-intro p,
          .cta-copy p {
            font-size: 15px;
            line-height: 1.68;
          }

          .eyebrow {
            min-height: 34px;
            padding: 0 12px;
            font-size: 11px;
          }

          .claim-form,
          .reactor-panel,
          .section-surface,
          .cta-panel {
            padding: 18px;
            border-radius: 24px;
          }

          .claim-field,
          .claim-button,
          .cta-primary,
          .cta-secondary {
            min-height: 56px;
          }

          .reactor-core-zone {
            min-height: 340px;
            padding-bottom: 8px;
          }

          .reactor-mark {
            width: 44% !important;
          }

          .reactor-center {
            width: min(100%, 300px);
          }

          .reactor-chip {
            min-height: 32px;
            padding: 0 12px;
            font-size: 10px;
          }

          .reactor-chip-links {
            top: 6%;
            left: 2%;
          }

          .reactor-chip-badges {
            top: 14%;
            right: 1%;
          }

          .reactor-chip-music {
            bottom: 8%;
          }

          .page-orb-a,
          .page-orb-b,
          .page-orb-c,
          .page-beam {
            opacity: 0.58;
            filter: blur(20px);
          }

          .page-noise {
            opacity: 0.02;
          }
        }

        @media (max-width: 430px) {
          .home-shell {
            width: min(100% - 20px, 1200px);
          }

          .brand-mark-svg {
            width: 38px !important;
            height: 38px !important;
          }

          .brand-copy strong {
            font-size: 14px;
          }

          .brand-copy span {
            font-size: 11px;
          }

          .nav-mobile-panel {
            padding: 12px;
            border-radius: 22px;
          }

          .hero-grid {
            gap: 24px;
          }

          .reactor-caption strong {
            font-size: 24px;
          }
        }

        @media (max-width: 375px) {
          .home-shell {
            width: min(100% - 18px, 1200px);
          }

          .home-nav {
            padding: 12px;
          }

          .nav-mobile-toggle {
            width: 42px;
            height: 42px;
            border-radius: 14px;
          }

          .hero-title {
            font-size: clamp(34px, 10.6vw, 46px);
          }
        }

        @media (max-width: 320px) {
          .home-shell {
            width: min(100% - 16px, 1200px);
          }

          .brand-link {
            gap: 10px;
          }

          .claim-prefix,
          .claim-input,
          .signal-pill {
            font-size: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .launch-reveal,
          .brand-link,
          .nav-link,
          .nav-mobile-link,
          .nav-cta,
          .nav-ghost,
          .nav-mobile-toggle,
          .signal-pill,
          .surface-card {
            animation: none !important;
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }

        .home-reduced-motion .launch-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      `}</style>

      <div className="page-orb-a" />
      <div className="page-orb-b" />
      <div className="page-orb-c" />
      <div className="page-beam" />
      <div className="page-grid" />
      {!profile.safeMode ? <div className="page-noise" /> : null}
      {!reducedHomeMotion && profile.tier === "high" ? <div className="page-scanline" /> : null}
      <div className="page-vignette" />

      <header className="home-header">
        <div className="home-shell">
          <div className="nav-shell">
            <div className="home-nav">
              <Link href="/" className="brand-link" onClick={closeMobileMenu}>
                <YoteiBrandMark
                  animated={!reducedHomeMotion}
                  className="brand-mark-svg"
                  debugLabel="home-nav"
                  intensity="standard"
                  size={40}
                />
                <div className="brand-copy">
                  <strong>Yotei</strong>
                  <span>{t("home.brandSubtitle")}</span>
                </div>
              </Link>

              <nav className="nav-center" aria-label={t("nav.mainNavigation")}>
                {navLinks.map((item) => (
                  <Link key={item.label} href={item.href} className="nav-link">
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="nav-actions">
                <Link href="/login" className="nav-ghost">
                  {t("nav.login")}
                </Link>
                <Link href="/register" className="nav-cta">
                  {t("nav.signUp")}
                </Link>
                <LanguageSwitcher variant="compact" />
              </div>

              <button
                type="button"
                className={`nav-mobile-toggle${isMobileMenuOpen ? " is-open" : ""}`}
                aria-label={isMobileMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
                aria-expanded={isMobileMenuOpen}
                aria-controls={mobileMenuId}
                onClick={() => setIsMobileMenuOpen((current) => !current)}
              >
                <i />
              </button>
            </div>

            {isMobileMenuOpen ? (
              <>
                <button
                  type="button"
                  className="nav-mobile-backdrop"
                  aria-label={t("nav.closeMenu")}
                  onClick={closeMobileMenu}
                />

                <div
                  id={mobileMenuId}
                  className="nav-mobile-panel"
                  role="dialog"
                  aria-modal="true"
                  aria-label={t("nav.mobileMenu")}
                >
                  <div className="nav-mobile-panel-header">
                    <div className="nav-mobile-panel-title">
                      <LuLayoutPanelTop size={16} />
                      {t("home.mobileMenuTitle")}
                    </div>
                    <button
                      ref={mobileMenuCloseRef}
                      type="button"
                      className="nav-mobile-close"
                      aria-label={t("nav.closeMenu")}
                      onClick={closeMobileMenu}
                    >
                      <LuX size={18} />
                    </button>
                  </div>

                  <LanguageSwitcher />

                  <nav className="nav-mobile-links" aria-label={t("nav.mobileNavigation")}>
                    {navLinks.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="nav-mobile-link"
                        onClick={closeMobileMenu}
                      >
                        {item.label}
                        <LuArrowRight size={15} />
                      </Link>
                    ))}
                  </nav>

                  <div className="nav-mobile-actions">
                    <Link href="/login" className="nav-ghost" onClick={closeMobileMenu}>
                      {t("nav.login")}
                    </Link>
                    <Link href="/register" className="nav-cta" onClick={closeMobileMenu}>
                      {t("nav.signUp")}
                    </Link>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="home-shell hero-grid">
          <div className="hero-copy">
            <div className="eyebrow launch-reveal launch-delay-1">
              <LuSparkles size={14} />
              {t("home.heroEyebrow")}
            </div>

            <h1 className="hero-title launch-reveal launch-delay-2">
              {t("home.heroTitle")}
              <span className="hero-accent">{t("home.heroTitleAccent")}</span>
            </h1>

            <p className="hero-body launch-reveal launch-delay-3">
              {t("home.heroBody")}
            </p>

            <div className="claim-caption launch-reveal launch-delay-3">
              {t("home.claimCaption")}
            </div>

            <ClaimForm
              buttonLabel={t("home.claimButton")}
              inputAriaLabel={t("home.claimInputAriaLabel")}
              inputValue={username}
              onChange={setUsername}
              onSubmit={handleSubmit}
              placeholder={t("home.claimPlaceholder")}
              className="launch-reveal launch-delay-4"
            />

            <div className="hero-trust launch-reveal launch-delay-5">
              {localizedHeroTrust.map((item) => (
                <span key={item.label} className="signal-pill">
                  {item.icon}
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-visual launch-reveal launch-delay-4">
            <div className="reactor-panel">
              <div className="reactor-panel-top">
                <div className="reactor-topline">
                  <span className="reactor-topline-dot" />
                  {t("home.preview.eyebrow")}
                </div>
              </div>

              <div className="reactor-core-zone">
                <div className="reactor-center" aria-hidden="true">
                  <div className="reactor-aura" />
                  <div className="reactor-orbit reactor-orbit-one" />
                  <div className="reactor-orbit reactor-orbit-two" />
                  <YoteiBrandMark
                    animated={!reducedHomeMotion}
                    className="reactor-mark"
                    debugLabel="home-hero"
                    intensity={profile.tier === "high" ? "hero" : "standard"}
                    size={176}
                  />

                  {localizedHeroChips.map((chip) => (
                    <div
                      key={chip.label}
                      className={`reactor-chip reactor-chip-${chip.key} chip-${chip.tone}`}
                    >
                      {chip.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="reactor-caption">
                <strong>{t("home.preview.handle")}</strong>
                <p>{t("home.preview.role")}</p>
              </div>

              <div className="reactor-footer">
                {t("home.preview.footerLeft")} / {t("home.preview.footerRight")}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="home-shell">
          <SectionIntro
            body={t("home.identity.body")}
            eyebrow={t("home.identity.eyebrow")}
            title={t("home.identity.title")}
          />

          <div className="section-surface surface-grid identity-card-grid">
            {localizedIdentityCards.map((card) => (
              <SurfaceCard
                key={card.title}
                accent={card.accent}
                body={card.body}
                icon={card.icon}
                title={card.title}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell" id="community">
        <div className="home-shell">
          <SectionIntro
            body={t("home.gamers.body")}
            eyebrow={t("home.gamers.eyebrow")}
            title={t("home.gamers.title")}
          />

          <div className="creator-grid">
            <div className="creator-card-grid">
              {localizedGamerCards.map((card) => (
                <div key={card.title} className="surface-card">
                  <div className={`card-icon accent-${card.accent}`}>{card.icon}</div>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="home-shell">
          <SectionIntro
            body={t("home.collectible.body")}
            eyebrow={t("home.collectible.eyebrow")}
            title={t("home.collectible.title")}
          />

          <div className="collectible-grid">
            {localizedCollectibleTiers.map((tier) => (
              <div key={tier.title} className="collectible-card">
                <span className="collectible-tag">{tier.tag}</span>
                <h3>{tier.title}</h3>
                <p>{tier.body}</p>
              </div>
            ))}
          </div>

          <div className="collectible-footer">
            <p>{t("home.collectible.footer")}</p>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="home-shell">
          <SectionIntro
            body={t("home.performance.body")}
            eyebrow={t("home.performance.eyebrow")}
            title={t("home.performance.title")}
          />

          <div className="performance-grid">
            <div className="surface-grid performance-card-grid">
              {localizedPerformanceItems.map((item) => (
                <SurfaceCard
                  key={item.title}
                  accent={item.accent}
                  body={item.body}
                  icon={item.icon}
                  title={item.title}
                />
              ))}
            </div>

            <div className="performance-note">
              <LuShieldCheck size={18} />
              {t("home.performance.badge")}
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section" id="support">
        <div className="home-shell">
          <div className="cta-panel">
            <div className="cta-copy">
              <div className="eyebrow">
                <LuSparkles size={14} />
                {t("home.cta.eyebrow")}
              </div>

              <h2>{t("home.cta.title")}</h2>
              <p>{t("home.cta.body")}</p>

              <div className="cta-actions">
                <Link href="/login" className="cta-secondary">
                  {t("home.cta.secondaryButton")}
                </Link>
                <Link href="/pricing" className="cta-secondary">
                  {t("home.cta.pricingButton")}
                </Link>
              </div>
            </div>

            <div className="cta-form-wrap">
              <ClaimForm
                buttonLabel={t("home.cta.primaryButton")}
                inputAriaLabel={t("home.claimInputAriaLabel")}
                inputValue={username}
                onChange={setUsername}
                onSubmit={handleSubmit}
                placeholder={t("home.claimPlaceholder")}
              />
              <div className="cta-helper">{t("home.cta.helper")}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ClaimForm({
  buttonLabel,
  inputAriaLabel,
  inputValue,
  onChange,
  onSubmit,
  placeholder,
  className,
}: {
  buttonLabel: string;
  inputAriaLabel: string;
  inputValue: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <form className={joinClassNames("claim-form", className)} onSubmit={onSubmit}>
      <label className="claim-field">
        <span className="claim-prefix">yotei.app/</span>
        <input
          aria-label={inputAriaLabel}
          className="claim-input"
          value={inputValue}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
        />
      </label>

      <button type="submit" className="claim-button">
        {buttonLabel}
        <LuArrowRight size={17} />
      </button>
    </form>
  );
}

function SectionIntro({
  body,
  eyebrow,
  title,
}: {
  body: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="section-intro">
      <div className="eyebrow">
        <LuSparkles size={14} />
        {eyebrow}
      </div>
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}

function SurfaceCard({
  accent,
  body,
  icon,
  title,
}: {
  accent: string;
  body: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <div className="surface-card">
      <div className={`card-icon accent-${accent}`}>{icon}</div>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  width: "100%",
  position: "relative",
  overflowX: "clip",
  color: "#f7f8ff",
  background:
    "radial-gradient(circle at top, rgba(52, 20, 42, 0.34), transparent 20%), radial-gradient(circle at 18% 12%, rgba(104, 90, 255, 0.18), transparent 24%), radial-gradient(circle at 82% 14%, rgba(255, 110, 168, 0.12), transparent 20%), linear-gradient(180deg, #04050a 0%, #07060d 28%, #05070b 100%)",
};
