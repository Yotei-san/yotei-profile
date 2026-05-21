"use client";

import type { CSSProperties, ReactNode } from "react";
import { Component } from "react";

type Props = {
  children: ReactNode;
  label?: string;
  fallback?: ReactNode;
  resetKey?: string | number | null;
  compact?: boolean;
};

type State = {
  hasError: boolean;
};

export default class ProfileRenderBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  override componentDidCatch(error: unknown) {
    console.error("Profile render boundary recovered from a widget failure.", error);
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={fallbackStyle(this.props.compact ?? false)}>
          <div style={fallbackEyebrowStyle}>Renderer fallback</div>
          <div style={fallbackTitleStyle}>
            {this.props.label ? `${this.props.label} is unavailable right now.` : "This section is unavailable right now."}
          </div>
          <div style={fallbackCopyStyle}>
            The rest of the profile keeps rendering so the page never goes blank.
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function fallbackStyle(compact: boolean): CSSProperties {
  return {
    display: "grid",
    gap: compact ? "6px" : "8px",
    minWidth: 0,
    padding: compact ? "14px" : "18px",
    borderRadius: compact ? "18px" : "22px",
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015)), rgba(8,10,15,0.82)",
    color: "#e5edf8",
  };
}

const fallbackEyebrowStyle: CSSProperties = {
  width: "fit-content",
  minHeight: "28px",
  padding: "0 10px",
  borderRadius: "999px",
  display: "inline-flex",
  alignItems: "center",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#f9a8d4",
  fontSize: "11px",
  fontWeight: 900,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const fallbackTitleStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 800,
  lineHeight: 1.45,
};

const fallbackCopyStyle: CSSProperties = {
  color: "#aab6cf",
  fontSize: "13px",
  lineHeight: 1.6,
};
