"use client";

import type { CSSProperties } from "react";
import { useId } from "react";
import { LuLanguages } from "react-icons/lu";
import { useI18n } from "@/app/components/I18nProvider";
import type { Locale } from "@/app/lib/i18n";

type Props = {
  variant?: "inline" | "compact" | "floating";
};

export default function LanguageSwitcher({ variant = "inline" }: Props) {
  const { locale, setLocale, t } = useI18n();
  const labelId = useId();

  return (
    <label style={shellStyle(variant)} aria-labelledby={labelId}>
      <span id={labelId} style={labelStyle(variant)}>
        <LuLanguages size={variant === "compact" ? 14 : 16} />
        {variant === "compact" ? null : t("languageSwitcher.label")}
      </span>
      <select
        aria-label={t("languageSwitcher.ariaLabel")}
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        style={selectStyle(variant)}
      >
        <option value="en">{t("languageSwitcher.english")}</option>
        <option value="pt-BR">{t("languageSwitcher.portugueseBrazil")}</option>
      </select>
    </label>
  );
}

function shellStyle(variant: Props["variant"]): CSSProperties {
  return {
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
    cursor: "pointer",
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
  };
}

function selectStyle(variant: Props["variant"]): CSSProperties {
  return {
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#ffffff",
    font: "inherit",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    minWidth: variant === "compact" ? "4.5rem" : "7rem",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
  };
}
