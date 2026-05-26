"use client";

import type { ReactNode } from "react";
import CustomCursor from "./CustomCursor";
import { PerformanceProvider } from "./PerformanceProvider";

export default function AppClientShell({ children }: { children: ReactNode }) {
  return (
    <PerformanceProvider>
      <CustomCursor />
      {children}
    </PerformanceProvider>
  );
}
