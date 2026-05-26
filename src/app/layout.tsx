import type { Metadata } from "next";
import "./globals.css";
import AppClientShell from "./components/AppClientShell";
import { getRequestLocale } from "@/app/lib/i18n";

export const metadata: Metadata = {
  title: "Yotei Profile",
  description:
    "Premium profile pages with links, creator identity, and visual customization.",
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
