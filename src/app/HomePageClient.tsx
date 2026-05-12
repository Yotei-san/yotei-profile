"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import {
  FaDiscord,
  FaGithub,
  FaInstagram,
  FaMedal,
  FaRegStar,
  FaXTwitter,
} from "react-icons/fa6";
import {
  LuArrowRight,
  LuBadgeCheck,
  LuChartNoAxesCombined,
  LuLayoutTemplate,
  LuPalette,
  LuSparkles,
  LuZap,
} from "react-icons/lu";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN_OUT = [0.4, 0, 0.2, 1] as const;

const revealContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: EASE_OUT,
    },
  },
};

const platformLinks = [
  {
    label: "Discord",
    handle: "discord.gg/yotei",
    accent: "#5B6CFF",
    icon: <FaDiscord size={18} />,
    meta: "community hub",
  },
  {
    label: "Instagram",
    handle: "@yotei.profile",
    accent: "#FF5A8B",
    icon: <FaInstagram size={18} />,
    meta: "visual identity",
  },
  {
    label: "GitHub",
    handle: "github.com/yotei",
    accent: "#B8C3D9",
    icon: <FaGithub size={18} />,
    meta: "projects and builds",
  },
  {
    label: "X",
    handle: "@yoteiprofile",
    accent: "#66B6FF",
    icon: <FaXTwitter size={16} />,
    meta: "launch updates",
  },
] as const;

const featureCards = [
  {
    title: "Profile presence",
    text: "Banner, avatar, badges and status combine into a profile that looks curated from the first glance.",
    accent: "#7C6BFF",
    icon: <LuLayoutTemplate size={22} />,
  },
  {
    title: "Premium link stack",
    text: "Each platform card feels like part of the brand instead of a plain list of generic buttons.",
    accent: "#FF5A8B",
    icon: <LuZap size={22} />,
  },
  {
    title: "Visual control",
    text: "Strong colors, glow accents and composition options create a rare gamer SaaS identity without noise.",
    accent: "#45D483",
    icon: <LuPalette size={22} />,
  },
  {
    title: "Growth ready",
    text: "The layout already communicates value for reactions, analytics and premium plans later on.",
    accent: "#5AB2FF",
    icon: <LuChartNoAxesCombined size={22} />,
  },
] as const;

const featureChecks = [
  "Premium first-screen impact",
  "Real platform icon treatment",
  "Responsive dark SaaS layout",
  "Lightweight motion only where it matters",
] as const;

export default function HomePageClient() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main style={pageStyle}>
      <style>{`
        .yotei-shell {
          width: min(1240px, calc(100% - 32px));
          margin: 0 auto;
        }

        .yotei-header {
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(6, 8, 14, 0.82);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .yotei-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.06fr) minmax(420px, 0.94fr);
          gap: 34px;
          align-items: center;
        }

        .yotei-stat-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .yotei-feature-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .yotei-bottom-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          gap: 20px;
        }

        .hover-lift,
        .nav-chip,
        .cta-main,
        .cta-secondary,
        .mock-link-card {
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease,
            color 180ms ease;
        }

        .hover-lift:hover,
        .cta-main:hover,
        .cta-secondary:hover,
        .nav-chip:hover,
        .mock-link-card:hover {
          transform: translateY(-3px);
        }

        .cta-main:hover,
        .cta-secondary:hover,
        .nav-chip:hover {
          box-shadow: 0 18px 36px rgba(86, 100, 255, 0.16);
        }

        .cta-main:hover {
          transform: translateY(-3px) scale(1.015);
        }

        .cta-secondary:hover,
        .nav-chip:hover {
          transform: translateY(-2px) scale(1.01);
        }

        .cta-main:active,
        .cta-secondary:active,
        .nav-chip:active,
        .mock-link-card:active {
          transform: translateY(0) scale(0.985);
        }

        .mockup-identity-row {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 18px;
          align-items: start;
        }

        .mockup-badge-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 14px;
        }

        .mockup-link-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .hero-gradient {
          background: linear-gradient(90deg, #ffffff 0%, #cdd8ff 28%, #88a9ff 58%, #ff77b7 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .yotei-cinematic-light {
          position: absolute;
          inset: -12%;
          background:
            radial-gradient(circle at 18% 22%, rgba(95, 118, 255, 0.24), transparent 24%),
            radial-gradient(circle at 78% 16%, rgba(255, 95, 155, 0.18), transparent 20%),
            radial-gradient(circle at 52% 58%, rgba(76, 156, 255, 0.10), transparent 26%);
          background-size: 140% 140%;
          animation: yotei-light-shift 24s ease-in-out infinite;
          opacity: 0.9;
          pointer-events: none;
        }

        .yotei-grid-noise {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: linear-gradient(180deg, rgba(0,0,0,1), rgba(0,0,0,0.2));
          pointer-events: none;
          opacity: 0.26;
        }

        .yotei-film-noise {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.06;
          background-image: radial-gradient(rgba(255,255,255,0.8) 0.6px, transparent 0.6px);
          background-size: 7px 7px;
          mix-blend-mode: soft-light;
        }

        .yotei-panel-noise {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.08;
          background-image:
            radial-gradient(rgba(255,255,255,0.7) 0.7px, transparent 0.7px),
            linear-gradient(180deg, rgba(255,255,255,0.05), transparent 35%);
          background-size: 9px 9px, 100% 100%;
        }

        @keyframes yotei-light-shift {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-2%, 2%, 0) scale(1.03); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }

        @media (max-width: 1080px) {
          .yotei-hero-grid,
          .yotei-bottom-grid {
            grid-template-columns: 1fr;
          }

          .yotei-feature-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .yotei-shell {
            width: min(100% - 24px, 1240px);
          }

          .yotei-stat-row,
          .yotei-feature-grid {
            grid-template-columns: 1fr;
          }

          .mockup-link-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .mockup-identity-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="yotei-cinematic-light" />
      <div className="yotei-grid-noise" />
      <div className="yotei-film-noise" />
      <motion.div
        aria-hidden
        animate={
          shouldReduceMotion ? undefined : { x: [0, 10, 0], y: [0, 14, 0] }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 18, repeat: Infinity, ease: EASE_IN_OUT }
        }
        style={orbStyle({
          width: "420px",
          height: "420px",
          top: "-120px",
          left: "-120px",
          background:
            "radial-gradient(circle, rgba(98, 114, 255, 0.26) 0%, rgba(98, 114, 255, 0) 68%)",
        })}
      />
      <motion.div
        aria-hidden
        animate={
          shouldReduceMotion ? undefined : { x: [0, -12, 0], y: [0, -8, 0] }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 22, repeat: Infinity, ease: EASE_IN_OUT }
        }
        style={orbStyle({
          width: "360px",
          height: "360px",
          top: "160px",
          right: "-100px",
          background:
            "radial-gradient(circle, rgba(255, 98, 163, 0.22) 0%, rgba(255, 98, 163, 0) 70%)",
        })}
      />

      <header className="yotei-header">
        <div
          className="yotei-shell"
          style={{
            minHeight: "78px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div style={logoBadgeStyle}>
              <span style={{ position: "relative", zIndex: 1 }}>Y</span>
            </div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "-0.04em" }}>
                Yotei Profile
              </div>
              <div style={{ color: "#8E9AB4", fontSize: "12px" }}>
                Premium identity layer
              </div>
            </div>
          </motion.div>

          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <Link href="/login" className="nav-chip" style={navGhostStyle}>
              Login
            </Link>
            <Link href="/register" className="cta-main" style={navPrimaryStyle}>
              Criar conta
            </Link>
          </motion.nav>
        </div>
      </header>

      <section style={{ position: "relative", padding: "56px 0 32px" }}>
        <div className="yotei-shell yotei-hero-grid">
          <motion.div
            variants={revealContainer}
            initial="hidden"
            animate="show"
            style={{ position: "relative", zIndex: 1 }}
          >
            <motion.div variants={fadeUp} style={eyebrowStyle("#7C6BFF")}>
              <LuSparkles size={14} />
              Landing premium para o Yotei
            </motion.div>

            <motion.h1 variants={fadeUp} style={heroTitleStyle}>
              A homepage que faz o
              <br />
              <span className="hero-gradient">Yotei parecer grande</span>
              <br />
              no primeiro scroll.
            </motion.h1>

            <motion.p variants={fadeUp} style={heroBodyStyle}>
              Uma identidade dark, viva e moderna para apresentar perfis com cara de produto premium.
              Gamer na atitude, SaaS no acabamento, sem pesar a experiencia.
            </motion.p>

            <motion.div
              variants={fadeUp}
              style={{
                display: "flex",
                gap: "14px",
                flexWrap: "wrap",
                marginTop: "28px",
              }}
            >
              <Link href="/register" className="cta-main" style={ctaMainStyle}>
                Criar meu perfil
                <LuArrowRight size={18} />
              </Link>
              <a href="#showcase" className="cta-secondary" style={ctaSecondaryStyle}>
                Ver preview
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "24px",
              }}
            >
              {featureChecks.map((item) => (
                <span key={item} style={microChipStyle}>
                  <LuBadgeCheck size={14} />
                  {item}
                </span>
              ))}
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="yotei-stat-row"
              style={{ marginTop: "30px" }}
            >
              <MetricCard value="01" label="hero com identidade forte" />
              <MetricCard value="04" label="plataformas com icones reais" />
              <MetricCard value="100%" label="responsivo para Vercel" />
            </motion.div>
          </motion.div>

          <motion.div
            id="showcase"
            initial={{ opacity: 0, y: 22, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE_OUT }}
          >
            <div style={mockupFrameStyle}>
              <div style={mockupInnerFrameStyle} />
              <div className="yotei-panel-noise" />
              <motion.div
                aria-hidden
                animate={
                  shouldReduceMotion
                    ? undefined
                    : { opacity: [0.26, 0.4, 0.26], scale: [1, 1.015, 1] }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : { duration: 6, repeat: Infinity, ease: EASE_IN_OUT }
                }
                style={mockupGlowStyle}
              />

              <div className="mockup-browser-bar" style={browserBarStyle}>
                <div style={{ display: "flex", gap: "7px" }}>
                  <span style={browserDotStyle("#FF6C8A")} />
                  <span style={browserDotStyle("#FFC857")} />
                  <span style={browserDotStyle("#50D890")} />
                </div>
                <div style={browserUrlStyle}>yotei.app/yotei</div>
                <div style={liveBadgeStyle}>
                  <span style={liveDotStyle} />
                  Live
                </div>
              </div>

              <div style={profilePanelStyle}>
                <div style={profilePanelEdgeStyle} />
                <div className="yotei-panel-noise" />
                <div style={bannerStyle}>
                  <div style={bannerDepthLayerStyle} />
                  <div style={bannerGridStyle} />
                  <div style={bannerAccentStyle} />
                  <div style={bannerAccentSecondaryStyle} />

                  <div style={bannerTopRowStyle}>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <span style={panelChipStyle("rgba(10, 19, 37, 0.78)", "#8FB0FF")}>
                        Season 04
                      </span>
                      <span style={panelChipStyle("rgba(31, 18, 34, 0.78)", "#FF9FC6")}>
                        Creator profile
                      </span>
                    </div>
                    <div style={presenceIndicatorStyle}>
                      <span style={presenceDotStyle} />
                      online now
                    </div>
                  </div>

                  <div style={bannerContentStyle}>
                    <div style={bannerMessageCardStyle}>
                      <div style={bannerMessageEyebrowStyle}>Featured launch</div>
                      <div style={bannerMessageTitleStyle}>
                        Neon identity, premium badges and a live social stack.
                      </div>
                      <div style={bannerMessageBodyStyle}>
                        A profile mockup that feels active, curated and ready for clicks.
                      </div>
                    </div>

                    <div style={bannerStatsRowStyle}>
                      <div style={bannerStatCardStyle}>
                        <strong>24.8k</strong>
                        <span>monthly views</span>
                      </div>
                      <div style={bannerStatCardStyle}>
                        <strong>4</strong>
                        <span>live platforms</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={profileBodyStyle}>
                  <div className="mockup-identity-row" style={identityRowStyle}>
                    <motion.div
                      style={avatarShellStyle}
                      animate={shouldReduceMotion ? undefined : { y: [0, -2, 0] }}
                      transition={
                        shouldReduceMotion
                          ? undefined
                          : { duration: 5.6, repeat: Infinity, ease: EASE_IN_OUT }
                      }
                      >
                        <motion.div
                          style={avatarGlowRingStyle}
                        animate={
                          shouldReduceMotion
                            ? undefined
                            : { scale: [1, 1.04, 1], opacity: [0.9, 1, 0.9] }
                        }
                        transition={
                          shouldReduceMotion
                            ? undefined
                            : { duration: 4.8, repeat: Infinity, ease: EASE_IN_OUT }
                        }
                      />
                      <div style={avatarAuraStyle} />
                      <motion.div
                        style={avatarCoreStyle}
                        animate={
                          shouldReduceMotion
                            ? undefined
                            : {
                                boxShadow: [
                                  "0 22px 40px rgba(94, 88, 255, 0.22)",
                                  "0 26px 48px rgba(94, 88, 255, 0.30)",
                                  "0 22px 40px rgba(94, 88, 255, 0.22)",
                                ],
                              }
                        }
                        transition={
                          shouldReduceMotion
                            ? undefined
                            : { duration: 4.8, repeat: Infinity, ease: EASE_IN_OUT }
                        }
                      >
                        <div style={avatarShineStyle} />
                        <span style={avatarLetterStyle}>Y</span>
                      </motion.div>
                    </motion.div>

                    <div style={profileIntroStyle}>
                      <div style={profileNameRowStyle}>
                        <div>
                          <h2 style={profileNameStyle}>Yotei</h2>
                          <div style={profileHandleRowStyle}>
                            <span>@yotei.profile</span>
                            <span style={liveProfileChipStyle}>
                              <span style={liveProfileDotStyle} />
                              live right now
                            </span>
                          </div>
                        </div>
                        <div style={profileFeaturedPillStyle}>
                          <FaRegStar size={12} />
                          featured profile
                        </div>
                      </div>

                      <p style={profileBioStyle}>
                        Built for creators, indie launches and gamer brands that want a profile page with
                        real presence instead of a plain list of links.
                      </p>

                      <div className="mockup-badge-row">
                        <span style={verifiedChipStyle}>
                          <LuBadgeCheck size={13} />
                          verified
                        </span>
                        <span style={premiumChipStyle}>
                          <FaMedal size={12} />
                          premium
                        </span>
                        <span style={featuredChipStyle}>
                          <FaRegStar size={12} />
                          featured
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mockup-link-grid" style={profileLinksGridStyle}>
                    {platformLinks.map((item, index) => (
                      <motion.button
                        key={item.label}
                        type="button"
                        className="mock-link-card"
                        initial={{ opacity: 0, y: 10 }}
                        animate="rest"
                        whileHover={shouldReduceMotion ? undefined : "hover"}
                        whileTap="press"
                        variants={linkCardVariants(item.accent)}
                        transition={{ delay: 0.16 + index * 0.06, duration: 0.36 }}
                        style={platformButtonStyle(item.accent)}
                      >
                        <motion.div
                          variants={linkIconVariants(item.accent)}
                          style={platformIconWrapStyle(item.accent)}
                        >
                          {item.icon}
                        </motion.div>

                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "12px",
                              flexWrap: "wrap",
                            }}
                          >
                            <strong style={{ fontSize: "15px", letterSpacing: "-0.02em" }}>
                              {item.label}
                            </strong>
                            <span style={platformMetaStyle(item.accent)}>{item.meta}</span>
                          </div>
                          <div style={platformHandleStyle}>{item.handle}</div>
                        </div>

                        <motion.div variants={linkArrowVariants} style={platformArrowStyle}>
                          <LuArrowRight size={16} />
                        </motion.div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: "24px 0 36px" }}>
        <div className="yotei-shell">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center", marginBottom: "24px" }}
          >
            <div style={eyebrowStyle("#5AB2FF")}>
              <LuSparkles size={14} />
              O que melhora na homepage
            </div>
            <h2 style={sectionTitleStyle}>
              Visual premium, sem parecer template.
            </h2>
            <p style={sectionBodyStyle}>
              O layout posiciona o Yotei como produto serio e desejavel logo no topo, com uma linguagem
              escura, nitida e orientada a conversao.
            </p>
          </motion.div>

          <motion.div
            className="yotei-feature-grid"
            variants={revealContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.18 }}
          >
            {featureCards.map((card) => (
              <motion.div key={card.title} variants={fadeUp}>
                <FeatureCard {...card} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section style={{ padding: "8px 0 44px" }}>
        <div className="yotei-shell yotei-bottom-grid">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.52 }}
            style={secondaryPanelStyle}
            className="hover-lift"
          >
            <div style={eyebrowStyle("#FF5A8B")}>
              <LuSparkles size={14} />
              Primeira impressao que converte
            </div>
            <h3 style={{ margin: "18px 0 0", fontSize: "40px", lineHeight: 1, letterSpacing: "-0.05em" }}>
              Hero com mais valor percebido.
            </h3>
            <p style={panelTextStyle}>
              A combinacao de headline forte, mockup crivel e microdetalhes premium deixa claro que o
              Yotei nao e so mais uma link page.
            </p>

            <div style={{ display: "grid", gap: "12px", marginTop: "20px" }}>
              {[
                "Header mais premium com logo Y destacado",
                "Mockup com banner, avatar, status e plataformas",
                "Glow sutil para profundidade sem lag",
                "CTAs com hierarquia mais forte",
              ].map((item) => (
                <div key={item} style={listRowStyle}>
                  <span style={listBulletStyle}>+</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.52, delay: 0.04 }}
            style={secondaryPanelStyle}
            className="hover-lift"
          >
            <div style={eyebrowStyle("#45D483")}>
              <LuSparkles size={14} />
              Preparada para escalar
            </div>
            <div style={{ display: "grid", gap: "14px", marginTop: "18px" }}>
              {[
                {
                  title: "Features mais vendaveis",
                  text: "As secoes explicam valor sem poluir a tela e sem exigir assets externos.",
                },
                {
                  title: "Responsividade segura",
                  text: "A composicao quebra bem em tablet e mobile mantendo impacto visual e leitura.",
                },
                {
                  title: "Motion controlado",
                  text: "Framer Motion fica presente com vida e elegancia, mas sem cursor effects ou parallax pesado.",
                },
              ].map((item) => (
                <div key={item.title} style={stackCardStyle}>
                  <strong style={{ fontSize: "17px", letterSpacing: "-0.02em" }}>{item.title}</strong>
                  <p style={{ margin: "8px 0 0", color: "#AAB6CE", lineHeight: 1.7 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: "0 0 82px" }}>
        <div className="yotei-shell">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.99 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.32 }}
            transition={{ duration: 0.55 }}
            style={finalCtaStyle}
          >
            <div style={finalGlowStyle} />
            <div style={eyebrowStyle("#7C6BFF")}>
              <LuSparkles size={14} />
              Homepage refeita para impressionar
            </div>
            <h2 style={{ margin: "18px 0 0", fontSize: "clamp(34px, 6vw, 58px)", lineHeight: 0.98, letterSpacing: "-0.06em" }}>
              Transforme a primeira tela do Yotei em um pitch visual.
            </h2>
            <p style={{ margin: "16px auto 0", maxWidth: "720px", color: "#C8D1E2", lineHeight: 1.8, fontSize: "17px" }}>
              Premium, moderna, viva e com identidade propria. A homepage agora pode vender o produto antes mesmo do login.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "14px",
                flexWrap: "wrap",
                marginTop: "26px",
                position: "relative",
                zIndex: 1,
              }}
            >
              <Link href="/register" className="cta-main" style={ctaMainStyle}>
                Comecar agora
                <LuArrowRight size={18} />
              </Link>
              <Link href="/login" className="cta-secondary" style={ctaSecondaryStyle}>
                Entrar
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div style={metricCardStyle}>
      <div style={{ fontSize: "26px", fontWeight: 900, letterSpacing: "-0.05em" }}>{value}</div>
      <div style={{ color: "#95A2BD", marginTop: "8px", fontSize: "13px", lineHeight: 1.5 }}>{label}</div>
    </div>
  );
}

function FeatureCard({
  accent,
  icon,
  text,
  title,
}: {
  accent: string;
  icon: ReactNode;
  text: string;
  title: string;
}) {
  return (
    <div style={featureCardStyle(accent)} className="hover-lift">
      <div style={featureIconStyle(accent)}>{icon}</div>
      <h3 style={{ margin: "18px 0 0", fontSize: "20px", letterSpacing: "-0.03em" }}>{title}</h3>
      <p style={{ margin: "12px 0 0", color: "#AEB9D0", lineHeight: 1.75, fontSize: "15px" }}>{text}</p>
    </div>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
  color: "#F7F9FC",
  background:
    "radial-gradient(circle at top, rgba(32, 42, 92, 0.42), transparent 26%), radial-gradient(circle at 86% 18%, rgba(255, 91, 147, 0.18), transparent 18%), linear-gradient(180deg, #06080E 0%, #090B12 48%, #06070D 100%)",
  fontFamily: '"Space Grotesk", "Aptos", "Segoe UI", sans-serif',
};

const logoBadgeStyle: CSSProperties = {
  width: "44px",
  height: "44px",
  borderRadius: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
  fontSize: "18px",
  color: "#FFFFFF",
  background:
    "linear-gradient(135deg, rgba(122, 110, 255, 0.98), rgba(255, 93, 156, 0.96))",
  boxShadow: "0 14px 30px rgba(91, 108, 255, 0.24)",
  position: "relative",
};

const navGhostStyle: CSSProperties = {
  textDecoration: "none",
  color: "#D5DDF0",
  padding: "10px 14px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
};

const navPrimaryStyle: CSSProperties = {
  ...navGhostStyle,
  color: "#FFFFFF",
  border: "1px solid rgba(123, 108, 255, 0.34)",
  background:
    "linear-gradient(135deg, rgba(123, 108, 255, 0.24), rgba(255, 93, 156, 0.20))",
  boxShadow: "0 16px 28px rgba(103, 102, 255, 0.18)",
  fontWeight: 800,
};

const heroTitleStyle: CSSProperties = {
  margin: "18px 0 0",
  fontSize: "clamp(44px, 7vw, 84px)",
  lineHeight: 0.92,
  letterSpacing: "-0.07em",
  fontWeight: 950,
  maxWidth: "780px",
};

const heroBodyStyle: CSSProperties = {
  marginTop: "22px",
  maxWidth: "640px",
  color: "#B9C5D9",
  fontSize: "18px",
  lineHeight: 1.85,
};

const ctaMainStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  minHeight: "56px",
  padding: "0 22px",
  textDecoration: "none",
  borderRadius: "16px",
  color: "#FFFFFF",
  fontWeight: 900,
  border: "1px solid rgba(123, 108, 255, 0.36)",
  background:
    "linear-gradient(135deg, rgba(123, 108, 255, 0.34), rgba(255, 93, 156, 0.30))",
  boxShadow: "0 18px 34px rgba(103, 102, 255, 0.22)",
};

const ctaSecondaryStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "56px",
  padding: "0 22px",
  textDecoration: "none",
  borderRadius: "16px",
  color: "#DCE4F4",
  fontWeight: 800,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.03)",
};

const microChipStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 12px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
  color: "#D3DDEE",
  fontSize: "13px",
  fontWeight: 700,
};

const metricCardStyle: CSSProperties = {
  borderRadius: "20px",
  padding: "18px",
  background: "linear-gradient(180deg, rgba(15, 18, 29, 0.96), rgba(11, 13, 22, 0.98))",
  border: "1px solid rgba(255,255,255,0.07)",
  boxShadow: "0 18px 34px rgba(0,0,0,0.18)",
};

const mockupFrameStyle: CSSProperties = {
  position: "relative",
  padding: "18px",
  borderRadius: "32px",
  background:
    "linear-gradient(180deg, rgba(14, 17, 28, 0.96), rgba(9, 11, 19, 0.98))",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 34px 70px rgba(0,0,0,0.34)",
  overflow: "hidden",
};

const mockupInnerFrameStyle: CSSProperties = {
  position: "absolute",
  inset: "10px",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.05)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
  pointerEvents: "none",
};

const mockupGlowStyle: CSSProperties = {
  position: "absolute",
  inset: "-30px",
  background:
    "radial-gradient(circle at 18% 20%, rgba(122, 110, 255, 0.26), transparent 34%), radial-gradient(circle at 82% 16%, rgba(255, 93, 156, 0.18), transparent 28%)",
  pointerEvents: "none",
};

const browserBarStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  alignItems: "center",
  padding: "0 2px 14px",
};

const browserUrlStyle: CSSProperties = {
  flex: "1 1 190px",
  minWidth: 0,
  minHeight: "38px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#8F9CB7",
  fontSize: "13px",
  padding: "0 12px",
  textAlign: "center",
};

const liveBadgeStyle: CSSProperties = {
  minHeight: "38px",
  borderRadius: "12px",
  border: "1px solid rgba(69, 212, 131, 0.18)",
  background: "rgba(69, 212, 131, 0.08)",
  color: "#9CF5BE",
  padding: "0 12px",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "13px",
  fontWeight: 700,
};

const liveDotStyle: CSSProperties = {
  width: "8px",
  height: "8px",
  borderRadius: "999px",
  background: "#45D483",
  boxShadow: "0 0 0 4px rgba(69,212,131,0.14)",
};

const profilePanelStyle: CSSProperties = {
  position: "relative",
  borderRadius: "24px",
  overflow: "hidden",
  background:
    "linear-gradient(180deg, rgba(10, 13, 24, 0.98), rgba(7, 10, 18, 0.98))",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 24px 48px rgba(2, 6, 16, 0.32)",
};

const profilePanelEdgeStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(circle at top, rgba(126, 160, 255, 0.12), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.04), transparent 18%)",
  pointerEvents: "none",
};

const bannerStyle: CSSProperties = {
  position: "relative",
  minHeight: "192px",
  padding: "18px 18px 24px",
  background:
    "linear-gradient(135deg, rgba(17, 25, 46, 0.98) 0%, rgba(27, 16, 41, 0.96) 46%, rgba(9, 14, 25, 1) 100%)",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  justifyContent: "space-between",
  overflow: "hidden",
};

const bannerDepthLayerStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(circle at 18% 24%, rgba(126, 160, 255, 0.28), transparent 24%), radial-gradient(circle at 82% 18%, rgba(255, 125, 180, 0.24), transparent 20%), radial-gradient(circle at 58% 72%, rgba(77, 164, 255, 0.16), transparent 24%), linear-gradient(180deg, transparent 0%, rgba(5, 7, 12, 0.28) 100%)",
  pointerEvents: "none",
};

const bannerGridStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage:
    "linear-gradient(rgba(126, 160, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(126, 160, 255, 0.08) 1px, transparent 1px)",
  backgroundSize: "42px 42px",
  maskImage: "linear-gradient(180deg, rgba(0,0,0,1), rgba(0,0,0,0.35))",
  opacity: 0.28,
};

const bannerAccentStyle: CSSProperties = {
  position: "absolute",
  right: "-30px",
  top: "-10px",
  width: "180px",
  height: "180px",
  borderRadius: "999px",
  background:
    "radial-gradient(circle, rgba(126, 160, 255, 0.32) 0%, rgba(126, 160, 255, 0.08) 40%, rgba(126, 160, 255, 0) 72%)",
  filter: "blur(4px)",
  pointerEvents: "none",
};

const bannerAccentSecondaryStyle: CSSProperties = {
  position: "absolute",
  right: "20px",
  bottom: "24px",
  width: "150px",
  height: "78px",
  borderRadius: "22px",
  transform: "rotate(-11deg)",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(126, 160, 255, 0.10) 38%, rgba(255, 125, 180, 0.14) 100%)",
  boxShadow: "0 20px 42px rgba(0,0,0,0.16)",
  backdropFilter: "blur(8px)",
  pointerEvents: "none",
};

const bannerTopRowStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
  flexWrap: "wrap",
};

const bannerContentStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "grid",
  gap: "14px",
  width: "min(100%, 360px)",
};

const bannerMessageCardStyle: CSSProperties = {
  padding: "16px 16px 15px",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(12, 17, 31, 0.72), rgba(12, 16, 28, 0.48))",
  boxShadow: "0 18px 30px rgba(3, 7, 19, 0.24)",
  backdropFilter: "blur(10px)",
};

const bannerMessageEyebrowStyle: CSSProperties = {
  color: "#A5B8FF",
  fontSize: "11px",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.14em",
};

const bannerMessageTitleStyle: CSSProperties = {
  marginTop: "10px",
  fontSize: "20px",
  lineHeight: 1.15,
  fontWeight: 900,
  letterSpacing: "-0.04em",
  maxWidth: "260px",
};

const bannerMessageBodyStyle: CSSProperties = {
  marginTop: "8px",
  color: "#CBD6EB",
  fontSize: "13px",
  lineHeight: 1.55,
};

const bannerStatsRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "10px",
};

const bannerStatCardStyle: CSSProperties = {
  display: "grid",
  gap: "4px",
  padding: "12px 14px",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(7, 11, 20, 0.48)",
  backdropFilter: "blur(10px)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
};

const profileBodyStyle: CSSProperties = {
  padding: "0 18px 18px",
  marginTop: "-38px",
  position: "relative",
  zIndex: 2,
  display: "grid",
  gap: "18px",
};

const identityRowStyle: CSSProperties = {
  position: "relative",
};

const avatarShellStyle: CSSProperties = {
  position: "relative",
  width: "108px",
  height: "108px",
  flexShrink: 0,
};

const avatarGlowRingStyle: CSSProperties = {
  position: "absolute",
  inset: "-9px",
  borderRadius: "999px",
  border: "1px solid rgba(144, 168, 255, 0.42)",
  boxShadow:
    "0 0 0 7px rgba(10, 13, 22, 0.88), 0 0 42px rgba(97, 118, 255, 0.18)",
};

const avatarAuraStyle: CSSProperties = {
  position: "absolute",
  inset: "4px",
  borderRadius: "999px",
  background:
    "radial-gradient(circle, rgba(255, 95, 155, 0.22) 0%, rgba(123, 108, 255, 0.14) 44%, rgba(123, 108, 255, 0) 74%)",
  transform: "scale(1.16)",
  pointerEvents: "none",
  filter: "blur(8px)",
};

const avatarCoreStyle: CSSProperties = {
  position: "relative",
  width: "108px",
  height: "108px",
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.18)",
  background:
    "radial-gradient(circle at 26% 24%, rgba(255,255,255,0.34), transparent 22%), linear-gradient(145deg, rgba(255, 94, 156, 0.98) 0%, rgba(122, 111, 255, 1) 62%, rgba(67, 135, 255, 0.96) 100%)",
  boxShadow: "0 22px 40px rgba(94, 88, 255, 0.22)",
};

const avatarShineStyle: CSSProperties = {
  position: "absolute",
  inset: "8px",
  borderRadius: "999px",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.24), rgba(255,255,255,0) 42%)",
  opacity: 0.8,
};

const avatarLetterStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  fontSize: "38px",
  fontWeight: 900,
  letterSpacing: "-0.06em",
  color: "#FFFFFF",
  textShadow: "0 10px 24px rgba(15, 19, 42, 0.28)",
};

const profileIntroStyle: CSSProperties = {
  minWidth: 0,
};

const profileNameRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
};

const profileNameStyle: CSSProperties = {
  margin: 0,
  fontSize: "30px",
  lineHeight: 0.95,
  letterSpacing: "-0.05em",
};

const profileHandleRowStyle: CSSProperties = {
  marginTop: "10px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
  color: "#9CA9C3",
  fontSize: "13px",
};

const profileFeaturedPillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  minHeight: "34px",
  padding: "0 12px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#E8EEF8",
  fontSize: "12px",
  fontWeight: 800,
};

const profileBioStyle: CSSProperties = {
  margin: "14px 0 0",
  color: "#C5CFDF",
  lineHeight: 1.68,
  fontSize: "14px",
  maxWidth: "440px",
};

const verifiedChipStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  borderRadius: "999px",
  padding: "7px 10px",
  background: "rgba(69, 212, 131, 0.10)",
  border: "1px solid rgba(69, 212, 131, 0.18)",
  color: "#9CF5BE",
  fontSize: "12px",
  fontWeight: 800,
};

const premiumChipStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  borderRadius: "999px",
  padding: "7px 10px",
  background: "rgba(255, 197, 82, 0.10)",
  border: "1px solid rgba(255, 197, 82, 0.18)",
  color: "#FFD979",
  fontSize: "12px",
  fontWeight: 800,
};

const liveProfileChipStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  borderRadius: "999px",
  minHeight: "28px",
  padding: "0 10px",
  background: "rgba(69, 212, 131, 0.10)",
  border: "1px solid rgba(69, 212, 131, 0.18)",
  color: "#9CF5BE",
  fontSize: "11px",
  fontWeight: 800,
};

const featuredChipStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  borderRadius: "999px",
  padding: "7px 10px",
  background: "rgba(90, 178, 255, 0.12)",
  border: "1px solid rgba(90, 178, 255, 0.20)",
  color: "#9FD8FF",
  fontSize: "12px",
  fontWeight: 800,
};

const liveProfileDotStyle: CSSProperties = {
  width: "7px",
  height: "7px",
  borderRadius: "999px",
  background: "#45D483",
};

const profileLinksGridStyle: CSSProperties = {
  alignItems: "stretch",
};

const platformHandleStyle: CSSProperties = {
  marginTop: "6px",
  color: "#8B98B4",
  fontSize: "13px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const platformArrowStyle: CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#E8EDF7",
  background: "rgba(255,255,255,0.03)",
  flexShrink: 0,
};

const sectionTitleStyle: CSSProperties = {
  margin: "16px 0 0",
  fontSize: "clamp(32px, 5vw, 56px)",
  lineHeight: 1,
  letterSpacing: "-0.05em",
};

const sectionBodyStyle: CSSProperties = {
  margin: "14px auto 0",
  maxWidth: "760px",
  color: "#B5C0D6",
  fontSize: "17px",
  lineHeight: 1.8,
};

const secondaryPanelStyle: CSSProperties = {
  borderRadius: "28px",
  padding: "24px",
  background: "linear-gradient(180deg, rgba(15, 18, 29, 0.96), rgba(10, 12, 21, 0.98))",
  border: "1px solid rgba(255,255,255,0.07)",
  boxShadow: "0 24px 46px rgba(0,0,0,0.24)",
};

const panelTextStyle: CSSProperties = {
  marginTop: "16px",
  color: "#BAC6DA",
  lineHeight: 1.8,
  fontSize: "16px",
};

const listRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  color: "#E7EDF7",
};

const listBulletStyle: CSSProperties = {
  width: "26px",
  height: "26px",
  borderRadius: "999px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255, 93, 156, 0.10)",
  border: "1px solid rgba(255, 93, 156, 0.16)",
  color: "#FF91C2",
  fontWeight: 900,
  flexShrink: 0,
};

const stackCardStyle: CSSProperties = {
  borderRadius: "18px",
  padding: "18px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.06)",
};

const finalCtaStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: "32px",
  padding: "36px 26px",
  textAlign: "center",
  background:
    "linear-gradient(135deg, rgba(17, 21, 34, 0.98), rgba(18, 14, 29, 0.96) 54%, rgba(11, 14, 24, 0.98) 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 28px 56px rgba(0,0,0,0.28)",
};

const finalGlowStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(circle at 18% 18%, rgba(123, 108, 255, 0.22), transparent 28%), radial-gradient(circle at 84% 24%, rgba(255, 93, 156, 0.18), transparent 24%)",
  pointerEvents: "none",
};

function eyebrowStyle(accent: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    borderRadius: "999px",
    color: accent,
    background: `${accent}14`,
    border: `1px solid ${accent}24`,
    fontWeight: 800,
    fontSize: "13px",
  };
}

function platformCardStyle(accent: string): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px",
    borderRadius: "18px",
    background:
      "linear-gradient(180deg, rgba(18, 22, 34, 0.98), rgba(12, 15, 24, 1))",
    border: `1px solid ${accent}22`,
    boxShadow: `0 18px 26px ${accent}10`,
  };
}

function platformButtonStyle(accent: string): CSSProperties {
  return {
    ...platformCardStyle(accent),
    width: "100%",
    minHeight: "88px",
    alignItems: "center",
    textAlign: "left",
    appearance: "none",
    cursor: "pointer",
  };
}

function platformIconWrapStyle(accent: string): CSSProperties {
  return {
    width: "44px",
    height: "44px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: accent,
    background: `${accent}14`,
    border: `1px solid ${accent}2A`,
    flexShrink: 0,
  };
}

function platformMetaStyle(accent: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "999px",
    padding: "5px 9px",
    background: `${accent}12`,
    border: `1px solid ${accent}22`,
    color: accent,
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };
}

function panelChipStyle(background: string, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "30px",
    padding: "0 12px",
    borderRadius: "999px",
    background,
    color,
    border: "1px solid rgba(255,255,255,0.08)",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.03em",
  };
}

function profileTagStyle(background: string, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "34px",
    padding: "0 12px",
    borderRadius: "999px",
    background,
    color,
    border: "1px solid rgba(255,255,255,0.06)",
    fontSize: "12px",
    fontWeight: 800,
  };
}

function featureCardStyle(accent: string): CSSProperties {
  return {
    height: "100%",
    borderRadius: "26px",
    padding: "22px",
    background:
      "linear-gradient(180deg, rgba(14, 17, 28, 0.96), rgba(9, 11, 18, 0.98))",
    border: `1px solid ${accent}24`,
    boxShadow: `0 18px 34px ${accent}0D`,
    position: "relative",
    overflow: "hidden",
  };
}

function featureIconStyle(accent: string): CSSProperties {
  return {
    width: "48px",
    height: "48px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: accent,
    background: `${accent}16`,
    border: `1px solid ${accent}2A`,
    boxShadow: `0 12px 24px ${accent}14`,
  };
}

function browserDotStyle(color: string): CSSProperties {
  return {
    width: "10px",
    height: "10px",
    borderRadius: "999px",
    background: color,
    display: "inline-block",
  };
}

function orbStyle(style: CSSProperties): CSSProperties {
  return {
    position: "absolute",
    pointerEvents: "none",
    filter: "blur(22px)",
    opacity: 0.9,
    ...style,
  };
}

function linkCardVariants(accent: string): Variants {
  return {
    rest: {
      y: 0,
      scale: 1,
      boxShadow: `0 18px 26px ${accent}10`,
      borderColor: `${accent}22`,
    },
    hover: {
      y: -4,
      scale: 1.01,
      boxShadow: `0 22px 34px ${accent}18`,
      borderColor: `${accent}3A`,
      transition: {
        duration: 0.18,
      },
    },
    press: {
      y: 0,
      scale: 0.988,
      boxShadow: `0 12px 20px ${accent}10`,
      transition: {
        duration: 0.12,
      },
    },
  };
}

function linkIconVariants(accent: string): Variants {
  return {
    rest: {
      scale: 1,
      rotate: 0,
      boxShadow: `0 0 0 ${accent}00`,
    },
    hover: {
      scale: 1.08,
      rotate: -6,
      boxShadow: `0 12px 24px ${accent}16`,
      transition: {
        duration: 0.18,
      },
    },
    press: {
      scale: 0.96,
      rotate: 0,
      transition: {
        duration: 0.12,
      },
    },
  };
}

const linkArrowVariants: Variants = {
  rest: {
    x: 0,
    opacity: 0.8,
  },
  hover: {
    x: 3,
    opacity: 1,
    transition: {
      duration: 0.18,
    },
  },
  press: {
    x: 1,
    transition: {
      duration: 0.12,
    },
  },
};

const presenceIndicatorStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  minHeight: "34px",
  padding: "0 12px",
  borderRadius: "999px",
  background: "rgba(6, 9, 17, 0.54)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#D9E5F7",
  fontSize: "12px",
  fontWeight: 700,
};

const presenceDotStyle: CSSProperties = {
  width: "8px",
  height: "8px",
  borderRadius: "999px",
  background: "#45D483",
};

const viewsChipStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  minHeight: "34px",
  padding: "0 12px",
  borderRadius: "999px",
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#E8EDF7",
  fontSize: "12px",
  fontWeight: 700,
};
