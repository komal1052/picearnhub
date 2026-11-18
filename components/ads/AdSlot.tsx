"use client";

import { useEffect, useState } from "react";

interface AdSlotProps {
  zoneId?: string;
  width?: number;
  height?: number;
}

export default function AdSlot({
  zoneId = process.env.NEXT_PUBLIC_ADSTERRA_300x250_ZONE_ID || "32346376",
  width = 300,
  height = 250,
}: AdSlotProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !zoneId) return null;

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden my-2">
      <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">
        Sponsored Advertisement
      </span>
      <div className="w-[300px] h-[250px] rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center shadow-inner">
        <iframe
          srcDoc={`
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
                </style>
              </head>
              <body>
                <script type="text/javascript">
                  atOptions = {
                    'key' : '${zoneId}',
                    'format' : 'iframe',
                    'height' : ${height},
                    'width' : ${width},
                    'params' : {}
                  };
                </script>
                <script type="text/javascript" src="//www.highperformanceformat.com/${zoneId}/invoke.js"></script>
              </body>
            </html>
          `}
          width={width}
          height={height}
          style={{ border: "none", overflow: "hidden" }}
          scrolling="no"
          title="Adsterra 300x250"
        />
      </div>
    </div>
  );
}