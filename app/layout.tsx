import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PicEarnHub | Photo Contests & Community Rewards",
  description: "Upload photography, compete in contests, and earn rewards on PicEarnHub.",
};

export const viewport: Viewport = {
  themeColor: "#6339DF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-brand-bg text-brand-text min-h-screen selection:bg-brand-purple selection:text-white">
        {children}
      </body>
    </html>
  );
}
