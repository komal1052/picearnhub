import Link from "next/link";
import { ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function TermsPage() {
  const rules = [
    {
      title: "১. ছবির কপিরাইট ও মালিকানা",
      desc: "প্ল্যাটফর্মে আপলোডকৃত যেকোনো ছবির কপিরাইট সম্পূর্ণভাবে আপলোডকারী ফটোগ্রাফারের থাকবে। পিকআর্নহাব কেবল কনটেস্ট প্রদর্শন ও গ্যালারিতে দেখানোর স্বত্বাধিকার রাখবে। অন্যের ছবি চুরি বা কপি করে জমা দেওয়া সম্পূর্ণ নিষিদ্ধ।"
    },
    {
      title: "২. ফেয়ার ভোটিং ও বট ব্যবহার নিষিদ্ধ",
      desc: "কনটেস্টে ফেয়ার প্লে বজায় রাখতে কোনো ধরনের অটো-ক্লিকার, ভিপিএন বা স্ক্রিপ্ট ব্যবহার করে ভোট দেওয়া নিষিদ্ধ। সিস্টেম যদি কোনো অস্বাভাবিক বট ট্র্যাফিক শনাক্ত করে, সংশ্লিষ্ট ছবিটি স্বয়ংক্রিয়ভাবে অযোগ্য ঘোষিত হতে পারে।"
    },
    {
      title: "৩. প্রাইজমানি ও উইথড্র পলিসি",
      desc: "কনটেস্টে বিজয়ী হলে প্রাইজমানি সরাসরি ইউজারের পিকআর্নহাব ওয়ালেটে জমা হবে। সর্বনিম্ন $১০ USD সমমূল্যের টাকা বিকাশ, নগদ বা রকেটে উইথড্র করা যাবে। অ্যাডমিন রিভিউ সম্পন্ন হওয়ার পর ২৪-৪৮ ঘণ্টার মধ্যে টাকা পরিশোধ করা হয়।"
    },
    {
      title: "৪. এআই (AI) আর্ট সংক্রান্ত নীতিমালা",
      desc: "কৃত্রিম বুদ্ধিমত্তা দিয়ে তৈরি ছবি অবশ্যই আপলোড করার সময় 'এআই আর্ট' হিসেবে চিহ্নিত করতে হবে। এআই দিয়ে তৈরি ছবিকে আসল ক্যামেরা ফটোগ্রাফি হিসেবে দাবি করা নিয়মভঙ্গ হিসেবে গণ্য হবে।"
    },
    {
      title: "৫. আপত্তিকর কনটেন্ট নিষিদ্ধকরণ",
      desc: "যেকোনো ধরনের সহিংস, প্রাপ্তবয়স্ক বা ক্ষতিকর ছবি প্ল্যাটফর্মের এআই মডারেশন স্বয়ংক্রিয়ভাবে ডিলিট করবে এবং সংশ্লিষ্ট ইউজারের একাউন্ট স্থায়ীভাবে ব্যান করা হবে।"
    }
  ];

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
          <h1 className="text-2xl md:text-3xl font-black text-brand-text">ব্যবহারের সাধারণ নিয়মাবলী ও শর্তাবলী (Terms of Service)</h1>
          <p className="text-xs text-brand-muted">সর্বশেষ হালনাগাদ: নভেম্বর ২০২৬</p>
        </div>

        <div className="space-y-5">
          {rules.map((rule, idx) => (
            <div key={idx} className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="font-bold text-sm text-brand-text flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-purple shrink-0" />
                <span>{rule.title}</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-6 font-normal font-sans">{rule.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}