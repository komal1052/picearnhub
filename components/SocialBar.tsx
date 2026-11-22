"use client";

import { useEffect } from "react";

export default function SocialBar() {
  useEffect(() => {
    // Adsterra Social Bar আসল স্ক্রিপ্ট লোডার
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://bicea.org/14/351634b4c0dbc8d6e70c8df13d982540";
    script.async = true;
    script.setAttribute("data-cfasync", "false");
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