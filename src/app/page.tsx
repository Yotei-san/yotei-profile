"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useMemo } from "react";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN_OUT = [0.4, 0, 0.2, 1] as const;

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: EASE_OUT,
    },
  },
};

function HeroMockLink({
  title,
  subtitle,
  accent,
}: {
  title: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        padding: "16px",
        borderRadius: "18px",
        background:
          "linear-gradient(180deg, rgba(15,15,19,0.92), rgba(9,9,12,0.96))",
        border: `1px solid ${accent}30`,
        boxShadow: `0 10px 24px ${accent}12`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "14px",
            background: `${accent}20`,
            border: `1px solid ${accent}40`,
            flexShrink: 0,
          }}
        />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 900, letterSpacing: "-0.02em" }}>{title}</div>
          <div
            style={{
              marginTop: "4px",
              fontSize: "13px",
              color: "#97a1b1",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>

      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "12px",
          backgroundColor: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#dbe3ee",
          flexShrink: 0,
        }}
      >
        ↗
      </div>
    </div>
  );
}

function FeatureCard({
  accent,
  icon,
  title,
  text,
}: {
  accent: string;
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        borderRadius: "24px",
        padding: "22px",
        background:
          "linear-gradient(180deg, rgba(14,14,18,0.90), rgba(8,8,12,0.96))",
        border: `1px solid ${accent}24`,
        boxShadow: `0 14px 28px ${accent}10`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at top right, ${accent}10, transparent 40%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "46px",
          height: "46px",
          borderRadius: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: `${accent}18`,
          border: `1px solid ${accent}30`,
          fontSize: "20px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          margin: "16px 0 0",
          fontSize: "20px",
          fontWeight: 900,
          letterSpacing: "-0.03em",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          marginTop: "10px",
          color: "#b9c2cf",
          lineHeight: 1.75,
          fontSize: "15px",
        }}
      >
        {text}
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: "22px",
        padding: "20px",
        background:
          "linear-gradient(180deg, rgba(14,14,18,0.88), rgba(8,8,12,0.96))",
        border: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "0 12px 28px rgba(0,0,0,0.22)",
      }}
    >
      <div style={{ color: "#aeb8c6", fontSize: "14px" }}>{label}</div>
      <div
        style={{
          marginTop: "10px",
          fontSize: "30px",
          fontWeight: 900,
          letterSpacing: "-0.04em",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function HomePage() {
  const mockLinks = useMemo(
    () => [
      { title: "Discord", subtitle: "community / social identity", accent: "#5865F2" },
      { title: "Instagram", subtitle: "visual presence / content", accent: "#E4405F" },
      { title: "GitHub", subtitle: "projects / developer profile", accent: "#cbd5e1" },
      { title: "X", subtitle: "updates / audience / reach", accent: "#60a5fa" },
    ],
    []
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        color: "#ffffff",
        background:
          "radial-gradient(circle at top, rgba(244,114,182,0.12), transparent 20%), radial-gradient(circle at 82% 18%, rgba(96,165,250,0.12), transparent 16%), radial-gradient(circle at 20% 75%, rgba(192,132,252,0.08), transparent 18%), #050507",
        fontFamily: "Arial, Helvetica, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        .yotei-shell {
          width: min(1240px, calc(100% - 32px));
          margin: 0 auto;
        }

        .yotei-grid-hero {
          display: grid;
          grid-template-columns: 1.02fr 0.98fr;
          gap: 28px;
          align-items: center;
        }

        .yotei-grid-features {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .yotei-grid-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .yotei-grid-showcase {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .yotei-button-main,
        .yotei-button-secondary,
        .yotei-showcase-panel,
        .yotei-mockup-shell {
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .yotei-button-main:hover,
        .yotei-button-secondary:hover,
        .yotei-showcase-panel:hover,
        .yotei-mockup-shell:hover {
          transform: translateY(-3px);
        }

        .hero-title-gradient {
          background: linear-gradient(90deg, #f472b6, #c084fc, #60a5fa);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .noise-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.03;
          background-image:
            radial-gradient(rgba(255,255,255,0.6) 0.6px, transparent 0.6px);
          background-size: 6px 6px;
          mix-blend-mode: soft-light;
        }

        @media (max-width: 1024px) {
          .yotei-grid-hero,
          .yotei-grid-showcase {
            grid-template-columns: 1fr;
          }

          .yotei-grid-features,
          .yotei-grid-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .yotei-grid-features,
          .yotei-grid-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="noise-layer" />

      <motion.div
        animate={{
          x: [0, 12, -6, 0],
          y: [0, 12, 6, 0],
          scale: [1, 1.04, 0.98, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: EASE_IN_OUT }}
        style={glowOrb("300px", "300px", "-70px", "40px", "rgba(244,114,182,0.18)")}
      />
      <motion.div
        animate={{
          x: [0, -12, 8, 0],
          y: [0, -10, 8, 0],
          scale: [1, 0.98, 1.03, 1],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: EASE_IN_OUT }}
        style={glowOrb("280px", "280px", undefined, "120px", "rgba(96,165,250,0.16)", "-50px")}
      />

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(5,5,7,0.50)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div
          className="yotei-shell"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "74px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontWeight: 900,
              fontSize: "22px",
              letterSpacing: "-0.03em",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, rgba(244,114,182,0.95), rgba(168,85,247,0.95))",
                boxShadow: "0 10px 24px rgba(244,114,182,0.16)",
                fontSize: "16px",
              }}
            >
              Y
            </div>
            <span>Yotei Profile</span>
          </motion.div>

          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <Link href="/login" style={navLinkStyle}>
              Login
            </Link>
            <Link href="/register" style={navPrimaryStyle}>
              Criar conta
            </Link>
          </motion.nav>
        </div>
      </header>

      <section style={{ padding: "56px 0 28px", position: "relative" }}>
        <div className="yotei-shell yotei-grid-hero">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={fadeUp} style={pillStyle("#f472b6")}>
              ✦ Premium animated identity layer
            </motion.div>

            <motion.h1
              variants={fadeUp}
              style={{
                margin: "18px 0 0",
                fontSize: "clamp(44px, 8vw, 86px)",
                lineHeight: 0.92,
                letterSpacing: "-0.06em",
                fontWeight: 900,
                maxWidth: "780px",
              }}
            >
              The profile
              <br />
              platform that
              <br />
              <span className="hero-title-gradient">looks expensive.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              style={{
                marginTop: "22px",
                maxWidth: "670px",
                color: "#c5cad3",
                fontSize: "18px",
                lineHeight: 1.85,
              }}
            >
              Build a public identity with animated avatar decorations, premium
              links, reactions, badges, analytics, and cinematic visual
              customization — inside a profile that feels like a real product,
              not just another bio page.
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
              <Link href="/register" className="yotei-button-main" style={ctaMainStyle}>
                Criar meu perfil
              </Link>

              <a
                href="#preview"
                className="yotei-button-secondary"
                style={ctaSecondaryStyle}
              >
                Ver experiência
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              style={{
                display: "flex",
                gap: "24px",
                flexWrap: "wrap",
                marginTop: "28px",
                color: "#b8c0cc",
                fontSize: "14px",
              }}
            >
              <span>✔ Visual premium raro</span>
              <span>✔ Decorações animadas</span>
              <span>✔ Analytics + reactions</span>
            </motion.div>
          </motion.div>

          <motion.div
            id="preview"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.12, ease: EASE_OUT }}
          >
            <motion.div
              className="yotei-mockup-shell"
              style={{
                position: "relative",
                borderRadius: "34px",
                padding: "18px",
                background:
                  "linear-gradient(180deg, rgba(18,18,24,0.88), rgba(9,9,14,0.96))",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow:
                  "0 26px 72px rgba(0,0,0,0.42), 0 0 0 1px rgba(255,255,255,0.03) inset",
              }}
            >
              <motion.div
                animate={{
                  opacity: [0.32, 0.48, 0.32],
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: EASE_IN_OUT }}
                style={{
                  position: "absolute",
                  inset: "-18px",
                  borderRadius: "38px",
                  background:
                    "radial-gradient(circle at 20% 20%, rgba(244,114,182,0.10), transparent 35%), radial-gradient(circle at 80% 10%, rgba(96,165,250,0.10), transparent 30%)",
                  filter: "blur(10px)",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  height: "240px",
                  borderRadius: "24px",
                  background:
                    "linear-gradient(135deg, rgba(244,114,182,0.42), rgba(96,165,250,0.22), rgba(0,0,0,0.32)), url(https://placehold.co/1200x400) center/cover no-repeat",
                }}
              />

              <div
                style={{
                  marginTop: "-72px",
                  padding: "0 18px 18px",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: "136px",
                    height: "136px",
                    borderRadius: "999px",
                    position: "relative",
                    margin: "0 auto",
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    style={{
                      position: "absolute",
                      inset: "-14px",
                      borderRadius: "999px",
                      border: "2px solid rgba(244,114,182,0.34)",
                      boxShadow: "0 0 18px rgba(244,114,182,0.16)",
                    }}
                  />
                  <img
                    src="https://placehold.co/300x300"
                    alt="Mockup avatar"
                    style={{
                      width: "136px",
                      height: "136px",
                      objectFit: "cover",
                      borderRadius: "999px",
                      border: "5px solid #f472b6",
                      boxShadow:
                        "0 0 0 10px rgba(0,0,0,0.54), 0 18px 42px rgba(244,114,182,0.18)",
                      display: "block",
                    }}
                  />
                </div>

                <div style={{ textAlign: "center", marginTop: "16px" }}>
                  <div
                    style={{
                      fontSize: "32px",
                      fontWeight: 900,
                      letterSpacing: "-0.045em",
                    }}
                  >
                    Yotei
                  </div>
                  <div
                    style={{
                      marginTop: "6px",
                      color: "#b8c0cc",
                    }}
                  >
                    @yotei-san
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "16px",
                    padding: "14px 16px",
                    borderRadius: "18px",
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    color: "#d8dde7",
                    lineHeight: 1.7,
                    textAlign: "center",
                  }}
                >
                  Animated identity. Custom profile aesthetic. Premium links.
                  Analytics and reactions in one public layer.
                </div>

                <div
                  style={{
                    marginTop: "16px",
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={mockupPill("#4ade80")}>👍 214</div>
                  <div style={mockupPill("#f87171")}>👎 12</div>
                  <div style={mockupPill("#cbd5e1")}>👁 1.2k views</div>
                </div>

                <div
                  style={{
                    marginTop: "18px",
                    display: "grid",
                    gap: "12px",
                  }}
                >
                  {mockLinks.map((item) => (
                    <HeroMockLink
                      key={item.title}
                      title={item.title}
                      subtitle={item.subtitle}
                      accent={item.accent}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: "18px 0 22px" }}>
        <motion.div
          className="yotei-shell yotei-grid-stats"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.22 }}
        >
          <StatCard label="Identity layer" value="Alive" />
          <StatCard label="Decorations" value="Animated" />
          <StatCard label="Analytics" value="Tracked" />
          <StatCard label="Aesthetic" value="Premium" />
        </motion.div>
      </section>

      <section style={{ padding: "34px 0" }}>
        <div className="yotei-shell">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center", marginBottom: "20px" }}
          >
            <div style={pillStyle("#60a5fa")}>✦ Core features</div>
            <h2
              style={{
                margin: "16px 0 0",
                fontSize: "clamp(32px, 5vw, 58px)",
                lineHeight: 1,
                letterSpacing: "-0.045em",
              }}
            >
              More than a bio page.
            </h2>
            <p
              style={{
                margin: "14px auto 0",
                maxWidth: "760px",
                color: "#bcc5d2",
                fontSize: "17px",
                lineHeight: 1.8,
              }}
            >
              Yotei is built to feel like your own public identity layer — rare,
              expressive, and premium from the first click.
            </p>
          </motion.div>

          <motion.div
            className="yotei-grid-features"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <FeatureCard
              accent="#f472b6"
              icon="✦"
              title="Animated decorations"
              text="Add premium avatar frames and visual identity that makes the profile feel alive."
            />
            <FeatureCard
              accent="#60a5fa"
              icon="📈"
              title="Smart analytics"
              text="Track clicks, views, and engagement to understand what actually performs."
            />
            <FeatureCard
              accent="#4ade80"
              icon="🎨"
              title="Custom visual style"
              text="Use banners, avatars, theme colors, and profile composition that fit your identity."
            />
            <FeatureCard
              accent="#c084fc"
              icon="🏅"
              title="Badges and status"
              text="Build recognition with premium profile layers like badges, reactions, and visible status."
            />
          </motion.div>
        </div>
      </section>

      <section style={{ padding: "26px 0 38px" }}>
        <div className="yotei-shell yotei-grid-showcase">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
            className="yotei-showcase-panel"
            style={showcasePanelStyle()}
          >
            <div style={pillStyle("#c084fc")}>✦ Why it feels premium</div>
            <h3
              style={{
                margin: "18px 0 0",
                fontSize: "42px",
                lineHeight: 1,
                letterSpacing: "-0.04em",
              }}
            >
              Identity first.
            </h3>
            <p
              style={{
                marginTop: "16px",
                color: "#c2cad6",
                lineHeight: 1.85,
                fontSize: "16px",
              }}
            >
              Your page should feel like a personal product. Strong visuals,
              premium links, reactions, badges, decorations, and analytics all
              work together to create a high-end public presence.
            </p>

            <div
              style={{
                display: "grid",
                gap: "12px",
                marginTop: "20px",
              }}
            >
              {[
                "Public profile with premium aesthetic",
                "Links that look intentional, not generic",
                "Reactions, views and profile feedback loop",
                "Ready for premium plans later",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "#e7ebf2",
                  }}
                >
                  <div
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "999px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(244,114,182,0.14)",
                      border: "1px solid rgba(244,114,182,0.24)",
                      color: "#f9a8d4",
                      fontSize: "13px",
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: 0.04 }}
            className="yotei-showcase-panel"
            style={showcasePanelStyle()}
          >
            <div style={pillStyle("#4ade80")}>✦ Built for evolution</div>
            <div
              style={{
                marginTop: "18px",
                display: "grid",
                gap: "14px",
              }}
            >
              {[
                {
                  title: "Premium plans",
                  text: "Prepare the base for paid features without breaking the product structure.",
                },
                {
                  title: "Creator identity",
                  text: "Let each profile look like a real identity layer, not a copy of everyone else.",
                },
                {
                  title: "Scalable dashboard",
                  text: "Profile editing, links, decorations and analytics stay organized as the platform grows.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    borderRadius: "20px",
                    padding: "18px",
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 900,
                      fontSize: "18px",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      marginTop: "8px",
                      color: "#bcc5d2",
                      lineHeight: 1.75,
                    }}
                  >
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: "20px 0 78px" }}>
        <motion.div
          className="yotei-shell"
          initial={{ opacity: 0, y: 18, scale: 0.99 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
          style={{
            borderRadius: "34px",
            padding: "34px",
            background:
              "linear-gradient(135deg, rgba(244,114,182,0.16), rgba(96,165,250,0.10), rgba(10,10,14,0.82))",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 24px 72px rgba(0,0,0,0.30)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <motion.div
            animate={{
              opacity: [0.2, 0.36, 0.2],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: EASE_IN_OUT }}
            style={{
              position: "absolute",
              width: "320px",
              height: "320px",
              borderRadius: "999px",
              background: "rgba(244,114,182,0.12)",
              filter: "blur(28px)",
              left: "-60px",
              top: "-80px",
              pointerEvents: "none",
            }}
          />

          <div style={pillStyle("#f472b6")}>✦ Launch your identity</div>
          <h2
            style={{
              margin: "18px 0 0",
              fontSize: "clamp(34px, 6vw, 62px)",
              lineHeight: 1,
              letterSpacing: "-0.05em",
              position: "relative",
            }}
          >
            Start building your Yotei profile today.
          </h2>
          <p
            style={{
              margin: "16px auto 0",
              maxWidth: "760px",
              color: "#d4dbe6",
              lineHeight: 1.8,
              fontSize: "17px",
              position: "relative",
            }}
          >
            Create a public profile that feels premium, expressive, and ready to
            grow into something much bigger.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "14px",
              flexWrap: "wrap",
              marginTop: "24px",
              position: "relative",
            }}
          >
            <Link href="/register" className="yotei-button-main" style={ctaMainStyle}>
              Criar conta agora
            </Link>
            <Link href="/login" className="yotei-button-secondary" style={ctaSecondaryStyle}>
              Já tenho conta
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

function glowOrb(
  width: string,
  height: string,
  left: string | undefined,
  top: string,
  background: string,
  right?: string
): React.CSSProperties {
  return {
    position: "absolute",
    width,
    height,
    left,
    right,
    top,
    borderRadius: "999px",
    filter: "blur(36px)",
    pointerEvents: "none",
    opacity: 0.34,
    background,
  };
}

function showcasePanelStyle(): React.CSSProperties {
  return {
    borderRadius: "30px",
    padding: "24px",
    background:
      "linear-gradient(180deg, rgba(13,13,18,0.88), rgba(7,7,12,0.96))",
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 18px 48px rgba(0,0,0,0.28)",
  };
}

function pillStyle(accent: string): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    borderRadius: "999px",
    backgroundColor: `${accent}14`,
    border: `1px solid ${accent}28`,
    color: accent,
    fontWeight: 800,
    fontSize: "13px",
  };
}

const navLinkStyle: React.CSSProperties = {
  color: "#d4dbe6",
  textDecoration: "none",
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.05)",
  backgroundColor: "rgba(255,255,255,0.02)",
};

const navPrimaryStyle: React.CSSProperties = {
  color: "#ffffff",
  textDecoration: "none",
  padding: "10px 16px",
  borderRadius: "12px",
  border: "1px solid rgba(244,114,182,0.24)",
  background:
    "linear-gradient(135deg, rgba(244,114,182,0.22), rgba(168,85,247,0.16))",
  boxShadow: "0 12px 24px rgba(244,114,182,0.12)",
  fontWeight: 800,
};

const ctaMainStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  minHeight: "56px",
  padding: "0 24px",
  borderRadius: "16px",
  border: "1px solid rgba(244,114,182,0.26)",
  background:
    "linear-gradient(135deg, rgba(244,114,182,0.26), rgba(168,85,247,0.18))",
  color: "#ffffff",
  fontWeight: 900,
  boxShadow: "0 16px 34px rgba(244,114,182,0.16)",
};

const ctaSecondaryStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  minHeight: "56px",
  padding: "0 24px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.07)",
  backgroundColor: "rgba(255,255,255,0.03)",
  color: "#dbe4ef",
  fontWeight: 800,
};

const mockupPill = (accent: string): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 12px",
  borderRadius: "999px",
  backgroundColor: `${accent}16`,
  border: `1px solid ${accent}26`,
  color: "#eef2f7",
  fontWeight: 800,
  fontSize: "13px",
});
