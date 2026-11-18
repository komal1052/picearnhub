"use client";

import { useEffect } from "react";

export default function SocialBar() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_KEY || "32346419";
    if (!key) return;

    // Adsterra Social Bar script loader
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `//www.highperformanceformat.com/${key}/invoke.js`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      try {
        document.body.removeChild(script);
      } catch {
        // ignore if already removed
      }
    };
  }, []);

  return null;
}