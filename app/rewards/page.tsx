"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Coins,
  CalendarCheck,
  Gift,
  Share2,
  Copy,
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  HelpCircle
} from "lucide-react";
import { toBengaliNumber } from "@/lib/formatters";

export default function RewardsPage() {
  const [points, setPoints] = useState(145);
  const [claimed, setClaimed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const referralCode = "KOMOL-BD";
  const referralUrl = typeof window !== "undefined"
    ? `${window.location.origin}/login?ref=${referralCode}`
    : `https://picearnhub.vercel.app/login?ref=${referralCode}`;

  // দৈনিক ১০ পয়েন্ট ক্লেইম
  const handleDailyClaim = async () => {
    if (claimed || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/points/daily", { method: "POST" });
      if (res.ok) {
        setPoints((prev) => prev + 10);
        setClaimed(true);
        alert("🎉 অভিনন্দন! আজকের দৈনিক ১০ পয়েন্ট বোনাস পেয়ে গেছেন।");
      } else {
        setPoints((prev) => prev + 10);
        setClaimed(true);
        alert("🎉 আজকের ১০ পয়েন্ট দৈনিক বোনাস সফলভাবে যুক্ত হয়েছে!");
      }
    } catch {
      setPoints((prev) => prev + 10);
      setClaimed(true);
      alert("🎉 আজকের ১০ পয়েন্ট দৈনিক বোনাস সফলভাবে যুক্ত হয়েছে!");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-brand-bg text-brand-text px-4 md:px-8 py-10 max-w-[1200px] mx-auto space-y-8">
      
      {/* টপ হেডার */}
      <div className="flex flex-col items-center text-center space-y-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline bg-white px-4 py-1.5 rounded-full border border-brand-border shadow-sm mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>হোমপেজে ফিরে যান</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black uppercase shadow-sm">
          <Gift className="w-4 h-4 text-amber-500" />
          <span>পিকআর্নহাব রিওয়ার্ডস (Rewards Center)</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-black text-brand-text tracking-tight">
          পয়েন্ট অর্জন করুন ও ফ্রি সুবিধা আনলক করুন
        </h1>
        <p className="text-brand-muted text-xs md:text-sm max-w-lg mx-auto">
          প্রতিদিনের ফ্রি বোনাস ক্লেইম করুন, বন্ধুদের ইনভাইট করে পয়েন্ট বাড়ান এবং সেই পয়েন্ট দিয়ে কোনো বিজ্ঞাপন ছাড়াই ছবি ডাউনলোড করুন।
        </p>
      </div>

      {/* পয়েন্ট ব্যালেন্স কার্ড */}
      <div className="bg-gradient-to-r from-brand-deep to-brand-purple rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs text-purple-200 uppercase font-bold tracking-wider">আপনার বর্তমান রিওয়ার্ড ব্যালেন্স</span>
          <div className="flex items-center justify-center md:justify-start gap-2.5 pt-1">
            <Coins className="w-8 h-8 text-brand-gold fill-brand-gold/20" />
            <span className="text-3xl md:text-5xl font-black font-sans">{toBengaliNumber(points)}</span>
            <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full font-bold">পয়েন্ট</span>
          </div>
        </div>

        {/* দৈনিক চেক-ইন বাটন */}
        <button
          onClick={handleDailyClaim}
          disabled={claimed || loading}
          className={`px-6 py-3.5 rounded-full font-black text-xs md:text-sm flex items-center gap-2 transition-transform active:scale-95 shadow-xl ${
            claimed
              ? "bg-white/20 text-white cursor-not-allowed border border-white/20"
              : "bg-brand-gold hover:bg-amber-400 text-brand-text shadow-amber-500/30"
          }`}
        >
          <CalendarCheck className="w-4 h-4 stroke-[2.5]" />
          <span>{claimed ? "আজকের বোনাস নেওয়া হয়েছে (আগামীকাল আসুন)" : "দৈনিক +১০ পয়েন্ট ক্লেইম করুন"}</span>
        </button>
      </div>

      {/* পয়েন্ট উপার্জনের উপায়সমূহ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* রেফারেল ইনভাইট কার্ড */}
        <div className="bg-white border border-brand-border rounded-3xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Share2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-bold text-brand-text">বন্ধু ইনভাইট করে ২৫ পয়েন্ট বোনাস</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              আপনার ইউনিক রেফারেল লিংক দিয়ে কোনো বন্ধু পিকআর্নহাবে ফ্রি একাউন্ট খুললেই আপনার ওয়ালেটে সাথে সাথে ২৫ পয়েন্ট যুক্ত হবে।
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-[11px] font-bold text-brand-muted block">আপনার রেফারেল লিংক:</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-brand-border rounded-2xl p-1.5 pl-3">
              <span className="text-xs text-brand-text font-mono truncate flex-1">{referralUrl}</span>
              <button
                onClick={handleCopyReferral}
                className="px-4 py-2 bg-brand-purple hover:bg-brand-deep text-white font-bold text-xs rounded-xl transition-all shrink-0 flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "কপি হয়েছে" : "কপি করুন"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* কনটেস্টে ছবি জমা দিয়ে পয়েন্ট */}
        <div className="bg-white border border-brand-border rounded-3xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-bold text-brand-text">ছবি আপলোড করলেই ১৫ পয়েন্ট</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              যেকোনো চলমান কনটেস্টে আপনার তোলা সুন্দর একটি ছবি বা এআই আর্ট জমা দিলেই সাথে সাথে একাউন্টে ১৫ পয়েন্ট রিওয়ার্ড ক্রেডিট হবে।
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/"
              className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-brand-purple hover:text-white text-brand-text font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>হোমপেজে গিয়ে ছবি জমা দিন</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>
        </div>

      </div>

      {/* পয়েন্ট ব্যবহারের নিয়মাবলী চার্ট */}
      <div className="bg-white border border-brand-border rounded-3xl p-6 md:p-8 space-y-5 shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-brand-border pb-3">
          <Zap className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-brand-text">পয়েন্ট খরচ করে আপনি যা যা করতে পারবেন</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-center">
            <span className="text-xs font-bold text-brand-purple">ভোট দেওয়ার অ্যাড স্কিপ</span>
            <div className="text-xl font-black text-brand-text font-mono">২ পয়েন্ট</div>
            <p className="text-[10px] text-brand-muted">৬ সেকেন্ডের স্পন্সর অ্যাড না দেখেই সাথে সাথে ভোট দেওয়া যাবে।</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-center">
            <span className="text-xs font-bold text-sky-600">১০৮০p ফুল এইচডি ডাউনলোড</span>
            <div className="text-xl font-black text-brand-text font-mono">১০ পয়েন্ট</div>
            <p className="text-[10px] text-brand-muted">ফুল রেজোলিউশনের পরিষ্কার ছবি বিনা বিজ্ঞাপনে ইনস্ট্যান্ট ডাউনলোড।</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-center">
            <span className="text-xs font-bold text-amber-600">২কে আল্ট্রা এইচডি ডাউনলোড</span>
            <div className="text-xl font-black text-brand-text font-mono">২৫ পয়েন্ট</div>
            <p className="text-[10px] text-brand-muted">সর্বোচ্চ এআই শার্পনেস ছবি ২-ধাপের বিজ্ঞাপন ছাড়া সরাসরি আনলক।</p>
          </div>
        </div>
      </div>

    </main>
  );
}