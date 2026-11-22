import type { Metadata, Viewport } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://picearnhub.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PicEarnHub | বাংলাদেশের সেরা ফটোগ্রাফি কনটেস্ট ও আর্নিং প্ল্যাটফর্ম",
    template: "%s | PicEarnHub",
  },
  description:
    "পিকআর্নহাবে ছবি আপলোড করুন, প্রতিদিনের ২৪ ঘণ্টা ও ৩০ দিনের ফটো কনটেস্টে অংশ নিন, নগদ বিকাশ ও নগদ প্রাইজমানি জিতে নিন।",
  keywords: [
    "PicEarnHub",
    "পিকআর্নহাব",
    "ফটো কনটেস্ট বাংলাদেশ",
    "ছবি আপলোড করে টাকা আয়",
    "ফটোগ্রাফি প্রতিযোগিতা",
    "Photography Contest Bangladesh",
    "Earn Money from Photos",
    "বিকাশ পেমেন্ট ফটো কনটেস্ট",
  ],
  authors: [{ name: "Md. Baha Uddin", url: siteUrl }],
  creator: "Md. Baha Uddin",
  publisher: "PicEarnHub",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: siteUrl,
    siteName: "PicEarnHub",
    title: "PicEarnHub | ছবি আপলোড করুন ও নগদ পুরস্কার জিতে নিন",
    description:
      "বাংলাদেশের সেরা ফটোগ্রাফি কনটেস্ট প্ল্যাটফর্ম। ছবি জমা দিয়ে জিতে নিন নগদ বিকাশ ও নগদ ক্যাশ রিওয়ার্ড।",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "PicEarnHub Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PicEarnHub | ফটোগ্রাফি কনটেস্ট ও রিওয়ার্ড",
    description: "ছবি আপলোড করুন, ভোট পান ও নগদ অর্থ জিতে নিন।",
  },
  alternates: {
    canonical: siteUrl,
  },
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
  // Schema.org Structured Data for Google & AI Platforms
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "PicEarnHub",
        "url": siteUrl,
        "logo": `${siteUrl}/logo.png`,
        "sameAs": ["https://wa.me/8801700000000"],
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "picearnhub@gmail.com",
          "contactType": "Customer Support",
          "areaServed": "BD",
          "availableLanguage": ["Bengali", "English"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "PicEarnHub",
        "description": "বাংলাদেশের সেরা ফটোগ্রাফি কনটেস্ট ও আর্নিং প্ল্যাটফর্ম",
        "publisher": { "@id": `${siteUrl}/#organization` },
        "inLanguage": "bn-BD",
      },
    ],
  };

  return (
    <html lang="bn" className={`scroll-smooth ${hindSiliguri.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-brand-bg text-brand-text font-sans antialiased min-h-screen selection:bg-brand-purple selection:text-white">
        {children}
      </body>
    </html>
  );
}