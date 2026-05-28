import { useEffect, useId, useRef, type CSSProperties } from "react";

type YoteiBrandMarkProps = {
  size?: number;
  animated?: boolean;
  intensity?: "calm" | "standard" | "hero";
  showWordmark?: boolean;
  className?: string;
  debugLabel?: string;
};

const INTENSITY_MAP = {
  calm: {
    auraOpacity: "0.46",
    ringOpacity: "0.72",
    particleOpacity: "0.52",
    shimmerOpacity: "0.18",
    orbitPrimary: "34s",
    orbitSecondary: "42s",
    breathe: "5.8s",
    shimmer: "5.2s",
    particleDrift: "7.4s",
  },
  standard: {
    auraOpacity: "0.58",
    ringOpacity: "0.84",
    particleOpacity: "0.66",
    shimmerOpacity: "0.24",
    orbitPrimary: "28s",
    orbitSecondary: "36s",
    breathe: "4.8s",
    shimmer: "4.3s",
    particleDrift: "6.3s",
  },
  hero: {
    auraOpacity: "0.74",
    ringOpacity: "0.96",
    particleOpacity: "0.82",
    shimmerOpacity: "0.32",
    orbitPrimary: "22s",
    orbitSecondary: "30s",
    breathe: "3.9s",
    shimmer: "3.6s",
    particleDrift: "5.1s",
  },
} as const;

function joinClassNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function YoteiBrandMark({
  size = 128,
  animated = true,
  intensity = "standard",
  showWordmark = false,
  className,
  debugLabel,
}: YoteiBrandMarkProps) {
  const uniqueId = useId().replace(/:/g, "");
  const previousAnimatedRef = useRef<boolean | null>(null);
  const config = INTENSITY_MAP[intensity];
  const width = showWordmark ? Math.round(size * 1.84) : size;
  const svgClassName = joinClassNames(
    "ybm-root",
    animated && "ybm-animated",
    showWordmark && "ybm-with-wordmark",
    className
  );
  const style = {
    width: `${width}px`,
    height: `${size}px`,
    overflow: "visible",
    "--ybm-aura-opacity": config.auraOpacity,
    "--ybm-ring-opacity": config.ringOpacity,
    "--ybm-particle-opacity": config.particleOpacity,
    "--ybm-shimmer-opacity": config.shimmerOpacity,
    "--ybm-orbit-primary": config.orbitPrimary,
    "--ybm-orbit-secondary": config.orbitSecondary,
    "--ybm-breathe": config.breathe,
    "--ybm-shimmer": config.shimmer,
    "--ybm-particle-drift": config.particleDrift,
  } as CSSProperties;

  const glyphId = `${uniqueId}-glyph`;
  const clipId = `${uniqueId}-clip`;
  const auraGradientId = `${uniqueId}-aura`;
  const coreGradientId = `${uniqueId}-core`;
  const facetGradientId = `${uniqueId}-facet`;
  const ringPrimaryId = `${uniqueId}-ring-primary`;
  const ringSecondaryId = `${uniqueId}-ring-secondary`;
  const shimmerId = `${uniqueId}-shimmer`;
  const wordmarkGradientId = `${uniqueId}-wordmark`;

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    if (previousAnimatedRef.current === animated) {
      return;
    }

    previousAnimatedRef.current = animated;

    console.info("Yotei brand mark motion", {
      label: debugLabel ?? className ?? "brand-mark",
      animated,
      intensity,
      showWordmark,
    });
  }, [animated, className, debugLabel, intensity, showWordmark]);

  return (
    <svg
      aria-hidden="true"
      className={svgClassName}
      data-yotei-animated={animated ? "true" : "false"}
      data-yotei-brand-mark={debugLabel ?? className ?? "brand-mark"}
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      style={style}
      viewBox={showWordmark ? "0 0 472 256" : "0 0 256 256"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={auraGradientId} cx="50%" cy="50%" r="58%">
          <stop offset="0%" stopColor="#9B8BFF" stopOpacity="0.94" />
          <stop offset="42%" stopColor="#FF77B6" stopOpacity="0.44" />
          <stop offset="76%" stopColor="#67B9FF" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#67B9FF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={coreGradientId} x1="72" x2="184" y1="48" y2="208" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BBA8FF" />
          <stop offset="45%" stopColor="#FF7AB7" />
          <stop offset="100%" stopColor="#7EC6FF" />
        </linearGradient>
        <linearGradient id={facetGradientId} x1="88" x2="160" y1="70" y2="190" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={ringPrimaryId} x1="18" x2="236" y1="76" y2="176" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7D6EFF" stopOpacity="0.2" />
          <stop offset="26%" stopColor="#B995FF" stopOpacity="0.88" />
          <stop offset="58%" stopColor="#FF7AB7" stopOpacity="0.96" />
          <stop offset="100%" stopColor="#6EBEFF" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id={ringSecondaryId} x1="34" x2="224" y1="28" y2="232" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6EBEFF" stopOpacity="0.22" />
          <stop offset="34%" stopColor="#B59CFF" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#FF8ABF" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#6EBEFF" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id={shimmerId} x1="76" x2="170" y1="70" y2="166" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={wordmarkGradientId} x1="224" x2="428" y1="94" y2="162" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F7F8FF" />
          <stop offset="72%" stopColor="#D9E6FF" />
          <stop offset="100%" stopColor="#9FD2FF" />
        </linearGradient>
        <path
          id={glyphId}
          d="M66 54H99L128 90L157 54H190L141 117V202H115V117L66 54Z"
        />
        <clipPath id={clipId}>
          <use href={`#${glyphId}`} />
        </clipPath>
      </defs>

      <style>{`
        .ybm-root {
          display: block;
          isolation: isolate;
        }

        .ybm-aura {
          opacity: var(--ybm-aura-opacity);
        }

        .ybm-rings {
          opacity: var(--ybm-ring-opacity);
        }

        .ybm-particles {
          opacity: var(--ybm-particle-opacity);
        }

        .ybm-shimmer {
          opacity: var(--ybm-shimmer-opacity);
        }

        .ybm-orbit,
        .ybm-aura-pulse,
        .ybm-shimmer,
        .ybm-particle {
          transform-box: fill-box;
          transform-origin: center;
        }

        .ybm-wordmark {
          fill: url(#${wordmarkGradientId});
          font: 900 60px "Manrope", "Sora", "Segoe UI", sans-serif;
          letter-spacing: 0.16em;
        }

        .ybm-wordmark-rule {
          stroke: rgba(126, 198, 255, 0.82);
          stroke-linecap: round;
          stroke-width: 3;
          opacity: 0.7;
        }

        .ybm-animated .ybm-orbit-primary {
          animation: ybm-orbit-primary var(--ybm-orbit-primary) linear infinite;
        }

        .ybm-animated .ybm-orbit-secondary {
          animation: ybm-orbit-secondary var(--ybm-orbit-secondary) linear infinite;
        }

        .ybm-animated .ybm-aura-pulse {
          animation: ybm-breathe var(--ybm-breathe) ease-in-out infinite;
        }

        .ybm-animated .ybm-shimmer {
          animation: ybm-shimmer-pass var(--ybm-shimmer) ease-in-out infinite;
        }

        .ybm-animated .ybm-particle-a {
          animation: ybm-particle-drift var(--ybm-particle-drift) ease-in-out infinite;
        }

        .ybm-animated .ybm-particle-b {
          animation: ybm-particle-drift var(--ybm-particle-drift) ease-in-out infinite reverse;
          animation-delay: -1.3s;
        }

        .ybm-animated .ybm-particle-c {
          animation: ybm-particle-drift var(--ybm-particle-drift) ease-in-out infinite;
          animation-delay: -2.2s;
        }

        @keyframes ybm-orbit-primary {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes ybm-orbit-secondary {
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes ybm-breathe {
          0%,
          100% {
            opacity: calc(var(--ybm-aura-opacity) * 0.82);
            transform: scale(0.986);
          }

          50% {
            opacity: var(--ybm-aura-opacity);
            transform: scale(1.03);
          }
        }

        @keyframes ybm-shimmer-pass {
          0%,
          14% {
            opacity: 0;
            transform: translateX(-86px);
          }

          30% {
            opacity: var(--ybm-shimmer-opacity);
          }

          54% {
            opacity: 0;
            transform: translateX(110px);
          }

          100% {
            opacity: 0;
            transform: translateX(110px);
          }
        }

        @keyframes ybm-particle-drift {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }

          50% {
            transform: translateY(-3px) scale(1.08);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ybm-animated .ybm-orbit-primary,
          .ybm-animated .ybm-orbit-secondary,
          .ybm-animated .ybm-aura-pulse,
          .ybm-animated .ybm-shimmer,
          .ybm-animated .ybm-particle-a,
          .ybm-animated .ybm-particle-b,
          .ybm-animated .ybm-particle-c {
            animation: none !important;
          }

          .ybm-shimmer {
            opacity: 0 !important;
          }
        }
      `}</style>

      <g className="ybm-aura ybm-aura-pulse">
        <circle cx="128" cy="128" r="94" fill={`url(#${auraGradientId})`} />
        <ellipse cx="128" cy="128" fill={`url(#${auraGradientId})`} rx="78" ry="58" />
      </g>

      <g className="ybm-rings">
        <g className="ybm-orbit ybm-orbit-primary">
          <ellipse
            cx="128"
            cy="128"
            fill="none"
            rx="100"
            ry="58"
            stroke={`url(#${ringPrimaryId})`}
            strokeDasharray="164 84"
            strokeLinecap="round"
            strokeWidth="6"
            transform="rotate(-18 128 128)"
          />
          <ellipse
            cx="128"
            cy="128"
            fill="none"
            opacity="0.3"
            rx="100"
            ry="58"
            stroke="rgba(247, 248, 255, 0.28)"
            strokeDasharray="14 18"
            strokeLinecap="round"
            strokeWidth="2"
            transform="rotate(-18 128 128)"
          />
          <g className="ybm-particles">
            <circle className="ybm-particle ybm-particle-a" cx="210" cy="96" fill="#FFD6EB" r="4.5" />
            <circle className="ybm-particle ybm-particle-b" cx="49" cy="158" fill="#8BCBFF" r="3.5" />
          </g>
        </g>

        <g className="ybm-orbit ybm-orbit-secondary">
          <ellipse
            cx="128"
            cy="128"
            fill="none"
            rx="74"
            ry="104"
            stroke={`url(#${ringSecondaryId})`}
            strokeDasharray="142 96"
            strokeLinecap="round"
            strokeWidth="5"
            transform="rotate(28 128 128)"
          />
          <ellipse
            cx="128"
            cy="128"
            fill="none"
            opacity="0.26"
            rx="74"
            ry="104"
            stroke="rgba(247, 248, 255, 0.22)"
            strokeDasharray="16 16"
            strokeLinecap="round"
            strokeWidth="1.75"
            transform="rotate(28 128 128)"
          />
          <g className="ybm-particles">
            <circle className="ybm-particle ybm-particle-c" cx="175" cy="32" fill="#AFA2FF" r="3.5" />
            <circle className="ybm-particle ybm-particle-a" cx="84" cy="218" fill="#FF9AC5" r="4" />
          </g>
        </g>
      </g>

      <g>
        <use
          href={`#${glyphId}`}
          fill={`url(#${coreGradientId})`}
          stroke="rgba(255, 255, 255, 0.22)"
          strokeLinejoin="round"
          strokeWidth="1.4"
        />
        <path
          d="M94 66H108L128 91L148 66H162L135 104V188H121V104L94 66Z"
          fill={`url(#${facetGradientId})`}
          opacity="0.56"
        />
        <path
          d="M83 63H98L128 100L158 63H173"
          fill="none"
          opacity="0.68"
          stroke="rgba(255, 255, 255, 0.42)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
        <path
          d="M128 100V193"
          fill="none"
          opacity="0.34"
          stroke="rgba(255, 255, 255, 0.34)"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <g clipPath={`url(#${clipId})`}>
          <g className="ybm-shimmer">
            <rect
              fill={`url(#${shimmerId})`}
              height="196"
              transform="rotate(18 128 128)"
              width="42"
              x="92"
              y="30"
            />
          </g>
        </g>
      </g>

      {showWordmark ? (
        <g>
          <text className="ybm-wordmark" x="232" y="143">
            YOTEI
          </text>
          <path className="ybm-wordmark-rule" d="M233 168H424" />
        </g>
      ) : null}
    </svg>
  );
}
