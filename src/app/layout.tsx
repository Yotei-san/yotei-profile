import type { Metadata } from "next";
import "./globals.css";
import AppClientShell from "./components/AppClientShell";
import { getRequestLocale } from "@/app/lib/i18n";

export const metadata: Metadata = {
  title: "Yotei Profile",
  description:
    "Premium profile pages with links, creator identity, and visual customization.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/brand/yotei-orbital-mark.svg", type: "image/svg+xml" },
      { url: "/brand/yotei-icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/yotei-icon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialLocale = await getRequestLocale();

  return (
    <html lang={initialLocale}>
      <body>
        <AppClientShell initialLocale={initialLocale}>{children}</AppClientShell>
      </body>
    </html>
  );
}
