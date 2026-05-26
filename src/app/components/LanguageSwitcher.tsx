"use client";

import type { CSSProperties } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { LuCheck, LuChevronDown, LuLanguages } from "react-icons/lu";
import { useI18n } from "@/app/components/I18nProvider";
import type { Locale } from "@/app/lib/i18n";

type Props = {
  variant?: "inline" | "compact" | "floating";
};

const LOCALE_OPTIONS: Locale[] = ["en", "pt-BR"];

export default function LanguageSwitcher({ variant = "inline" }: Props) {
  const { locale, setLocale, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const labelId = useId();
  const menuId = useId();
  const shellRef = useRef<HTMLDivElement>(null);

  const options = useMemo(
    () => [
      { value: "en" as const, label: t("languageSwitcher.english") },
      {
        value: "pt-BR" as const,
        label: t("languageSwitcher.portugueseBrazil"),
      },
    ],
    [t],
  );
  const currentOption =
    options.find((option) => option.value === locale) ?? options[0];
  const currentTriggerLabel =
    variant === "compact"
      ? currentOption.value === "pt-BR"
        ? "PT-BR"
        : "EN"
      : currentOption.label;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!shellRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={shellRef} style={shellStyle(variant)}>
      <style>{`
        .language-switcher-trigger:hover,
        .language-switcher-trigger:focus-visible {
          border-color: rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.1) !important;
          box-shadow: 0 12px 26px rgba(0,0,0,0.22);
        }

        .language-switcher-option:hover,
        .language-switcher-option:focus-visible {
          transform: translateY(-1px);
          border-color: rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.08) !important;
        }
      `}</style>
      <span id={labelId} style={labelStyle(variant)}>
        <LuLanguages size={variant === "compact" ? 14 : 16} />
        {variant === "compact" ? null : t("languageSwitcher.label")}
      </span>

      <button
        className="language-switcher-trigger"
        type="button"
        aria-labelledby={variant === "compact" ? undefined : labelId}
        aria-label={variant === "compact" ? t("languageSwitcher.ariaLabel") : undefined}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((currentOpen) => !currentOpen)}
        style={triggerStyle(variant, isOpen)}
      >
        <span style={triggerValueStyle(variant)}>{currentTriggerLabel}</span>
        <LuChevronDown
          size={16}
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 160ms ease",
          }}
        />
      </button>

      {isOpen ? (
        <div id={menuId} role="listbox" aria-label={t("languageSwitcher.ariaLabel")} style={menuStyle(variant)}>
          {LOCALE_OPTIONS.map((optionValue) => {
            const option = options.find((entry) => entry.value === optionValue) ?? options[0];
            const isSelected = option.value === locale;

            return (
              <button
                className="language-switcher-option"
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setLocale(option.value);
                  setIsOpen(false);
                }}
                style={optionStyle(isSelected)}
              >
                <span>{option.label}</span>
                {isSelected ? <LuCheck size={15} /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function shellStyle(variant: Props["variant"]): CSSProperties {
  return {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: variant === "compact" ? "0" : "10px",
    minHeight: variant === "floating" ? "48px" : "42px",
    padding:
      variant === "floating"
        ? "0 14px"
        : variant === "compact"
          ? "0 10px"
          : "0 12px",
    borderRadius: variant === "floating" ? "18px" : "999px",
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      variant === "floating"
        ? "linear-gradient(180deg, rgba(16,18,28,0.94), rgba(9,11,18,0.96))"
        : "rgba(255,255,255,0.04)",
    color: "#f5f7ff",
    boxShadow:
      variant === "floating"
        ? "0 18px 36px rgba(0,0,0,0.24)"
        : "inset 0 1px 0 rgba(255,255,255,0.04)",
  };
}

function labelStyle(variant: Props["variant"]): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    color: "#dbe6ff",
    fontSize: variant === "compact" ? "0" : "12px",
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    flexShrink: 0,
  };
}

function triggerStyle(
  variant: Props["variant"],
  isOpen: boolean,
): CSSProperties {
  return {
    minHeight: variant === "floating" ? "36px" : "32px",
    padding: variant === "compact" ? "0 2px 0 6px" : "0 6px 0 10px",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: variant === "floating" ? "12px" : "999px",
    background: isOpen
      ? "rgba(255,255,255,0.08)"
      : "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
    color: "#ffffff",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    font: "inherit",
    fontSize: "13px",
    fontWeight: 700,
    boxShadow: isOpen ? "0 10px 22px rgba(0,0,0,0.18)" : "none",
    transition: "background 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
  };
}

function triggerValueStyle(variant: Props["variant"]): CSSProperties {
  return {
    minWidth: variant === "compact" ? "3.9rem" : "6.5rem",
    textAlign: "left",
    whiteSpace: "nowrap",
  };
}

function menuStyle(variant: Props["variant"]): CSSProperties {
  return {
    position: "absolute",
    top: `calc(100% + ${variant === "floating" ? "10px" : "8px"})`,
    right: 0,
    minWidth: variant === "compact" ? "170px" : "220px",
    padding: "8px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      "linear-gradient(180deg, rgba(16,18,28,0.98), rgba(9,11,18,0.99))",
    boxShadow: "0 22px 48px rgba(0,0,0,0.34)",
    backdropFilter: "blur(18px)",
    zIndex: 120,
    display: "grid",
    gap: "6px",
  };
}

function optionStyle(isSelected: boolean): CSSProperties {
  return {
    minHeight: "42px",
    width: "100%",
    padding: "0 12px",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "12px",
    background: isSelected
      ? "linear-gradient(135deg, rgba(124,108,255,0.24), rgba(255,110,168,0.2))"
      : "rgba(255,255,255,0.03)",
    color: "#f5f7ff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    cursor: "pointer",
    font: "inherit",
    fontSize: "13px",
    fontWeight: isSelected ? 800 : 700,
    textAlign: "left",
    transition: "background 160ms ease, border-color 160ms ease, transform 160ms ease",
  };
}
