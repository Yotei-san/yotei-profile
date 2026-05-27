"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
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
  LuLayoutPanelTop,
  LuLayoutTemplate,
  LuX,
  LuSparkles,
} from "react-icons/lu";
import { useI18n } from "@/app/components/I18nProvider";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { useAdaptivePerformance } from "@/app/components/PerformanceProvider";
import { useBodyScrollLock } from "@/app/components/useBodyScrollLock";
import YoteiBrandMark from "@/app/components/YoteiBrandMark";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.58,
      ease: EASE_OUT,
    },
  },
};

const stagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const featureCards = [
  {
    key: "animatedProfiles",
    icon: <LuSparkles size={18} />,
    accent: "#8A7CFF",
  },
  {
    key: "videoBanners",
    icon: <LuLayoutTemplate size={18} />,
    accent: "#FF77B3",
  },
  {
    key: "premiumLinks",
    icon: <LuBadgeCheck size={18} />,
    accent: "#8EC5FF",
  },
  {
    key: "smartAnalytics",
    icon: <LuChartNoAxesCombined size={18} />,
    accent: "#B58CFF",
  },
] as const;

const identityChips = [
  { key: "links", tone: "violet" },
  { key: "live", tone: "rose" },
  { key: "social", tone: "blue" },
  { key: "premium", tone: "soft" },
] as const;

export default function HomePageClient() {
  const [username, setUsername] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { t } = useI18n();
  const { profile } = useAdaptivePerformance();
  const mobileMenuId = useId();
  const mobileMenuCloseRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion =
    useReducedMotion() || !profile.allowDecorativeMotion;
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const navLinks = [
    { label: t("nav.discord"), href: "#community" },
    { label: t("nav.leaderboard"), href: "/leaderboard" },
    { label: t("nav.help"), href: "#support" },
    { label: t("nav.pricing"), href: "/pricing" },
  ] as const;
  const localizedFeatureCards = featureCards.map((card) => ({
    ...card,
    title: t(`home.featureCards.${card.key}.title`),
    body: t(`home.featureCards.${card.key}.body`),
  }));
  const localizedIdentityChips = identityChips.map((chip) => ({
    ...chip,
    label: t(`home.chips.${chip.key}`),
  }));

  useBodyScrollLock(isMobileMenuOpen);

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
  const homeExperienceStyle = {
    ...pageStyle,
    "--home-atmosphere-opacity":
      profile.tier === "high" ? "1" : profile.tier === "medium" ? "0.74" : "0.44",
    "--home-glow-opacity":
      profile.allowDecorativeMotion
        ? profile.tier === "high"
          ? "1"
          : "0.76"
        : "0.42",
    "--home-blur-scale": profile.allowBlurEffects ? profile.blurScale.toFixed(2) : "0",
    "--home-nav-blur": profile.allowBlurEffects
      ? profile.tier === "high"
        ? "10px"
        : "7px"
      : "0px",
    "--home-glass-blur": profile.allowBlurEffects
      ? profile.tier === "high"
        ? "16px"
        : "10px"
      : "0px",
    "--home-noise-opacity": profile.safeMode
      ? "0.03"
      : profile.tier === "medium"
        ? "0.06"
        : "0.08",
  } as CSSProperties;

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

  return (
    <main className="yotei-scrollbar-hidden" style={homeExperienceStyle}>
      <style>{`
        .home-shell {
          width: min(1180px, calc(100% - 32px));
          max-width: 1180px;
          margin: 0 auto;
        }

        .page-orb-a,
        .page-orb-b,
        .page-orb-c,
        .page-beam,
        .page-grid,
        .page-noise,
        .page-vignette {
          position: absolute;
          pointer-events: none;
        }

        .page-orb-a {
          top: -220px;
          left: -160px;
          width: 660px;
          height: 660px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(123, 108, 255, 0.28) 0%, rgba(123, 108, 255, 0.08) 34%, rgba(123, 108, 255, 0) 72%);
          filter: blur(calc(34px * var(--home-blur-scale, 1)));
          opacity: calc(1 * var(--home-atmosphere-opacity, 1));
        }

        .page-orb-b {
          right: -180px;
          top: 56px;
          width: 620px;
          height: 620px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255, 110, 168, 0.22) 0%, rgba(255, 110, 168, 0.06) 34%, rgba(255, 110, 168, 0) 72%);
          filter: blur(calc(38px * var(--home-blur-scale, 1)));
          opacity: calc(1 * var(--home-atmosphere-opacity, 1));
        }

        .page-orb-c {
          left: 42%;
          top: 18%;
          width: 520px;
          height: 520px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(90, 169, 255, 0.14) 0%, rgba(90, 169, 255, 0.04) 36%, rgba(90, 169, 255, 0) 74%);
          filter: blur(calc(42px * var(--home-blur-scale, 1)));
          transform: translateX(-50%);
          opacity: calc(1 * var(--home-atmosphere-opacity, 1));
        }

        .page-beam {
          inset: 0 auto auto 50%;
          width: min(980px, 100vw);
          height: 460px;
          transform: translateX(-50%);
          background:
            radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.08), transparent 34%),
            linear-gradient(180deg, rgba(133, 112, 255, 0.12), rgba(133, 112, 255, 0));
          opacity: calc(0.65 * var(--home-atmosphere-opacity, 1));
        }

        .page-grid {
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.022) 1px, transparent 1px);
          background-size: 88px 88px;
          opacity: calc(0.22 * var(--home-atmosphere-opacity, 1));
          mask-image: linear-gradient(180deg, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.18));
        }

        .page-noise {
          inset: 0;
          opacity: var(--home-noise-opacity, 0.08);
          background-image:
            radial-gradient(rgba(255, 255, 255, 0.18) 0.7px, transparent 0.7px),
            radial-gradient(rgba(255, 255, 255, 0.12) 0.6px, transparent 0.6px);
          background-position: 0 0, 14px 14px;
          background-size: 28px 28px;
          mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2));
        }

        .page-vignette {
          inset: 0;
          background:
            radial-gradient(circle at top, rgba(68, 28, 48, 0.18), transparent 20%),
            radial-gradient(circle at center, rgba(0, 0, 0, 0) 48%, rgba(0, 0, 0, 0.24) 100%),
            linear-gradient(180deg, rgba(5, 5, 10, 0) 0%, rgba(5, 5, 10, 0.34) 100%);
        }

        .home-header {
          position: relative;
          z-index: 60;
          padding: 24px 0 0;
        }

        .nav-shell {
          display: grid;
          gap: 12px;
          position: relative;
          z-index: 70;
        }

        .home-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 16px 18px;
          border-radius: 999px;
          background:
            linear-gradient(180deg, rgba(22, 16, 31, 0.94), rgba(11, 10, 18, 0.9)),
            rgba(16, 11, 20, 0.84);
          border: 1px solid rgba(255, 255, 255, 0.09);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.05),
            0 24px 48px rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(var(--home-nav-blur, 10px));
          min-width: 0;
        }

        .brand-link,
        .nav-link,
        .nav-mobile-link,
        .nav-cta,
        .nav-mobile-toggle,
        .claim-button,
        .support-link,
        .feature-card,
        .identity-chip {
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease,
            color 180ms ease;
        }

        .brand-link:hover,
        .nav-link:hover,
        .nav-mobile-link:hover,
        .nav-cta:hover,
        .nav-mobile-toggle:hover,
        .claim-button:hover,
        .support-link:hover {
          transform: translateY(-2px);
        }

        .brand-link {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #ffffff;
          flex-shrink: 0;
          min-width: 0;
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

        .nav-link:hover,
        .nav-mobile-link:hover,
        .nav-ghost:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.08);
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
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.06),
            0 14px 28px rgba(0, 0, 0, 0.24);
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
          backdrop-filter: blur(var(--home-glass-blur, 16px));
          overflow: hidden;
        }

        .nav-mobile-backdrop {
          position: fixed;
          inset: 0;
          z-index: 80;
          border: 0;
          padding: 0;
          background: rgba(5, 7, 12, 0.68);
          backdrop-filter: blur(10px);
          cursor: pointer;
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

        .nav-cta {
          color: #ffffff;
          background:
            linear-gradient(135deg, rgba(124, 108, 255, 0.98), rgba(255, 110, 168, 0.94)),
            linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.18),
            0 16px 30px rgba(117, 95, 255, 0.24);
        }

        .hero-section {
          position: relative;
          padding: 34px 0 88px;
          overflow-x: clip;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.02fr) minmax(360px, 0.98fr);
          gap: 48px;
          align-items: center;
          min-height: calc(100vh - 132px);
          min-width: 0;
        }

        .hero-copy {
          position: relative;
          z-index: 1;
          min-width: 0;
        }

        .hero-copy::before {
          content: "";
          position: absolute;
          top: -62px;
          left: -30px;
          width: 420px;
          height: 320px;
          border-radius: 999px;
          background:
            radial-gradient(circle, rgba(129, 108, 255, 0.22) 0%, rgba(129, 108, 255, 0.08) 34%, rgba(129, 108, 255, 0) 72%);
          filter: blur(calc(28px * var(--home-blur-scale, 1)));
          opacity: calc(1 * var(--home-glow-opacity, 1));
          pointer-events: none;
          z-index: -1;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 38px;
          padding: 0 14px;
          border-radius: 999px;
          color: #ffd4e8;
          background:
            linear-gradient(180deg, rgba(255, 110, 168, 0.14), rgba(255, 110, 168, 0.08)),
            rgba(255, 110, 168, 0.1);
          border: 1px solid rgba(255, 110, 168, 0.18);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .hero-title {
          margin: 24px 0 0;
          max-width: 720px;
          font-size: clamp(58px, 8vw, 102px);
          line-height: 0.9;
          letter-spacing: -0.085em;
          font-weight: 950;
          text-wrap: balance;
          text-shadow: 0 18px 44px rgba(0, 0, 0, 0.26);
        }

        .hero-gradient {
          background: linear-gradient(90deg, #ffffff 0%, #ddd4ff 26%, #95b6ff 58%, #ff8fc3 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 28px rgba(137, 121, 255, 0.16));
        }

        .hero-body {
          margin: 24px 0 0;
          max-width: 620px;
          color: #c9d2e5;
          font-size: 18px;
          line-height: 1.75;
          text-wrap: pretty;
        }

        .claim-caption {
          margin-top: 20px;
          color: #94a3bf;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.01em;
        }

        .claim-form {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 12px;
          margin-top: 30px;
          max-width: 660px;
          padding: 12px;
          border-radius: 28px;
          background:
            linear-gradient(180deg, rgba(17, 13, 25, 0.96), rgba(11, 10, 18, 0.94)),
            rgba(15, 11, 22, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.04),
            0 28px 46px rgba(0, 0, 0, 0.24);
          width: 100%;
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
          min-width: 0;
        }

        .claim-prefix {
          color: #97a2bc;
          font-size: 15px;
          font-weight: 700;
          white-space: nowrap;
        }

        .claim-input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #f8f9ff;
          font-size: 16px;
          font-weight: 700;
          font-family: inherit;
        }

        .claim-input::placeholder {
          color: #6d7892;
        }

        .claim-button {
          min-height: 62px;
          padding: 0 22px;
          border: 0;
          border-radius: 20px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #ffffff;
          background:
            linear-gradient(135deg, rgba(124, 108, 255, 0.98), rgba(255, 110, 168, 0.94)),
            linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0));
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.18),
            0 18px 34px rgba(110, 92, 255, 0.3);
          font-size: 15px;
          font-weight: 900;
          font-family: inherit;
        }

        .hero-trust {
          margin: 18px 0 0;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          color: #dfe6f4;
          font-size: 13px;
          font-weight: 700;
        }

        .hero-trust span {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .hero-trust-dot {
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.32);
        }

        .preview-wrap {
          position: relative;
          display: grid;
          place-items: center;
          min-width: 0;
          width: 100%;
        }

        .orb-scene {
          position: absolute;
          inset: 4% 6%;
          border-radius: 50%;
          background:
            radial-gradient(circle at center, rgba(124, 108, 255, 0.08), transparent 44%),
            radial-gradient(circle at 34% 28%, rgba(255, 255, 255, 0.08), transparent 18%);
          opacity: 0.9;
          pointer-events: none;
        }

        .orb-shell {
          position: relative;
          width: min(560px, 100%);
          aspect-ratio: 1 / 1;
          display: grid;
          place-items: center;
          isolation: isolate;
        }

        .orb-aura {
          position: absolute;
          inset: 10%;
          border-radius: 50%;
          background:
            radial-gradient(circle, rgba(132, 113, 255, 0.24) 0%, rgba(132, 113, 255, 0.08) 38%, rgba(132, 113, 255, 0) 70%),
            radial-gradient(circle at 68% 34%, rgba(255, 110, 168, 0.18) 0%, rgba(255, 110, 168, 0) 26%),
            radial-gradient(circle at 32% 72%, rgba(90, 169, 255, 0.14) 0%, rgba(90, 169, 255, 0) 24%);
          opacity: calc(0.96 * var(--home-glow-opacity, 1));
          pointer-events: none;
        }

        .orb-core {
          position: absolute;
          width: 42%;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background:
            radial-gradient(circle at 34% 28%, rgba(255, 255, 255, 0.24), transparent 18%),
            linear-gradient(145deg, rgba(135, 118, 255, 0.34), rgba(255, 110, 168, 0.22) 52%, rgba(90, 169, 255, 0.2) 100%);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.16),
            0 24px 44px rgba(8, 8, 18, 0.22);
          z-index: 2;
        }

        .orb-core::before {
          content: "";
          position: absolute;
          inset: 10px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.14);
        }

        .orb-core strong {
          position: relative;
          z-index: 1;
          font-size: clamp(64px, 9vw, 104px);
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.09em;
          color: #ffffff;
          text-shadow: 0 14px 34px rgba(9, 10, 24, 0.22);
        }

        .orb-core-mark {
          position: relative;
          z-index: 1;
          width: 76% !important;
          height: auto !important;
        }

        .orb-ring,
        .orb-ring::before {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .orb-ring {
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-sizing: border-box;
        }

        .orb-ring::before {
          content: "";
          inset: auto;
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.88);
          box-shadow: 0 0 18px rgba(255, 255, 255, 0.18);
        }

        .orb-ring-one {
          inset: 8%;
          border-color: rgba(135, 118, 255, 0.22);
        }

        .orb-ring-one::before {
          top: 18%;
          right: 12%;
          background: #9f88ff;
          box-shadow: 0 0 18px rgba(159, 136, 255, 0.26);
        }

        .orb-ring-two {
          inset: 19%;
          border-color: rgba(255, 110, 168, 0.18);
          transform: rotate(16deg);
        }

        .orb-ring-two::before {
          bottom: 9%;
          left: 16%;
          width: 10px;
          height: 10px;
          background: #ff8fc3;
          box-shadow: 0 0 16px rgba(255, 143, 195, 0.24);
        }

        .orb-ring-three {
          inset: 30%;
          border-color: rgba(90, 169, 255, 0.18);
          transform: rotate(-12deg);
        }

        .orb-ring-three::before {
          top: 12%;
          left: 14%;
          width: 8px;
          height: 8px;
          background: #8fd3ff;
          box-shadow: 0 0 14px rgba(143, 211, 255, 0.24);
        }

        .orb-axis {
          position: absolute;
          width: 76%;
          height: 1px;
          background:
            linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0));
          opacity: 0.7;
          pointer-events: none;
        }

        .orb-axis-a {
          transform: rotate(14deg);
        }

        .orb-axis-b {
          transform: rotate(-24deg);
          width: 62%;
        }

        .orb-copy {
          position: relative;
          display: block;
          z-index: 3;
          margin-top: 24px;
          max-width: 340px;
          text-align: center;
        }

        .orb-copy strong {
          display: block;
          font-size: clamp(28px, 3.2vw, 38px);
          line-height: 0.98;
          letter-spacing: -0.06em;
        }

        .orb-copy span {
          display: block;
          margin-top: 12px;
          color: #9ca9c4;
          font-size: 14px;
          line-height: 1.7;
        }

        .identity-chip {
          position: absolute;
          z-index: 4;
          min-height: 34px;
          padding: 0 14px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #f7f8ff;
          background: rgba(16, 14, 25, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .chip-links {
          top: 17%;
          left: 8%;
        }

        .chip-live {
          top: 14%;
          right: 7%;
        }

        .chip-social {
          bottom: 21%;
          left: 10%;
        }

        .chip-premium {
          bottom: 15%;
          right: 11%;
        }

        .chip-violet {
          color: #ddd4ff;
          border-color: rgba(135, 118, 255, 0.18);
        }

        .chip-rose {
          color: #ffd5e7;
          border-color: rgba(255, 110, 168, 0.18);
        }

        .chip-blue {
          color: #d9efff;
          border-color: rgba(90, 169, 255, 0.18);
        }

        .chip-soft {
          color: #f5f7ff;
        }

        .features-section {
          position: relative;
          padding: 0 0 90px;
        }

        .section-intro {
          max-width: 680px;
        }

        .section-intro h2 {
          margin: 20px 0 0;
          font-size: clamp(34px, 4vw, 54px);
          line-height: 0.98;
          letter-spacing: -0.06em;
        }

        .section-intro p {
          margin: 18px 0 0;
          color: #bcc7db;
          font-size: 17px;
          line-height: 1.75;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          margin-top: 32px;
        }

        .feature-card {
          height: 100%;
          padding: 24px;
          border-radius: 28px;
          background: linear-gradient(180deg, rgba(15, 17, 28, 0.96), rgba(9, 11, 18, 0.98));
          border: 1px solid rgba(255, 255, 255, 0.07);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.04),
            0 20px 40px rgba(0, 0, 0, 0.18);
        }

        .feature-icon {
          width: 46px;
          height: 46px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        .feature-card h3 {
          margin: 18px 0 0;
          font-size: 20px;
          letter-spacing: -0.04em;
        }

        .feature-card p {
          margin: 12px 0 0;
          color: #9eabc7;
          font-size: 14px;
          line-height: 1.7;
        }

        .support-panel {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) auto;
          gap: 24px;
          align-items: center;
          margin-top: 28px;
          padding: 26px 28px;
          border-radius: 30px;
          background:
            radial-gradient(circle at top right, rgba(124, 108, 255, 0.16), transparent 26%),
            linear-gradient(180deg, rgba(17, 18, 30, 0.96), rgba(11, 12, 20, 0.98));
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.04),
            0 26px 48px rgba(0, 0, 0, 0.2);
        }

        .support-panel h3 {
          margin: 16px 0 0;
          font-size: clamp(28px, 3vw, 36px);
          line-height: 1.02;
          letter-spacing: -0.05em;
        }

        .support-panel p {
          margin: 14px 0 0;
          max-width: 620px;
          color: #b7c3d9;
          font-size: 15px;
          line-height: 1.75;
        }

        .support-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .support-link {
          min-height: 46px;
          padding: 0 16px;
          border-radius: 999px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #e8edf8;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 14px;
          font-weight: 800;
        }

        .support-link.primary {
          color: #ffffff;
          background: linear-gradient(135deg, rgba(124, 108, 255, 0.9), rgba(255, 110, 168, 0.86));
          box-shadow: 0 16px 30px rgba(110, 92, 255, 0.24);
        }

        @media (hover: hover) and (pointer: fine) {
          .brand-link:hover .brand-mark-svg {
            transform: translateY(-1px) scale(1.02);
          }

          .nav-cta:hover,
          .claim-button:hover,
          .support-link.primary:hover {
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.22),
              0 22px 38px rgba(118, 95, 255, 0.3);
          }

          .feature-card:hover,
          .support-link:hover {
            border-color: rgba(255, 255, 255, 0.12);
            background: rgba(255, 255, 255, 0.05);
          }

          .feature-card:hover {
            transform: translateY(-4px);
          }

          .identity-chip:hover {
            transform: translateY(-2px);
            border-color: rgba(255, 255, 255, 0.12);
          }
        }

        @media (max-width: 1120px) {
          .hero-grid,
          .feature-grid,
          .support-panel {
            grid-template-columns: 1fr;
          }

          .hero-grid {
            min-height: 0;
            gap: 34px;
          }

          .preview-wrap {
            max-width: 720px;
            width: 100%;
            margin: 0 auto;
          }

          .support-actions {
            justify-content: flex-start;
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
            display: flex;
          }

          .hero-section {
            padding: 20px 0 72px;
          }

          .hero-copy {
            text-align: center;
          }

          .hero-copy::before {
            left: 50%;
            transform: translateX(-50%);
          }

          .hero-body,
          .claim-caption,
          .claim-form,
          .hero-trust {
            margin-left: auto;
            margin-right: auto;
          }

          .eyebrow,
          .hero-trust {
            justify-content: center;
          }

          .claim-form {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .home-shell {
            width: min(100% - 24px, 1180px);
          }

          .home-header {
            padding-top: 14px;
          }

          .hero-section {
            padding: 14px 0 58px;
          }

          .hero-title {
            margin-top: 18px;
            font-size: clamp(36px, 11.5vw, 52px);
            line-height: 0.96;
            letter-spacing: -0.07em;
            text-shadow: none;
          }

          .hero-body,
          .section-intro p {
            font-size: 15px;
            line-height: 1.68;
          }

          .eyebrow {
            min-height: 34px;
            padding: 0 12px;
            font-size: 11px;
          }

          .claim-form {
            margin-top: 22px;
            padding: 10px;
            border-radius: 24px;
            gap: 10px;
          }

          .claim-caption {
            margin-top: 16px;
            font-size: 12px;
          }

          .claim-field,
          .claim-button {
            min-height: 56px;
          }

          .claim-button {
            width: 100%;
            padding: 0 18px;
            border-radius: 18px;
          }

          .claim-prefix,
          .claim-input {
            font-size: 14px;
          }

          .hero-trust {
            margin-top: 14px;
            gap: 10px;
            font-size: 12px;
          }

          .preview-wrap {
            max-width: 100%;
          }

          .orb-shell {
            width: min(420px, 100%);
          }

          .orb-copy {
            margin-top: 16px;
            max-width: 280px;
          }

          .orb-copy strong {
            font-size: 24px;
          }

          .orb-copy span {
            font-size: 13px;
          }

          .feature-card,
          .support-panel {
            padding: 20px;
          }

          .page-orb-a,
          .page-orb-b,
          .page-orb-c,
          .page-beam {
            opacity: 0.58;
            filter: blur(22px);
          }

          .page-noise {
            opacity: 0.04;
          }

          .identity-chip {
            min-height: 30px;
            padding: 0 11px;
            font-size: 10px;
          }

          .features-section {
            padding-bottom: 64px;
          }

          .section-intro h2 {
            font-size: clamp(28px, 9vw, 40px);
          }

          .support-panel {
            gap: 18px;
            border-radius: 24px;
          }

          .support-actions {
            display: grid;
            grid-template-columns: 1fr;
            width: 100%;
          }

          .support-link {
            width: 100%;
            box-sizing: border-box;
          }
        }

        @media (max-width: 430px) {
          .home-shell {
            width: min(100% - 20px, 1180px);
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
            gap: 26px;
          }

          .orb-shell {
            width: min(320px, 100%);
          }

          .orb-core {
            width: 46%;
          }

          .orb-core strong {
            font-size: 58px;
          }

          .identity-chip {
            min-height: 28px;
            padding: 0 10px;
            font-size: 9px;
          }

          .chip-links {
            top: 18%;
            left: 5%;
          }

          .chip-live {
            top: 15%;
            right: 4%;
          }

          .chip-social {
            bottom: 22%;
            left: 6%;
          }

          .chip-premium {
            bottom: 18%;
            right: 8%;
          }

          .orb-copy {
            margin-top: 14px;
            max-width: 220px;
          }
        }

        @media (max-width: 390px) {
          .hero-title {
            font-size: clamp(34px, 11vw, 46px);
          }
        }

        @media (max-width: 375px) {
          .home-shell {
            width: min(100% - 18px, 1180px);
          }

          .home-nav {
            padding: 12px;
          }

          .nav-mobile-toggle {
            width: 42px;
            height: 42px;
            border-radius: 14px;
          }

          .hero-section {
            padding-bottom: 52px;
          }

          .hero-title {
            font-size: clamp(32px, 10.8vw, 42px);
          }

          .orb-shell {
            width: min(280px, 100%);
          }
        }

        @media (max-width: 320px) {
          .home-shell {
            width: min(100% - 16px, 1180px);
          }

          .brand-link {
            gap: 10px;
          }

          .hero-title {
            font-size: 30px;
          }

          .claim-prefix {
            font-size: 13px;
          }

          .claim-input {
            font-size: 13px;
          }

          .identity-chip {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nav-mobile-backdrop,
          .nav-mobile-panel,
          .nav-mobile-toggle,
          .nav-mobile-toggle i,
          .nav-mobile-toggle i::before,
          .nav-mobile-toggle i::after,
          .nav-mobile-link,
          .nav-mobile-close {
            transition: none !important;
          }
        }
      `}</style>

      <div className="page-orb-a" />
      <div className="page-orb-b" />
      <div className="page-orb-c" />
      <div className="page-beam" />
      <div className="page-grid" />
      <div className="page-noise" />
      <div className="page-vignette" />

      <header className="home-header">
        <div className="home-shell">
          <div className="nav-shell">
            <motion.div
              className="home-nav"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
            >
              <Link href="/" className="brand-link" onClick={() => setIsMobileMenuOpen(false)}>
                <YoteiBrandMark
                  animated={!shouldReduceMotion}
                  className="brand-mark-svg"
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
            </motion.div>

            <AnimatePresence>
              {isMobileMenuOpen ? (
                <>
                  <motion.button
                    type="button"
                    className="nav-mobile-backdrop"
                    aria-label={t("nav.closeMenu")}
                    onClick={closeMobileMenu}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
                  />

                  <motion.div
                    id={mobileMenuId}
                    className="nav-mobile-panel"
                    role="dialog"
                    aria-modal="true"
                    aria-label={t("nav.mobileMenu")}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.18,
                      ease: EASE_OUT,
                    }}
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
                      <Link
                        href="/login"
                        className="nav-ghost"
                        onClick={closeMobileMenu}
                      >
                        {t("nav.login")}
                      </Link>
                      <Link
                        href="/register"
                        className="nav-cta"
                        onClick={closeMobileMenu}
                      >
                        {t("nav.signUp")}
                      </Link>
                    </div>
                  </motion.div>
                </>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="home-shell hero-grid">
          <motion.div
            className="hero-copy"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.div className="eyebrow" variants={fadeUp}>
              <LuSparkles size={14} />
              {t("home.heroEyebrow")}
            </motion.div>

            <motion.h1 className="hero-title" variants={fadeUp}>
              {t("home.heroTitleLineOne")}
              <br />
              <span className="hero-gradient">{t("home.heroTitleHighlight")}</span>
            </motion.h1>

            <motion.p className="hero-body" variants={fadeUp}>
              {t("home.heroBody")}
            </motion.p>

            <motion.div className="claim-caption" variants={fadeUp}>
              {t("home.claimCaption")}
            </motion.div>

            <motion.form
              className="claim-form"
              onSubmit={handleSubmit}
              variants={fadeUp}
            >
              <label className="claim-field">
                <span className="claim-prefix">yotei.app/</span>
                <input
                  aria-label={t("home.claimInputAriaLabel")}
                  className="claim-input"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder={t("home.claimPlaceholder")}
                  autoComplete="off"
                  spellCheck={false}
                />
              </label>

              <button type="submit" className="claim-button">
                {t("home.claimButton")}
                <LuArrowRight size={17} />
              </button>
            </motion.form>

            <motion.div className="hero-trust" variants={fadeUp}>
              <span>
                <LuBadgeCheck size={14} />
                {t("home.trustFree")}
              </span>
              <span className="hero-trust-dot" aria-hidden />
              <span>{t("home.trustNoCard")}</span>
            </motion.div>

          </motion.div>

          <motion.div
            className="preview-wrap"
            initial={{ opacity: 0, y: 18, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.72, delay: 0.08, ease: EASE_OUT }}
            whileHover={
              shouldReduceMotion
                ? undefined
                : { y: -3, scale: 1.01 }
            }
          >
            <div className="orb-shell" aria-hidden>
              <div className="orb-scene" />
              <div className="orb-aura" />
              <div className="orb-ring orb-ring-one" />
              <div className="orb-ring orb-ring-two" />
              <div className="orb-ring orb-ring-three" />
              <div className="orb-axis orb-axis-a" />
              <div className="orb-axis orb-axis-b" />
              <div className="orb-core">
                <YoteiBrandMark
                  animated={false}
                  className="orb-core-mark"
                  intensity="calm"
                  size={112}
                />
              </div>

              {localizedIdentityChips.map((chip) => (
                <div
                  key={chip.label}
                  className={`identity-chip chip-${chip.key} chip-${chip.tone}`}
                >
                  {chip.label}
                </div>
              ))}
            </div>

            <div className="orb-copy">
              <strong>{t("home.orbTitle")}</strong>
              <span>{t("home.orbBody")}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="features-section">
        <div className="home-shell">
          <motion.div
            className="section-intro"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <div className="eyebrow">
              <LuSparkles size={14} />
              {t("home.featuresEyebrow")}
            </div>
            <h2>{t("home.featuresTitle")}</h2>
            <p>{t("home.featuresBody")}</p>
          </motion.div>

          <motion.div
            className="feature-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {localizedFeatureCards.map((card) => (
              <motion.div key={card.title} variants={fadeUp}>
                <FeatureCard {...card} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="support-panel"
            id="community"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
          >
            <div>
              <div className="eyebrow">
                <LuBadgeCheck size={14} />
                {t("home.supportEyebrow")}
              </div>
              <h3>{t("home.supportTitle")}</h3>
              <p>
                {t("home.supportBody")}{" "}
                <span id="support">{t("home.supportHighlight")}</span>
              </p>
            </div>

            <div className="support-actions">
              <Link href="/register" className="support-link primary">
                {t("home.startFree")}
                <LuArrowRight size={16} />
              </Link>
              <Link href="/pricing" className="support-link">
                {t("home.viewPricing")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
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
    <div className="feature-card">
      <div
        className="feature-icon"
        style={{
          color: accent,
          background: `${accent}14`,
          border: `1px solid ${accent}24`,
        }}
      >
        {icon}
      </div>
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
    "radial-gradient(circle at top, rgba(58, 24, 48, 0.36), transparent 20%), radial-gradient(circle at 18% 12%, rgba(104, 90, 255, 0.18), transparent 24%), radial-gradient(circle at 82% 14%, rgba(255, 110, 168, 0.14), transparent 20%), linear-gradient(180deg, #05050a 0%, #08060d 26%, #06070b 100%)",
};
