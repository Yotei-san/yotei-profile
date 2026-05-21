import type { CSSProperties } from "react";
import {
  normalizeProfileMotionLevel,
  type ProfileMotionLevel,
} from "@/app/lib/profile-customization";
import {
  PROFILE_AMBIENT_TYPES,
  type ProfileAmbientType,
} from "@/app/lib/profile-scenes";

type Props = {
  type?: ProfileAmbientType | string | null;
  motionLevel?: ProfileMotionLevel;
  density?: number;
  preview?: boolean;
};

type ParticlePreset = {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  driftX: number;
  driftY: number;
  rotate: number;
  scale: number;
};

const PARTICLE_PRESETS: ParticlePreset[] = [
  { left: 6, top: 8, size: 4, duration: 16, delay: -2.2, opacity: 0.26, driftX: 10, driftY: 28, rotate: 8, scale: 0.9 },
  { left: 12, top: 18, size: 7, duration: 19, delay: -9.4, opacity: 0.44, driftX: -16, driftY: 42, rotate: 24, scale: 1 },
  { left: 18, top: 62, size: 5, duration: 13, delay: -4.8, opacity: 0.3, driftX: 12, driftY: -36, rotate: 18, scale: 0.88 },
  { left: 26, top: 12, size: 3, duration: 15, delay: -6.2, opacity: 0.34, driftX: 6, driftY: 30, rotate: -14, scale: 0.82 },
  { left: 32, top: 38, size: 8, duration: 18, delay: -1.8, opacity: 0.48, driftX: -12, driftY: 44, rotate: 34, scale: 1.04 },
  { left: 38, top: 72, size: 4, duration: 14, delay: -11.3, opacity: 0.24, driftX: 8, driftY: -30, rotate: 12, scale: 0.78 },
  { left: 44, top: 22, size: 6, duration: 17, delay: -7.4, opacity: 0.36, driftX: 18, driftY: 26, rotate: -18, scale: 0.94 },
  { left: 52, top: 48, size: 5, duration: 20, delay: -5.6, opacity: 0.28, driftX: -10, driftY: 36, rotate: 22, scale: 0.86 },
  { left: 58, top: 10, size: 3, duration: 12, delay: -3.5, opacity: 0.24, driftX: 12, driftY: 24, rotate: -6, scale: 0.74 },
  { left: 64, top: 68, size: 7, duration: 16, delay: -10.6, opacity: 0.42, driftX: -18, driftY: -38, rotate: 28, scale: 1.08 },
  { left: 71, top: 24, size: 5, duration: 15, delay: -2.9, opacity: 0.32, driftX: 14, driftY: 34, rotate: 16, scale: 0.9 },
  { left: 77, top: 8, size: 4, duration: 18, delay: -8.3, opacity: 0.22, driftX: 8, driftY: 42, rotate: -12, scale: 0.78 },
  { left: 82, top: 56, size: 8, duration: 21, delay: -12.8, opacity: 0.46, driftX: -14, driftY: -34, rotate: 26, scale: 1.02 },
  { left: 88, top: 18, size: 3, duration: 14, delay: -5.1, opacity: 0.28, driftX: 6, driftY: 28, rotate: 10, scale: 0.8 },
  { left: 92, top: 36, size: 6, duration: 17, delay: -7.7, opacity: 0.38, driftX: -12, driftY: 30, rotate: -22, scale: 0.92 },
  { left: 14, top: 84, size: 5, duration: 19, delay: -13.8, opacity: 0.22, driftX: 20, driftY: -26, rotate: 18, scale: 0.88 },
  { left: 48, top: 86, size: 4, duration: 13, delay: -6.6, opacity: 0.2, driftX: -8, driftY: -22, rotate: -8, scale: 0.74 },
  { left: 86, top: 82, size: 7, duration: 16, delay: -9.2, opacity: 0.32, driftX: 12, driftY: -28, rotate: 30, scale: 0.98 },
];

const PARTICLE_CONFIG: Record<
  Exclude<ProfileAmbientType, "none">,
  { className: string; count: number; colors: [string, string] }
> = {
  rain: {
    className: "type-rain",
    count: 12,
    colors: ["rgba(196, 216, 255, 0.72)", "rgba(96, 165, 250, 0.28)"],
  },
  snow: {
    className: "type-snow",
    count: 14,
    colors: ["rgba(245, 250, 255, 0.86)", "rgba(186, 230, 253, 0.22)"],
  },
  embers: {
    className: "type-embers",
    count: 12,
    colors: ["rgba(254, 215, 170, 0.88)", "rgba(251, 113, 133, 0.32)"],
  },
  stars: {
    className: "type-stars",
    count: 16,
    colors: ["rgba(255, 255, 255, 0.9)", "rgba(196, 181, 253, 0.28)"],
  },
  petals: {
    className: "type-petals",
    count: 10,
    colors: ["rgba(253, 164, 175, 0.8)", "rgba(249, 168, 212, 0.3)"],
  },
  cyber: {
    className: "type-cyber",
    count: 10,
    colors: ["rgba(34, 211, 238, 0.86)", "rgba(56, 189, 248, 0.24)"],
  },
  dust: {
    className: "type-dust",
    count: 14,
    colors: ["rgba(255, 255, 255, 0.42)", "rgba(226, 232, 240, 0.14)"],
  },
};

export default function EnvironmentParticles({
  type = "none",
  motionLevel = "subtle",
  density = 0,
  preview = false,
}: Props) {
  const resolvedType = normalizeAmbientType(type);
  const resolvedMotionLevel = normalizeProfileMotionLevel(motionLevel);

  if (resolvedType === "none") {
    return null;
  }

  const config = PARTICLE_CONFIG[resolvedType];
  const densityFactor = clamp(density, 0, 1);
  const motionCountCap =
    resolvedMotionLevel === "off" ? 4 : resolvedMotionLevel === "subtle" ? 8 : 16;
  const previewCap = preview ? 2 : 0;
  const count = Math.max(
    resolvedMotionLevel === "off" ? 2 : 4,
    Math.min(
      motionCountCap,
      config.count,
      Math.round(config.count * (0.48 + densityFactor * 0.7)) - previewCap,
    ),
  );
  const particles = PARTICLE_PRESETS.slice(0, count);

  return (
    <div
      className={`environment-particles ${config.className} motion-${resolvedMotionLevel}${preview ? " is-preview" : ""}`}
      style={
        {
          "--particle-color-primary": config.colors[0],
          "--particle-color-secondary": config.colors[1],
        } as CSSProperties
      }
      aria-hidden
    >
      <style>{environmentParticleStyles}</style>
      {particles.map((particle, index) => (
        <span
          // Stable presets keep the layer hydration-safe.
          key={`${resolvedType}-${index}`}
          className="environment-particle"
          style={
            {
              "--particle-left": `${particle.left}%`,
              "--particle-top": `${particle.top}%`,
              "--particle-size": `${particle.size}px`,
              "--particle-duration": `${particle.duration}s`,
              "--particle-delay": `${particle.delay}s`,
              "--particle-opacity": `${particle.opacity}`,
              "--particle-drift-x": `${particle.driftX}px`,
              "--particle-drift-y": `${particle.driftY}px`,
              "--particle-rotate": `${particle.rotate}deg`,
              "--particle-scale": `${particle.scale}`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function normalizeAmbientType(value: Props["type"]): ProfileAmbientType {
  if (typeof value !== "string") {
    return "none";
  }

  const trimmed = value.trim().toLowerCase();
  return PROFILE_AMBIENT_TYPES.includes(trimmed as ProfileAmbientType)
    ? (trimmed as ProfileAmbientType)
    : "none";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const environmentParticleStyles = `
  .environment-particles {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 4;
  }

  .environment-particle {
    position: absolute;
    left: var(--particle-left);
    top: var(--particle-top);
    width: var(--particle-size);
    height: var(--particle-size);
    opacity: var(--particle-opacity);
    transform: translate3d(0, 0, 0) rotate(var(--particle-rotate)) scale(var(--particle-scale));
  }

  .motion-subtle .environment-particle,
  .motion-alive .environment-particle {
    will-change: transform, opacity;
  }

  .type-rain .environment-particle {
    width: max(1px, calc(var(--particle-size) * 0.24));
    height: calc(var(--particle-size) * 4.8);
    border-radius: 999px;
    background: linear-gradient(180deg, var(--particle-color-primary), var(--particle-color-secondary));
    animation: environment-rain var(--particle-duration) linear infinite;
    animation-delay: var(--particle-delay);
  }

  .type-snow .environment-particle,
  .type-stars .environment-particle,
  .type-dust .environment-particle {
    border-radius: 999px;
    background: radial-gradient(circle, var(--particle-color-primary) 0%, var(--particle-color-secondary) 100%);
  }

  .type-snow .environment-particle {
    animation: environment-snow var(--particle-duration) linear infinite;
    animation-delay: var(--particle-delay);
  }

  .type-stars .environment-particle {
    box-shadow: 0 0 calc(var(--particle-size) * 2.2) var(--particle-color-secondary);
    animation: environment-stars calc(var(--particle-duration) * 0.72) ease-in-out infinite;
    animation-delay: var(--particle-delay);
  }

  .type-embers .environment-particle {
    border-radius: 999px 999px 999px 999px;
    background: radial-gradient(circle, var(--particle-color-primary) 0%, var(--particle-color-secondary) 78%);
    animation: environment-embers calc(var(--particle-duration) * 0.82) ease-in-out infinite;
    animation-delay: var(--particle-delay);
  }

  .type-petals .environment-particle {
    width: calc(var(--particle-size) * 1.5);
    height: calc(var(--particle-size) * 0.96);
    border-radius: 999px 999px 999px 999px;
    background: linear-gradient(135deg, var(--particle-color-primary), var(--particle-color-secondary));
    animation: environment-petals var(--particle-duration) ease-in-out infinite;
    animation-delay: var(--particle-delay);
  }

  .type-cyber .environment-particle {
    width: calc(var(--particle-size) * 1.1);
    height: calc(var(--particle-size) * 2.3);
    border-radius: 2px;
    background: linear-gradient(180deg, var(--particle-color-primary), var(--particle-color-secondary));
    animation: environment-cyber calc(var(--particle-duration) * 0.76) linear infinite;
    animation-delay: var(--particle-delay);
  }

  .type-dust .environment-particle {
    animation: environment-dust calc(var(--particle-duration) * 0.88) ease-in-out infinite;
    animation-delay: var(--particle-delay);
  }

  .environment-particles.is-preview .environment-particle {
    opacity: calc(var(--particle-opacity) * 0.8);
  }

  .motion-off .environment-particle {
    animation: none !important;
    opacity: calc(var(--particle-opacity) * 0.72);
    transform: translate3d(0, 0, 0) rotate(var(--particle-rotate)) scale(calc(var(--particle-scale) * 0.94));
  }

  @keyframes environment-rain {
    0% {
      opacity: 0;
      transform: translate3d(0, -18%, 0) rotate(14deg) scaleY(0.88);
    }

    20%,
    80% {
      opacity: var(--particle-opacity);
    }

    100% {
      opacity: 0;
      transform: translate3d(var(--particle-drift-x), 120%, 0) rotate(18deg) scaleY(1.02);
    }
  }

  @keyframes environment-snow {
    0% {
      opacity: 0;
      transform: translate3d(0, -16%, 0) scale(var(--particle-scale));
    }

    18%,
    76% {
      opacity: var(--particle-opacity);
    }

    100% {
      opacity: 0;
      transform: translate3d(var(--particle-drift-x), 118%, 0) scale(calc(var(--particle-scale) * 1.08));
    }
  }

  @keyframes environment-embers {
    0% {
      opacity: 0;
      transform: translate3d(0, 12%, 0) rotate(var(--particle-rotate)) scale(calc(var(--particle-scale) * 0.84));
    }

    22%,
    72% {
      opacity: var(--particle-opacity);
    }

    100% {
      opacity: 0;
      transform: translate3d(var(--particle-drift-x), calc(var(--particle-drift-y) * -1), 0) rotate(calc(var(--particle-rotate) + 14deg)) scale(calc(var(--particle-scale) * 1.1));
    }
  }

  @keyframes environment-stars {
    0%,
    100% {
      opacity: calc(var(--particle-opacity) * 0.4);
      transform: translate3d(0, 0, 0) scale(calc(var(--particle-scale) * 0.92));
    }

    50% {
      opacity: var(--particle-opacity);
      transform: translate3d(0, calc(var(--particle-drift-y) * -0.12), 0) scale(calc(var(--particle-scale) * 1.08));
    }
  }

  @keyframes environment-petals {
    0% {
      opacity: 0;
      transform: translate3d(0, -8%, 0) rotate(var(--particle-rotate)) scale(var(--particle-scale));
    }

    24%,
    76% {
      opacity: var(--particle-opacity);
    }

    100% {
      opacity: 0;
      transform: translate3d(var(--particle-drift-x), 110%, 0) rotate(calc(var(--particle-rotate) + 38deg)) scale(calc(var(--particle-scale) * 1.04));
    }
  }

  @keyframes environment-cyber {
    0% {
      opacity: 0;
      transform: translate3d(0, -28%, 0) scaleY(0.88);
    }

    16%,
    72% {
      opacity: var(--particle-opacity);
    }

    100% {
      opacity: 0;
      transform: translate3d(calc(var(--particle-drift-x) * 0.28), 118%, 0) scaleY(1.06);
    }
  }

  @keyframes environment-dust {
    0%,
    100% {
      opacity: calc(var(--particle-opacity) * 0.52);
      transform: translate3d(0, 0, 0) scale(var(--particle-scale));
    }

    50% {
      opacity: var(--particle-opacity);
      transform: translate3d(var(--particle-drift-x), calc(var(--particle-drift-y) * -0.22), 0) scale(calc(var(--particle-scale) * 1.06));
    }
  }

  @media (max-width: 768px) {
    .environment-particle:nth-child(n + 11) {
      display: none;
    }
  }

  @media (hover: none) and (pointer: coarse), (update: slow) {
    .environment-particle:nth-child(n + 9) {
      display: none;
    }

    .environment-particle {
      animation-duration: calc(var(--particle-duration) * 1.18);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .environment-particle {
      animation: none !important;
      opacity: calc(var(--particle-opacity) * 0.54);
      transform: translate3d(0, 0, 0) rotate(var(--particle-rotate)) scale(calc(var(--particle-scale) * 0.9));
    }
  }
`;
