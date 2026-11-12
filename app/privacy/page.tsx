import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-brand-bg text-brand-text px-4 md:px-8 py-10 max-w-[900px] mx-auto space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline bg-white px-4 py-1.5 rounded-full border border-brand-border shadow-sm mb-1"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>হোমপেজে ফিরে যান</span>
      </Link>

      <div className="bg-white border border-brand-border rounded-3xl p-6 md:p-10 space-y-6 shadow-sm">
        <div className="border-b border-brand-border pb-4 space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-brand-text">গোপনীয়তা নীতি (Privacy Policy)</h1>
          <p className="text-xs text-brand-muted">পিকআর্নহাব ব্যবহারকারীদের ব্যক্তিগত তথ্যের নিরাপত্তা ও সুরক্ষার অঙ্গীকার।</p>
        </div>

        <div className="space-y-4 text-xs text-slate-600 leading-relaxed font-sans">
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-brand-text flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>আমরা কোন তথ্য সংগ্রহ করি?</span>
            </h3>
            <p>
              রেজিস্ট্রেশনের সময় আপনার নাম ও ইমেইল ঠিকানা নেওয়া হয়। বিকাশ/নগদ পেমেন্ট উইথড্র করার জন্য আপনার দেওয়া মোবাইল নম্বরটি কেবল পেমেন্ট পাঠানোর কাজেই ব্যবহৃত হয়।
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="font-bold text-sm text-brand-text flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-purple" />
              <span>তথ্যের নিরাপত্তা</span>
            </h3>
            <p>
              আপনার পাসওয়ার্ড এবং লেনদেনের তথ্য আধুনিক এনক্রিপশন প্রযুক্তির মাধ্যমে সুরক্ষিত থাকে। পিকআর্নহাব কোনো অবস্থাতেই ব্যবহারকারীর ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রয় বা শেয়ার করে না।
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}