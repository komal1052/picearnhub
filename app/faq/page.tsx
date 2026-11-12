import Link from "next/link";
import { ArrowLeft, HelpCircle, Trophy, Wallet, Coins, Sparkles, ShieldCheck, CheckCircle } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      q: "পিকআর্নহাবে কীভাবে কনটেস্টে অংশগ্রহণ করব?",
      a: "প্রথমে একটি ফ্রি একাউন্ট খুলুন। এরপর হোমপেজের '＋ ছবি জমা দিন' বাটনে ক্লিক করে আপনার তোলা ছবি আপলোড করুন, উপযুক্ত ক্যাটাগরি ও কনটেস্ট বাছাই করুন এবং সাবমিট বাটনে চাপ দিন। আপনার ছবি সাথে সাথে গ্যালারিতে চলে আসবে এবং আপনি ১৫ পয়েন্ট বোনাস পাবেন।",
      icon: Trophy,
    },
    {
      q: "পুরস্কারের টাকা কীভাবে বিকাশ বা নগদে ক্যাশআউট করব?",
      a: "কনটেস্টে বিজয়ী হলে প্রাইজমানি সরাসরি আপনার পিকআর্নহাব ওয়ালেটে জমা হবে। প্রোফাইল পেজে গিয়ে 'টাকা তুলুন (Withdraw)' বাটনে ক্লিক করে বিকাশ, নগদ বা রকেট নম্বর দিয়ে রিকোয়েস্ট পাঠালেই অ্যাডমিন যাচাই করে আপনার একাউন্টে টাকা পাঠিয়ে দেবে। সর্বনিম্ন উইথড্র পরিমাণ $১০ USD।",
      icon: Wallet,
    },
    {
      q: "পয়েন্ট কীভাবে বাড়াব এবং পয়েন্ট দিয়ে কী করা যায়?",
      a: "প্রতিদিন লগইন করলে +১০ পয়েন্ট, ছবি আপলোড দিলে +১৫ পয়েন্ট এবং স্পন্সর বিজ্ঞাপন দেখলে +৫ পয়েন্ট পাওয়া যায়। পয়েন্ট ব্যবহার করে আপনি কোনো বিজ্ঞাপন দেখা ছাড়াই সাথে সাথে হাই-রেজোলিউশন (১০৮০p ও ২কে) ছবি ডাউনলোড এবং কনটেস্টে সরাসরি ভোট দিতে পারবেন।",
      icon: Coins,
    },
    {
      q: "এআই (AI) দিয়ে তৈরি ডিজিটাল আর্ট কি জমা দেওয়া যাবে?",
      a: "হ্যাঁ! Midjourney, DALL-E বা Stable Diffusion দিয়ে তৈরি ছবি অবশ্যই জমা দেওয়া যাবে। তবে আপলোড করার সময় 'ছবিটি কি AI দিয়ে তৈরি?' অপশনে টিক দিয়ে কোন টুল ব্যবহার করেছেন তা উল্লেখ করতে হবে।",
      icon: Sparkles,
    },
    {
      q: "ব্লু ভেরিফায়েড টিক (Blue Tick) এবং ফায়ার ব্যাজ কীভাবে পাব?",
      a: "আপনার জমাকৃত ছবিতে মোট ৫০টি ভেরিফায়েড ভোট পূর্ণ হলে আপনার নামের পাশে স্বয়ংক্রিয়ভাবে ব্লু টিক চলে আসবে। আর ১০০টি ভোট পূর্ণ হলে সম্মানজনক ফায়ার ব্যাজ 🔥 আনলক হবে।",
      icon: CheckCircle,
    },
    {
      q: "ভোট দেওয়ার নিয়ম কী এবং ফ্রিতে কীভাবে ভোট দেওয়া যায়?",
      a: "যেকোনো ছবির নিচে 'ভোট দিন' বাটনে চাপ দিয়ে ৬ সেকেন্ডের একটি স্পন্সর বিজ্ঞাপন দেখে ভোট নিশ্চিত করা যায়। এছাড়া আপনার একাউন্টে পয়েন্ট থাকলে মাত্র ২ পয়েন্ট খরচ করে বিজ্ঞাপন ছাড়াও এক ক্লিকে ভোট দেওয়া সম্ভব।",
      icon: ShieldCheck,
    },
  ];

  return (
    <main className="min-h-screen bg-brand-bg text-brand-text px-4 md:px-8 py-10 max-w-[1100px] mx-auto space-y-8">
      
      {/* টপ হেডার */}
      <div className="flex flex-col items-center text-center space-y-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline bg-white px-4 py-1.5 rounded-full border border-brand-border shadow-sm mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>হোমপেজে ফিরে যান</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-brand-purple text-xs font-bold uppercase shadow-sm">
          <HelpCircle className="w-4 h-4" />
          <span>সাধারণ জিজ্ঞাসা ও সাহায্য (FAQ)</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-black text-brand-text tracking-tight">
          সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর
        </h1>
        <p className="text-brand-muted text-xs md:text-sm max-w-lg mx-auto">
          পিকআর্নহাব ব্যবহার, কনটেস্টের নিয়মাবলী, বিকাশ/নগদ পেমেন্ট এবং রিওয়ার্ড পয়েন্ট সংক্রান্ত সকল প্রশ্নের সুস্পষ্ট উত্তর।
        </p>
      </div>

      {/* প্রশ্নোত্তরের গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {faqs.map((faq, index) => {
          const Icon = faq.icon;
          return (
            <div key={index} className="bg-white border border-brand-border rounded-3xl p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h3 className="font-bold text-sm text-brand-text leading-snug">{faq.q}</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-12 font-sans font-normal">
                {faq.a}
              </p>
            </div>
          );
        })}
      </div>

      {/* সরাসরি যোগাযোগের বক্স */}
      <div className="bg-gradient-to-r from-brand-deep to-brand-purple text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl text-center md:text-left">
        <div className="space-y-1">
          <h3 className="text-lg md:text-xl font-bold">অন্য কোনো প্রশ্ন বা সাহায্য প্রয়োজন?</h3>
          <p className="text-xs text-slate-200">আমাদের অফিসিয়াল হোয়াটসঅ্যাপ হেল্পলাইনে সরাসরি যোগাযোগ করতে পারেন।</p>
        </div>
        <a
          href="https://wa.me/8801700000000"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2.5 rounded-full bg-brand-gold text-brand-text font-black text-xs hover:bg-amber-400 transition-colors shadow-lg shrink-0"
        >
          হোয়াটসঅ্যাপে মেসেজ দিন
        </a>
      </div>

    </main>
  );
}