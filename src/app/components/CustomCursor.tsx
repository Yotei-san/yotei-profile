"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAdaptivePerformance } from "@/app/components/PerformanceProvider";

type Point = {
  x: number;
  y: number;
};

const TRAIL_COUNT = 2;
const DISABLED_ROUTES = new Set([
  "/forgot-password",
  "/login",
  "/pricing",
  "/register",
  "/verify-email",
]);
const PUBLIC_PROFILE_ROUTE_PATTERN = /^\/[^/]+$/;

export default function CustomCursor() {
  const pathname = usePathname();
  const { profile } = useAdaptivePerformance();
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const isPublicProfileRoute =
    PUBLIC_PROFILE_ROUTE_PATTERN.test(pathname) &&
    !DISABLED_ROUTES.has(pathname);
  const shouldDisable =
    pathname.startsWith("/dashboard") ||
    DISABLED_ROUTES.has(pathname) ||
    isPublicProfileRoute ||
    !profile.allowCursorEffects;

  useEffect(() => {
    if (shouldDisable || typeof window === "undefined") {
      return;
    }

    const shouldRenderTrail = profile.tier === "high";

    const cursorEl = cursorRef.current;
    const ringEl = ringRef.current;

    if (!cursorEl || !ringEl) {
      return;
    }

    let mouse: Point = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let ring: Point = { ...mouse };
    let visible = false;
    let hoveringInteractive = false;

    const trailPoints: Point[] = Array.from({ length: TRAIL_COUNT }, () => ({
      x: mouse.x,
      y: mouse.y,
    }));

    const setVisibility = (show: boolean) => {
      visible = show;
      const opacity = show ? "1" : "0";

      cursorEl.style.opacity = opacity;
      ringEl.style.opacity = opacity;

      for (const el of trailRefs.current) {
        if (el) {
          el.style.opacity = shouldRenderTrail ? opacity : "0";
        }
      }
    };

    const updateInteractiveState = (target: EventTarget | null) => {
      if (!(target instanceof Element)) {
        hoveringInteractive = false;
      } else {
        hoveringInteractive = Boolean(
          target.closest(
            'a, button, input, textarea, select, summary, [role="button"], [data-cursor="interactive"]'
          )
        );
      }

      cursorEl.dataset.interactive = hoveringInteractive ? "true" : "false";
      ringEl.dataset.interactive = hoveringInteractive ? "true" : "false";

      for (const el of trailRefs.current) {
        if (el) {
          el.dataset.interactive = hoveringInteractive ? "true" : "false";
        }
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;

      if (!visible) {
        setVisibility(true);
      }

      updateInteractiveState(event.target);
    };

    const handlePointerDown = () => {
      cursorEl.dataset.pressed = "true";
      ringEl.dataset.pressed = "true";
    };

    const handlePointerUp = () => {
      cursorEl.dataset.pressed = "false";
      ringEl.dataset.pressed = "false";
    };

    const handleWindowLeave = () => {
      setVisibility(false);
    };

    const handleWindowEnter = () => {
      setVisibility(true);
    };

    const animate = () => {
      cursorEl.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;

      ring.x += (mouse.x - ring.x) * 0.18;
      ring.y += (mouse.y - ring.y) * 0.18;
      ringEl.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;

      if (shouldRenderTrail) {
        trailPoints[0].x += (mouse.x - trailPoints[0].x) * 0.24;
        trailPoints[0].y += (mouse.y - trailPoints[0].y) * 0.24;

        for (let i = 1; i < trailPoints.length; i++) {
          trailPoints[i].x += (trailPoints[i - 1].x - trailPoints[i].x) * 0.24;
          trailPoints[i].y += (trailPoints[i - 1].y - trailPoints[i].y) * 0.24;
        }

        for (let i = 0; i < trailRefs.current.length; i++) {
          const el = trailRefs.current[i];
          const point = trailPoints[i];

          if (!el || !point) {
            continue;
          }

          el.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%) scale(${1 - i * 0.08})`;
        }
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    document.documentElement.classList.add("custom-cursor-enabled");
    setVisibility(false);
    rafRef.current = window.requestAnimationFrame(animate);

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("mouseleave", handleWindowLeave);
    window.addEventListener("mouseenter", handleWindowEnter);

    return () => {
      document.documentElement.classList.remove("custom-cursor-enabled");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("mouseleave", handleWindowLeave);
      window.removeEventListener("mouseenter", handleWindowEnter);

      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [profile.tier, shouldDisable]);

  if (shouldDisable) {
    return null;
  }

  return (
    <>
      <div ref={cursorRef} className="yotei-cursor-core" aria-hidden="true" />
      <div ref={ringRef} className="yotei-cursor-ring" aria-hidden="true" />

      {Array.from({ length: TRAIL_COUNT }).map((_, index) => (
        <div
          key={index}
          ref={(el) => {
            trailRefs.current[index] = el;
          }}
          className="yotei-cursor-trail"
          aria-hidden="true"
        />
      ))}
    </>
  );
}
