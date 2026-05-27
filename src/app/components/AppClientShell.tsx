"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import CustomCursor from "./CustomCursor";
import { I18nProvider } from "./I18nProvider";
import { PerformanceProvider } from "./PerformanceProvider";
import type { Locale } from "@/app/lib/i18n";

export default function AppClientShell({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: Locale;
}) {
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
    <I18nProvider initialLocale={initialLocale}>
      <PerformanceProvider>
        <CustomCursor />
        {children}
      </PerformanceProvider>
    </I18nProvider>
  );
}
