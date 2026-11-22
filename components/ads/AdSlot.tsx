"use client";

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
  return (
    <div className="flex flex-col items-center justify-center overflow-hidden my-2">
      <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">
        SPONSORED ADVERTISEMENT
      </span>
      <div 
        style={{ width: `${width}px`, height: `${height}px` }}
        className="rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center shadow-inner"
      >
        <iframe
          src="/ad-300x250.html"
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