"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import CustomCursor from "./CustomCursor";
import { PerformanceProvider } from "./PerformanceProvider";

export default function AppClientShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const shouldHideScrollbarChrome =
      pathname === "/" || pathname === "/pricing" || pathname === "/leaderboard";

    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    htmlElement.classList.toggle("yotei-public-route", shouldHideScrollbarChrome);
    bodyElement.classList.toggle("yotei-public-route", shouldHideScrollbarChrome);

    return () => {
      htmlElement.classList.remove("yotei-public-route");
      bodyElement.classList.remove("yotei-public-route");
    };
  }, [pathname]);

  return (
    <PerformanceProvider>
      <CustomCursor />
      {children}
    </PerformanceProvider>
  );
}
