import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "./components/CustomCursor";

export const metadata: Metadata = {
  title: "Yotei Profile",
  description:
    "Premium profile pages with links, creator identity, and visual customization.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
