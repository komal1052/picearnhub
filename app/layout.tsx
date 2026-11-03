import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PicEarnHub | Monetize Your Photos & Win Cash Contests",
  description: "Upload photos, win daily contests, and earn cash rewards.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  );
}