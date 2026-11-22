"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
  zoneId?: string;
  width?: number;
  height?: number;
}

export default function AdSlot({
  zoneId = "32346376",
  width = 300,
  height = 250,
}: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !zoneId) return;

    // আগের কন্টেন্ট ক্লিয়ার করা
    containerRef.current.innerHTML = "";

    // Adsterra কনফিগারেশন স্ক্রিপ্ট
    const confScript = document.createElement("script");
    confScript.type = "text/javascript";
    confScript.text = `
      atOptions = {
        'key' : '${zoneId}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;

    // Adsterra আসল ব্যানার লোডার স্ক্রিপ্ট
    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = `https://www.highperformanceformat.com/${zoneId}/invoke.js`;
    invokeScript.async = true;

    containerRef.current.appendChild(confScript);
    containerRef.current.appendChild(invokeScript);
  }, [zoneId, width, height]);

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden my-2">
      <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">
        Sponsored Advertisement
      </span>
      <div
        ref={containerRef}
        style={{ minWidth: `${width}px`, minHeight: `${height}px` }}
        className="w-[300px] h-[250px] rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center shadow-inner"
      />
    </div>
  );
}