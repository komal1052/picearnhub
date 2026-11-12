"use client";

import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("ধন্যবাদ! আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। খুব দ্রুত আমাদের টিম আপনার সাথে যোগাযোগ করবে।");
  };

  return (
    <main className="min-h-screen bg-brand-bg text-brand-text px-4 md:px-8 py-10 max-w-[1000px] mx-auto space-y-8">
      
      {/* টপ ব্যাক বাটন */}
      <div className="flex flex-col items-center text-center space-y-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline bg-white px-4 py-1.5 rounded-full border border-brand-border shadow-sm mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>হোমপেজে ফিরে যান</span>
        </Link>

        <h1 className="text-2xl md:text-4xl font-black text-brand-text tracking-tight">
          যোগাযোগ ও সাপোর্ট হেল্পলাইন
        </h1>
        <p className="text-brand-muted text-xs md:text-sm max-w-md mx-auto">
          পিকআর্নহাব সংক্রান্ত যেকোনো প্রশ্ন, পেমেন্ট সংক্রান্ত জিজ্ঞাসা বা সাহায্যের জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* কন্টাক্ট চ্যানেলসমূহ */}
        <div className="space-y-4">
          <div className="bg-white border border-brand-border rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-brand-text border-b border-brand-border pb-3">সরাসরি সাপোর্ট চ্যানেল</h3>
            
            <a
              href="https://wa.me/8801700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-900 block">হোয়াটসঅ্যাপ হেল্পলাইন</span>
                <span className="text-[11px] text-emerald-700">সরাসরি মেসেজ দিতে ক্লিক করুন (২৪/৭)</span>
              </div>
            </a>

            <a
              href="mailto:picearnhub@gmail.com"
              className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-brand-border transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-purple text-white flex items-center justify-center shrink-0 shadow-md shadow-brand-purple/20">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-brand-text block">অফিসিয়াল ইমেইল সাপোর্ট</span>
                <span className="text-[11px] text-brand-muted font-mono">picearnhub@gmail.com</span>
              </div>
            </a>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-brand-border">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-brand-text block">অফিসিয়াল অবস্থান</span>
                <span className="text-[11px] text-brand-muted">ঢাকা, বাংলাদেশ</span>
              </div>
            </div>
          </div>
        </div>

        {/* মেসেজ ফর্ম */}
        <div className="bg-white border border-brand-border rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-brand-text border-b border-brand-border pb-3">আমাদের বার্তা পাঠান</h3>
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-semibold text-brand-muted block mb-1">আপনার নাম</label>
              <input
                type="text"
                required
                placeholder="যেমন: তানভীর আহমেদ"
                className="w-full bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2 text-xs text-brand-text focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-brand-muted block mb-1">আপনার ইমেইল বা হোয়াটসঅ্যাপ নম্বর</label>
              <input
                type="text"
                required
                placeholder="017XXXXXXXX বা name@gmail.com"
                className="w-full bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-brand-muted block mb-1">আপনার বার্তা / অভিযোগ / জিজ্ঞাসা</label>
              <textarea
                rows={4}
                required
                placeholder="আপনার বিষয়টি বিস্তারিত লিখুন..."
                className="w-full bg-slate-50 border border-brand-border rounded-xl p-3 text-xs text-brand-text focus:outline-none focus:border-brand-purple resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-brand-purple hover:bg-brand-deep text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-md shadow-brand-purple/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>মেসেজ পাঠান</span>
            </button>
          </form>
        </div>

      </div>

    </main>
  );
}