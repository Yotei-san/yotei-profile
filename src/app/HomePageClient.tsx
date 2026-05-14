"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { type CSSProperties, type FormEvent, type ReactNode, useState } from "react";
import {
  FaDiscord,
  FaGithub,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";
import {
  LuArrowRight,
  LuBadgeCheck,
  LuChartNoAxesCombined,
  LuLayoutTemplate,
  LuSparkles,
} from "react-icons/lu";

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

const navLinks = [
  { label: "Discord", href: "#community" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Help", href: "#support" },
  { label: "Pricing", href: "/pricing" },
] as const;

const profileBadges = [
  { label: "Owner", className: "badge-owner" },
  { label: "Premium", className: "badge-premium" },
  { label: "Online", className: "badge-online" },
] as const;

const socialLinks = [
  {
    label: "Discord",
    icon: <FaDiscord size={16} />,
    accent: "#8995FF",
  },
  {
    label: "X",
    icon: <FaXTwitter size={14} />,
    accent: "#8FD3FF",
  },
  {
    label: "GitHub",
    icon: <FaGithub size={16} />,
    accent: "#D0D8E8",
  },
  {
    label: "TikTok",
    icon: <FaTiktok size={15} />,
    accent: "#FF89BA",
  },
] as const;

const featureCards = [
  {
    title: "Animated profiles",
    body: "Create motion-rich pages that feel alive without turning into visual noise.",
    icon: <LuSparkles size={18} />,
    accent: "#8A7CFF",
  },
  {
    title: "Video banners",
    body: "Lead with cinematic headers that give your profile an instant premium mood.",
    icon: <LuLayoutTemplate size={18} />,
    accent: "#FF77B3",
  },
  {
    title: "Premium links",
    body: "Turn every destination into part of a polished identity system, not a plain list.",
    icon: <LuBadgeCheck size={18} />,
    accent: "#8EC5FF",
  },
  {
    title: "Smart analytics",
    body: "Understand what people click, what converts and what earns a second look.",
    icon: <LuChartNoAxesCombined size={18} />,
    accent: "#B58CFF",
  },
] as const;

export default function HomePageClient() {
  const [username, setUsername] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

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
    <main style={pageStyle}>
      <style>{`
        .home-shell {
          width: min(1180px, calc(100% - 32px));
          max-width: 1180px;
          margin: 0 auto;
        }

        .page-orb-a,
        .page-orb-b,
        .page-grid,
        .page-vignette {
          position: absolute;
          pointer-events: none;
        }

        .page-orb-a {
          top: -180px;
          left: -120px;
          width: 520px;
          height: 520px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(123, 108, 255, 0.26) 0%, rgba(123, 108, 255, 0) 72%);
          filter: blur(18px);
        }

        .page-orb-b {
          right: -140px;
          top: 90px;
          width: 500px;
          height: 500px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255, 110, 168, 0.18) 0%, rgba(255, 110, 168, 0) 72%);
          filter: blur(22px);
        }

        .page-grid {
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.028) 1px, transparent 1px);
          background-size: 80px 80px;
          opacity: 0.18;
          mask-image: linear-gradient(180deg, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.18));
        }

        .page-vignette {
          inset: 0;
          background:
            radial-gradient(circle at top, rgba(68, 28, 48, 0.18), transparent 20%),
            linear-gradient(180deg, rgba(5, 5, 10, 0) 0%, rgba(5, 5, 10, 0.32) 100%);
        }

        .home-header {
          position: relative;
          z-index: 10;
          padding: 24px 0 0;
        }

        .nav-shell {
          display: grid;
          gap: 12px;
        }

        .home-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 16px 18px;
          border-radius: 999px;
          background: rgba(16, 11, 20, 0.84);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(16px);
          min-width: 0;
        }

        .brand-link,
        .nav-link,
        .nav-mobile-link,
        .nav-cta,
        .nav-mobile-toggle,
        .claim-button,
        .support-link {
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

        .brand-mark {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 17px;
          font-weight: 900;
          background:
            radial-gradient(circle at 28% 24%, rgba(255, 255, 255, 0.38), transparent 24%),
            linear-gradient(145deg, #8a76ff 0%, #ff6ea8 54%, #5aa9ff 100%);
          box-shadow: 0 16px 32px rgba(110, 93, 255, 0.28);
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
          display: none;
          padding: 14px;
          border-radius: 26px;
          background:
            linear-gradient(180deg, rgba(17, 13, 24, 0.96), rgba(10, 9, 16, 0.98)),
            rgba(15, 11, 22, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.24);
          backdrop-filter: blur(16px);
          overflow: hidden;
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
          background: linear-gradient(135deg, rgba(124, 108, 255, 0.96), rgba(255, 110, 168, 0.92));
          box-shadow: 0 14px 28px rgba(117, 95, 255, 0.26);
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

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 38px;
          padding: 0 14px;
          border-radius: 999px;
          color: #ffd4e8;
          background: rgba(255, 110, 168, 0.1);
          border: 1px solid rgba(255, 110, 168, 0.16);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .hero-title {
          margin: 24px 0 0;
          max-width: 720px;
          font-size: clamp(56px, 8vw, 96px);
          line-height: 0.92;
          letter-spacing: -0.08em;
          font-weight: 950;
          text-wrap: balance;
        }

        .hero-gradient {
          background: linear-gradient(90deg, #ffffff 0%, #ddd4ff 30%, #95b6ff 62%, #ff8fc3 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .hero-body {
          margin: 24px 0 0;
          max-width: 620px;
          color: #c5cde0;
          font-size: 18px;
          line-height: 1.75;
          text-wrap: pretty;
        }

        .claim-form {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 12px;
          margin-top: 30px;
          max-width: 660px;
          padding: 12px;
          border-radius: 28px;
          background: rgba(15, 11, 22, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 28px 46px rgba(0, 0, 0, 0.24);
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
          background: rgba(255, 255, 255, 0.04);
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
          background: linear-gradient(135deg, rgba(124, 108, 255, 0.98), rgba(255, 110, 168, 0.94));
          box-shadow: 0 18px 34px rgba(110, 92, 255, 0.3);
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
          perspective: 1600px;
          min-width: 0;
          width: 100%;
        }

        .preview-shell {
          position: relative;
          padding: 22px;
          border-radius: 40px;
          background:
            radial-gradient(circle at top, rgba(124, 108, 255, 0.12), transparent 26%),
            linear-gradient(180deg, rgba(16, 11, 21, 0.98), rgba(8, 8, 14, 1));
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 36px 72px rgba(0, 0, 0, 0.34);
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
        }

        .preview-shell::after {
          content: "";
          position: absolute;
          inset: 12px;
          border-radius: 30px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          pointer-events: none;
        }

        .preview-stage {
          position: relative;
          z-index: 1;
          border-radius: 30px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: linear-gradient(180deg, rgba(11, 12, 20, 0.96), rgba(7, 8, 14, 1));
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.04),
            0 24px 40px rgba(0, 0, 0, 0.22);
          min-width: 0;
        }

        .preview-topbar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 255, 255, 0.02);
        }

        .preview-dots {
          display: flex;
          gap: 6px;
        }

        .preview-dots span {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.18);
        }

        .preview-url {
          min-height: 32px;
          padding: 0 12px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          color: #a6b0c6;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.01em;
          min-width: 0;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .profile-preview {
          position: relative;
          background: linear-gradient(180deg, rgba(11, 12, 20, 0.98), rgba(7, 8, 14, 1));
        }

        .profile-banner {
          position: relative;
          min-height: 270px;
          padding: 24px;
          overflow: hidden;
          background:
            radial-gradient(circle at 18% 26%, rgba(127, 111, 255, 0.26), transparent 24%),
            radial-gradient(circle at 82% 18%, rgba(255, 110, 168, 0.18), transparent 22%),
            linear-gradient(155deg, #1b1120 0%, #11131d 50%, #0a0d15 100%);
        }

        .profile-banner::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(120deg, rgba(255, 255, 255, 0.08), transparent 22%),
            linear-gradient(180deg, rgba(8, 10, 18, 0.02) 0%, rgba(8, 10, 18, 0.56) 100%);
          pointer-events: none;
        }

        .banner-chip {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 34px;
          padding: 0 14px;
          border-radius: 999px;
          color: #dce4f5;
          background: rgba(8, 11, 18, 0.42);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(14px);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .banner-chip i,
        .status-pill i {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #45d483;
          box-shadow: 0 0 0 4px rgba(69, 212, 131, 0.12);
          display: inline-block;
          flex-shrink: 0;
        }

        .banner-copy {
          position: relative;
          z-index: 1;
          margin-top: 126px;
          max-width: 320px;
        }

        .banner-copy strong {
          display: block;
          font-size: 32px;
          line-height: 0.92;
          letter-spacing: -0.06em;
        }

        .banner-copy span {
          display: block;
          margin-top: 10px;
          color: #a8b4ce;
          font-size: 13px;
          line-height: 1.65;
        }

        .banner-wordmark {
          position: absolute;
          right: 24px;
          bottom: 20px;
          font-size: clamp(76px, 9vw, 108px);
          line-height: 0.8;
          font-weight: 950;
          letter-spacing: -0.08em;
          color: rgba(255, 255, 255, 0.08);
          pointer-events: none;
          user-select: none;
        }

        .profile-body {
          padding: 0 28px 28px;
          margin-top: -66px;
          min-width: 0;
        }

        .profile-card {
          position: relative;
          padding: 0 24px 24px;
          border-radius: 28px;
          background: linear-gradient(180deg, rgba(11, 13, 21, 0.96), rgba(8, 9, 16, 0.98));
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 24px 34px rgba(0, 0, 0, 0.18);
          min-width: 0;
        }

        .avatar-shell {
          position: relative;
          width: 118px;
          height: 118px;
          margin-top: -36px;
        }

        .avatar-ring {
          position: absolute;
          inset: -8px;
          border-radius: 999px;
          border: 1px solid rgba(145, 162, 255, 0.34);
          box-shadow:
            0 0 0 8px rgba(8, 10, 17, 0.92),
            0 0 30px rgba(112, 128, 255, 0.12);
        }

        .avatar-core {
          position: relative;
          width: 118px;
          height: 118px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background:
            radial-gradient(circle at 28% 22%, rgba(255, 255, 255, 0.36), transparent 18%),
            linear-gradient(145deg, #ff6ea8 0%, #7a6dff 56%, #57a7ff 100%);
          box-shadow: 0 20px 34px rgba(95, 86, 255, 0.2);
        }

        .avatar-core::after {
          content: "";
          position: absolute;
          inset: 10px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.14);
        }

        .avatar-core strong {
          position: relative;
          z-index: 1;
          color: #ffffff;
          font-size: 40px;
          font-weight: 950;
          letter-spacing: -0.05em;
          text-shadow: 0 10px 24px rgba(13, 18, 34, 0.34);
        }

        .profile-name {
          margin: 18px 0 0;
          font-size: clamp(34px, 4vw, 42px);
          line-height: 0.92;
          letter-spacing: -0.06em;
        }

        .profile-username {
          margin-top: 10px;
          color: #90a0bc;
          font-size: 14px;
          font-weight: 700;
        }

        .badge-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 16px;
        }

        .profile-badge {
          min-height: 30px;
          padding: 0 11px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.03em;
        }

        .badge-owner {
          color: #f5d89c;
          background: rgba(245, 216, 156, 0.12);
          border-color: rgba(245, 216, 156, 0.18);
        }

        .badge-owner::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #f5d89c;
          box-shadow: 0 0 0 4px rgba(245, 216, 156, 0.12);
          display: inline-block;
          flex-shrink: 0;
        }

        .badge-premium {
          color: #ffacd0;
          background: rgba(255, 110, 168, 0.12);
          border-color: rgba(255, 110, 168, 0.18);
        }

        .badge-premium::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #ff89ba;
          box-shadow: 0 0 0 4px rgba(255, 137, 186, 0.12);
          display: inline-block;
          flex-shrink: 0;
        }

        .badge-online {
          color: #99e6b8;
          background: rgba(69, 212, 131, 0.12);
          border-color: rgba(69, 212, 131, 0.18);
        }

        .badge-online::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #45d483;
          box-shadow: 0 0 0 4px rgba(69, 212, 131, 0.12);
          display: inline-block;
          flex-shrink: 0;
        }

        .profile-bio {
          margin: 18px 0 0;
          max-width: 460px;
          color: #bec8dc;
          font-size: 14px;
          line-height: 1.75;
          text-wrap: pretty;
        }

        .social-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 20px;
        }

        .social-chip {
          width: 44px;
          height: 44px;
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);
        }

        .social-chip span {
          width: 36px;
          height: 36px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .profile-links {
          display: grid;
          gap: 10px;
          margin-top: 22px;
          min-width: 0;
        }

        .profile-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          min-width: 0;
        }

        .profile-link strong {
          display: block;
          font-size: 14px;
          letter-spacing: -0.02em;
          overflow-wrap: anywhere;
        }

        .profile-link span {
          display: block;
          margin-top: 5px;
          color: #8e9ab6;
          font-size: 12px;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        .profile-link-mark {
          width: 38px;
          height: 38px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          background: linear-gradient(135deg, rgba(124, 108, 255, 0.24), rgba(255, 110, 168, 0.24));
          border: 1px solid rgba(255, 255, 255, 0.08);
          flex-shrink: 0;
          font-size: 14px;
          font-weight: 800;
        }

        .status-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .status-pill {
          min-height: 34px;
          padding: 0 12px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #dfe7f6;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
          font-size: 12px;
          font-weight: 800;
        }

        .status-copy {
          color: #93a0bb;
          font-size: 12px;
          font-weight: 700;
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
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
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
          box-shadow: 0 26px 48px rgba(0, 0, 0, 0.2);
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

          .hero-body,
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

          .preview-shell,
          .preview-stage {
            border-radius: 24px;
          }

          .preview-shell {
            padding: 12px;
            box-shadow: 0 24px 48px rgba(0, 0, 0, 0.28);
          }

          .preview-shell::after {
            inset: 8px;
            border-radius: 20px;
          }

          .preview-topbar {
            padding: 12px 12px;
            gap: 10px;
          }

          .preview-url {
            font-size: 11px;
            min-height: 28px;
            padding: 0 10px;
          }

          .profile-banner {
            min-height: 196px;
            padding: 16px;
          }

          .banner-copy {
            margin-top: 88px;
            max-width: 178px;
          }

          .banner-copy strong {
            font-size: 21px;
          }

          .banner-wordmark {
            right: 12px;
            bottom: 8px;
            font-size: 48px;
          }

          .profile-body {
            padding: 0 12px 14px;
            margin-top: -42px;
          }

          .profile-card {
            padding: 0 14px 14px;
            border-radius: 20px;
          }

          .avatar-shell,
          .avatar-core {
            width: 84px;
            height: 84px;
          }

          .avatar-core strong {
            font-size: 28px;
          }

          .profile-name {
            font-size: 26px;
            margin-top: 14px;
          }

          .profile-username {
            margin-top: 8px;
            font-size: 13px;
          }

          .profile-bio {
            margin-top: 14px;
            font-size: 13px;
            line-height: 1.65;
          }

          .social-row {
            margin-top: 16px;
            gap: 8px;
          }

          .social-chip {
            width: 40px;
            height: 40px;
            border-radius: 14px;
          }

          .social-chip span {
            width: 32px;
            height: 32px;
            border-radius: 11px;
          }

          .profile-links {
            margin-top: 18px;
          }

          .profile-link {
            padding: 12px 12px;
            border-radius: 16px;
          }

          .profile-link-mark {
            width: 34px;
            height: 34px;
            border-radius: 12px;
            font-size: 13px;
          }

          .status-row {
            margin-top: 16px;
            gap: 10px;
          }

          .feature-card,
          .support-panel {
            padding: 20px;
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

          .brand-mark {
            width: 38px;
            height: 38px;
            border-radius: 12px;
            font-size: 16px;
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

          .hero-body {
            margin-top: 18px;
          }
        }

        @media (max-width: 390px) {
          .brand-copy span {
            display: none;
          }

          .hero-title {
            font-size: clamp(34px, 11vw, 46px);
          }

          .claim-field {
            padding: 0 14px;
            gap: 10px;
          }

          .banner-copy {
            max-width: 156px;
          }

          .banner-wordmark {
            font-size: 42px;
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

          .profile-banner {
            min-height: 182px;
          }

          .banner-copy {
            margin-top: 82px;
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

          .preview-shell {
            padding: 10px;
          }

          .profile-card {
            padding: 0 12px 12px;
          }
        }
      `}</style>

      <div className="page-orb-a" />
      <div className="page-orb-b" />
      <div className="page-grid" />
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
                <div className="brand-mark">Y</div>
                <div className="brand-copy">
                  <strong>Yotei</strong>
                  <span>Premium digital identity</span>
                </div>
              </Link>

              <nav className="nav-center" aria-label="Main navigation">
                {navLinks.map((item) => (
                  <Link key={item.label} href={item.href} className="nav-link">
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="nav-actions">
                <Link href="/login" className="nav-ghost">
                  Login
                </Link>
                <Link href="/register" className="nav-cta">
                  Sign Up
                </Link>
              </div>

              <button
                type="button"
                className={`nav-mobile-toggle${isMobileMenuOpen ? " is-open" : ""}`}
                aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen((current) => !current)}
              >
                <i />
              </button>
            </motion.div>

            {isMobileMenuOpen ? (
              <motion.div
                className="nav-mobile-panel"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.18,
                  ease: EASE_OUT,
                }}
              >
                <nav className="nav-mobile-links" aria-label="Mobile navigation">
                  {navLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="nav-mobile-link"
                      onClick={() => setIsMobileMenuOpen(false)}
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
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="nav-cta"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              </motion.div>
            ) : null}
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
              Premium profile platform for creators, gamers and devs
            </motion.div>

            <motion.h1 className="hero-title" variants={fadeUp}>
              Your Digital Identity,
              <br />
              <span className="hero-gradient">On Your Terms</span>
            </motion.h1>

            <motion.p className="hero-body" variants={fadeUp}>
              Create a premium profile that brings your links, identity, visuals and
              social presence into one beautiful page.
            </motion.p>

            <motion.form
              className="claim-form"
              onSubmit={handleSubmit}
              variants={fadeUp}
            >
              <label className="claim-field">
                <span className="claim-prefix">yotei.app/</span>
                <input
                  aria-label="Claim username"
                  className="claim-input"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="username"
                  autoComplete="off"
                  spellCheck={false}
                />
              </label>

              <button type="submit" className="claim-button">
                Claim Username
                <LuArrowRight size={17} />
              </button>
            </motion.form>

            <motion.div className="hero-trust" variants={fadeUp}>
              <span>
                <LuBadgeCheck size={14} />
                100% free to get started
              </span>
              <span className="hero-trust-dot" aria-hidden />
              <span>No credit card required</span>
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
                : { y: -4, rotateX: 1.5, rotateY: -2.5 }
            }
          >
            <div className="preview-shell">
              <motion.div
                aria-hidden
                animate={
                  shouldReduceMotion
                    ? undefined
                    : { opacity: [0.3, 0.42, 0.3], scale: [1, 1.02, 1] }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : { duration: 7, repeat: Infinity, ease: "easeInOut" }
                }
                style={previewGlowStyle}
              />

              <div className="preview-stage">
                <div className="preview-topbar">
                  <div className="preview-dots" aria-hidden>
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="preview-url">yotei.app/yotei-san</div>
                </div>

                <div className="profile-preview">
                  <div className="profile-banner">
                    <div className="banner-chip">
                      <i />
                      Live profile
                    </div>

                    <div className="banner-copy">
                      <strong>Yotei</strong>
                      <span>
                        Premium identity for links, drops, socials and a stronger first
                        impression.
                      </span>
                    </div>

                    <div className="banner-wordmark" aria-hidden>
                      Y
                    </div>
                  </div>

                  <div className="profile-body">
                    <div className="profile-card">
                      <motion.div
                        className="avatar-shell"
                        animate={shouldReduceMotion ? undefined : { y: [0, -2, 0] }}
                        transition={
                          shouldReduceMotion
                            ? undefined
                            : {
                                duration: 5.4,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }
                        }
                      >
                        <div className="avatar-ring" />
                        <div className="avatar-core">
                          <strong>Y</strong>
                        </div>
                      </motion.div>

                      <h2 className="profile-name">Yotei</h2>
                      <div className="profile-username">@yotei-san</div>

                      <div className="badge-row">
                        {profileBadges.map((badge) => (
                          <span
                            key={badge.label}
                            className={`profile-badge ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        ))}
                      </div>

                      <p className="profile-bio">
                        Building profile pages with stronger aesthetics, sharper identity
                        and clean social presence.
                      </p>

                      <div className="social-row">
                        {socialLinks.map((social) => (
                          <motion.div
                            key={social.label}
                            className="social-chip"
                            whileHover={shouldReduceMotion ? undefined : { y: -3 }}
                            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                            aria-label={social.label}
                            title={social.label}
                          >
                            <span
                              style={{
                                color: social.accent,
                                background: `${social.accent}14`,
                              }}
                            >
                              {social.icon}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      <div className="profile-links">
                        <div className="profile-link">
                          <div>
                            <strong>Featured drop</strong>
                            <span>Launches, content and creator updates in one place.</span>
                          </div>
                          <div className="profile-link-mark">01</div>
                        </div>

                        <div className="profile-link">
                          <div>
                            <strong>Community hub</strong>
                            <span>One premium page for Discord, socials and signature links.</span>
                          </div>
                          <div className="profile-link-mark">02</div>
                        </div>
                      </div>

                      <div className="status-row">
                        <div className="status-pill">
                          <i />
                          Online
                        </div>
                        <div className="status-copy">Clean, premium and ready to share.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
              Built for standout online presence
            </div>
            <h2>Everything your profile needs, without the clutter.</h2>
            <p>
              Yotei is made for people who want one beautiful destination for their
              identity, content and community.
            </p>
          </motion.div>

          <motion.div
            className="feature-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {featureCards.map((card) => (
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
                Community, help and pricing
              </div>
              <h3>Launch fast, learn fast and keep the page feeling premium.</h3>
              <p>
                Join the Discord community, study the leaderboard and explore pricing
                when you are ready. <span id="support">Yotei keeps the path simple from
                first claim to public profile.</span>
              </p>
            </div>

            <div className="support-actions">
              <Link href="/register" className="support-link primary">
                Start Free
                <LuArrowRight size={16} />
              </Link>
              <Link href="/pricing" className="support-link">
                View Pricing
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
    "radial-gradient(circle at top, rgba(46, 20, 38, 0.34), transparent 22%), radial-gradient(circle at 84% 16%, rgba(124, 108, 255, 0.12), transparent 18%), linear-gradient(180deg, #07060B 0%, #09060D 22%, #06070B 100%)",
};

const previewGlowStyle: CSSProperties = {
  position: "absolute",
  inset: "-24px",
  background:
    "radial-gradient(circle at 18% 18%, rgba(124, 108, 255, 0.28), transparent 32%), radial-gradient(circle at 84% 20%, rgba(255, 110, 168, 0.16), transparent 28%)",
  pointerEvents: "none",
};
