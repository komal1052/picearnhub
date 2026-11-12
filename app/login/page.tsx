"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, Sparkles, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        alert(isRegister ? "একাউন্ট সফলভাবে তৈরি হয়েছে! ৫০ পয়েন্ট বোনাস যুক্ত হয়েছে 🎉" : "সফলভাবে লগইন হয়েছে!");
        window.location.href = "/";
      } else {
        alert(data.error || "কার্যক্রম ব্যর্থ হয়েছে।");
      }
    } catch {
      alert("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-bg text-brand-text flex items-center justify-center p-4">
      <div className="bg-white border border-brand-border rounded-3xl max-w-md w-full p-8 space-y-6 shadow-xl relative">
        
        {/* হোমপেজে ফেরার বাটন */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>হোমপেজে ফিরে যান</span>
        </Link>

        {/* লোগো ও শিরোনাম */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-brand-deep to-brand-purple text-white shadow-lg shadow-brand-purple/25 mb-1">
            <Camera className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black text-brand-text tracking-tight">
            {isRegister ? "নতুন একাউন্ট তৈরি করুন" : "পিকআর্নহাবে লগইন করুন"}
          </h1>
          <p className="text-xs text-brand-muted">
            ছবি আপলোড করতে, ভোট দিতে ও বিকাশ/নগদে টাকা তুলতে একাউন্টে প্রবেশ করুন।
          </p>
        </div>

        {/* ওয়েলকাম বোনাস কলআউট */}
        {isRegister && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-2.5 text-xs text-amber-900 font-bold">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
            <span>রেজিস্টার করলেই পাবেন ৫০ পয়েন্ট ফ্রি ওয়েলকাম বোনাস!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-[11px] font-semibold text-brand-muted block mb-1">আপনার পূর্ণ নাম</label>
              <input
                type="text"
                required
                placeholder="যেমন: তানভীর আহমেদ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-sans"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-brand-muted block mb-1">ইমেইল অ্যাড্রেস</label>
            <input
              type="email"
              required
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-brand-muted block mb-1">পাসওয়ার্ড</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-brand-purple to-brand-deep hover:opacity-95 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md shadow-brand-purple/20"
          >
            <span>
              {loading ? "প্রসেসিং হচ্ছে..." : isRegister ? "একাউন্ট তৈরি করুন (+৫০ পয়েন্ট)" : "লগইন করুন"}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-2 border-t border-brand-border text-center">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-brand-muted hover:text-brand-purple font-semibold transition-colors"
          >
            {isRegister ? "আগে থেকেই একাউন্ট আছে? লগইন করুন" : "নতুন ব্যবহারকারী? ফ্রি একাউন্ট খুলুন (+৫০ পয়েন্ট)"}
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-brand-muted pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>১০০% নিরাপদ ও এনক্রিপ্টেড প্ল্যাটফর্ম</span>
        </div>

      </div>
    </main>
  );
}