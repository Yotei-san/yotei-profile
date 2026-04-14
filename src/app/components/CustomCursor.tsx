"use client";

import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
};

const TRAIL_COUNT = 8;

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!finePointer) return;

    const cursorEl = cursorRef.current;
    const ringEl = ringRef.current;

    if (!cursorEl || !ringEl) return;

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
        if (el) el.style.opacity = reducedMotion ? "0" : opacity;
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
        if (el) el.dataset.interactive = hoveringInteractive ? "true" : "false";
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;

      if (!visible) {
        setVisibility(true);
      }

      updateInteractiveState(event.target);
    };

    const handleMouseDown = () => {
      cursorEl.dataset.pressed = "true";
      ringEl.dataset.pressed = "true";
    };

    const handleMouseUp = () => {
      cursorEl.dataset.pressed = "false";
      ringEl.dataset.pressed = "false";
    };

    const handleMouseLeaveWindow = () => {
      setVisibility(false);
    };

    const handleMouseEnterWindow = () => {
      setVisibility(true);
    };

    const animate = () => {
      cursorEl.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;

      ring.x += (mouse.x - ring.x) * 0.18;
      ring.y += (mouse.y - ring.y) * 0.18;

      ringEl.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;

      if (!reducedMotion) {
        trailPoints[0].x += (mouse.x - trailPoints[0].x) * 0.22;
        trailPoints[0].y += (mouse.y - trailPoints[0].y) * 0.22;

        for (let i = 1; i < trailPoints.length; i++) {
          trailPoints[i].x += (trailPoints[i - 1].x - trailPoints[i].x) * 0.22;
          trailPoints[i].y += (trailPoints[i - 1].y - trailPoints[i].y) * 0.22;
        }

        for (let i = 0; i < trailRefs.current.length; i++) {
          const el = trailRefs.current[i];
          const point = trailPoints[i];

          if (!el || !point) continue;

          el.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%) scale(${1 - i * 0.06})`;
        }
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    document.documentElement.classList.add("custom-cursor-enabled");

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseleave", handleMouseLeaveWindow);
    window.addEventListener("mouseenter", handleMouseEnterWindow);

    setVisibility(false);
    rafRef.current = window.requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove("custom-cursor-enabled");

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseleave", handleMouseLeaveWindow);
      window.removeEventListener("mouseenter", handleMouseEnterWindow);

      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

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