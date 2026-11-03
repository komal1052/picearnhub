"use client";

import { useEffect } from "react";

export default function SocialBar() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_KEY;
    if (!key || key.includes("your_social_bar_key")) return;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `//pl${key}.profitablecpmrate.com/${key}/invoke.js`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // Renders floating overlays directly via Adsterra's script
}