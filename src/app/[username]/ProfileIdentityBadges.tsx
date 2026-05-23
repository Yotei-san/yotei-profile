import BadgeVisual from "@/app/dashboard/components/BadgeVisual";

type IdentityBadge = {
  id: string;
  badge: {
    slug: string;
    name: string;
    color: string | null;
    category: string | null;
    rarity: string | null;
  };
};

export default function ProfileIdentityBadges({
  badges,
  extraBadgeCount = 0,
  themeColor,
  align = "start",
}: {
  badges: IdentityBadge[];
  extraBadgeCount?: number;
  themeColor: string;
  align?: "start" | "center";
}) {
  if (badges.length === 0 && extraBadgeCount <= 0) {
    return null;
  }

  return (
    <div className={`profile-identity-badges align-${align}`}>
      <style>{`
        .profile-identity-badges {
          display: flex;
          align-items: center;
          gap: 7px;
          flex-wrap: wrap;
          min-width: 0;
        }

        .profile-identity-badges.align-center {
          justify-content: center;
        }

        .profile-identity-badge {
          position: relative;
          width: 32px;
          height: 32px;
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03)),
            rgba(7,10,18,0.42);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.06),
            0 10px 24px rgba(0,0,0,0.16);
          color: #f8fbff;
          outline: none;
        }

        .profile-identity-badge::before,
        .profile-identity-badge::after {
          position: absolute;
          left: 50%;
          pointer-events: none;
          opacity: 0;
          transition:
            opacity 150ms ease,
            transform 150ms ease;
        }

        .profile-identity-badge::before {
          content: "";
          bottom: calc(100% + 4px);
          transform: translate(-50%, 4px);
          border-width: 5px 5px 0 5px;
          border-style: solid;
          border-color: rgba(8,10,16,0.94) transparent transparent transparent;
        }

        .profile-identity-badge::after {
          content: attr(data-tooltip);
          bottom: calc(100% + 10px);
          transform: translate(-50%, 6px);
          padding: 7px 9px;
          border-radius: 10px;
          background: rgba(8,10,16,0.94);
          border: 1px solid rgba(255,255,255,0.08);
          color: #f7fbff;
          font-size: 11px;
          font-weight: 700;
          line-height: 1;
          white-space: nowrap;
          box-shadow: 0 14px 28px rgba(0,0,0,0.28);
          z-index: 2;
        }

        .profile-identity-badge:hover::before,
        .profile-identity-badge:hover::after,
        .profile-identity-badge:focus-visible::before,
        .profile-identity-badge:focus-visible::after {
          opacity: 1;
        }

        .profile-identity-badge:hover::before,
        .profile-identity-badge:focus-visible::before {
          transform: translate(-50%, 0);
        }

        .profile-identity-badge:hover::after,
        .profile-identity-badge:focus-visible::after {
          transform: translate(-50%, 0);
        }

        .profile-identity-badge-more {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.02em;
        }

        @media (max-width: 640px) {
          .profile-identity-badge::after {
            max-width: min(70vw, 220px);
            white-space: normal;
            text-align: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .profile-identity-badge::before,
          .profile-identity-badge::after {
            transition: none;
          }
        }
      `}</style>

      {badges.map((item) => {
        const accentColor = item.badge.color || themeColor;
        const isHighlighted =
          item.badge.slug === "premium" ||
          item.badge.slug === "owner" ||
          item.badge.slug === "admin" ||
          item.badge.category === "official";

        return (
          <span
            key={item.id}
            className="profile-identity-badge"
            data-tooltip={item.badge.name}
            tabIndex={0}
            aria-label={item.badge.name}
            style={{
              borderColor: isHighlighted ? `${accentColor}44` : "rgba(255,255,255,0.09)",
              boxShadow: isHighlighted
                ? `inset 0 1px 0 rgba(255,255,255,0.08), 0 12px 26px ${accentColor}18`
                : "inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 24px rgba(0,0,0,0.16)",
            }}
          >
            <BadgeVisual
              slug={item.badge.slug}
              color={accentColor}
              rarity={item.badge.rarity}
              category={item.badge.category}
              size={24}
              compact
            />
          </span>
        );
      })}

      {extraBadgeCount > 0 ? (
        <span
          className="profile-identity-badge"
          data-tooltip={`${extraBadgeCount} more badge${extraBadgeCount === 1 ? "" : "s"}`}
          tabIndex={0}
          aria-label={`${extraBadgeCount} more badges`}
        >
          <span className="profile-identity-badge-more">+{extraBadgeCount}</span>
        </span>
      ) : null}
    </div>
  );
}
