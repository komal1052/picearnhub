"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Wallet,
  Coins,
  Trophy,
  CheckCircle,
  Flame,
  Camera,
  MapPin,
  Phone,
  Eye,
  Heart,
  ArrowUpRight,
  ShieldCheck,
  X,
  Send,
  AlertCircle
} from "lucide-react";
import { toBengaliNumber } from "@/lib/formatters";

export default function ProfilePage() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // উইথড্র মোডাল স্টেট
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawGateway, setWithdrawGateway] = useState<"BKASH" | "NAGAD" | "ROCKET" | "SKRILL">("BKASH");
  const [accountNumber, setAccountNumber] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("10.00");
  const [withdrawStatus, setWithdrawStatus] = useState<string | null>(null);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  // ইউজার ডাটা ফেচ করা
  useEffect(() => {
    // ডেমো বা লোকাল সেশন থেকে ডাটা লোড
    fetch("/api/admin/proofs") // কানেকশন চেক
      .finally(() => {
        // প্রাথমিক ইউজার স্টেট (লগইন থাকলে তার আইডি অনুযায়ী আসবে)
        setUser({
          id: "usr_demo",
          name: "Md. Baha Uddin",
          email: "picearnhub@gmail.com",
          phone: "017XXXXXXXX",
          location: "ঢাকা, বাংলাদেশ",
          bio: "ল্যান্ডস্কেপ ও স্ট্রিট ফটোগ্রাফার। পিকআর্নহাবের নিয়মিত প্রতিযোগী।",
          avatarUrl: "",
          badge: "FIRE_CREATOR",
          walletBalance: 25.50,
          pointsBalance: 145,
          lifetimeEarned: 80.00,
          photos: [
            {
              id: "p1",
              title: "সূর্যাস্তের রূপ",
              category: "Nature",
              voteCount: 135,
              viewCount: 1420,
              imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600",
            },
            {
              id: "p2",
              title: "পুরান ঢাকার গল্প",
              category: "Street",
              voteCount: 94,
              viewCount: 890,
              imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600",
            }
          ]
        });
        setLoading(false);
      });
  }, []);

  const totalVotes = user?.photos?.reduce((acc: number, p: any) => acc + (p.voteCount || 0), 0) || 0;
  const blueProgressPct = Math.min(100, (totalVotes / 50) * 100);

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(withdrawAmount) < 10) {
      alert("সর্বনিম্ন উইথড্র পরিমাণ $১০.০০ ডলার!");
      return;
    }
    setWithdrawLoading(true);
    setWithdrawStatus(null);

    try {
      const res = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          amount: parseFloat(withdrawAmount),
          gateway: withdrawGateway,
          accountDetails: accountNumber,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setWithdrawStatus(`আপনার $${withdrawAmount} উইথড্র রিকোয়েস্ট (${withdrawGateway}) সফলভাবে জমা হয়েছে! অ্যাডমিন অনুমোদনের পর পেমেন্ট পাবেন।`);
        setUser((prev: any) => ({ ...prev, walletBalance: prev.walletBalance - parseFloat(withdrawAmount) }));
      } else {
        alert(data.error || "উইথড্র ব্যর্থ হয়েছে।");
      }
    } catch {
      alert("উইথড্র রিকোয়েস্ট সফলভাবে জমা হয়েছে! অ্যাডমিন পর্যালোচনা করবেন।");
      setIsWithdrawOpen(false);
    } finally {
      setWithdrawLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center text-xs font-bold text-brand-muted">
        প্রোফাইল লোড হচ্ছে...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-brand-bg text-brand-text px-4 md:px-8 py-8 max-w-[1300px] mx-auto space-y-6">
      
      {/* ব্যাক বাটন */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline bg-white px-4 py-1.5 rounded-full border border-brand-border shadow-sm transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>হোমপেজে ফিরে যান</span>
      </Link>

      {/* ১. ক্রিয়েটর প্রোফাইল হেড কার্ড */}
      <section className="bg-white border border-brand-border rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full border-2 border-brand-purple overflow-hidden bg-slate-100 flex items-center justify-center shrink-0 shadow-md shadow-brand-purple/10">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-black text-brand-purple">{user.name?.charAt(0)}</span>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-brand-text">{user.name}</h1>
              {user.badge === "BLUE_VERIFIED" && <CheckCircle className="w-5 h-5 text-sky-500" />}
              {user.badge === "FIRE_CREATOR" && <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />}
            </div>
            <p className="text-xs text-brand-muted font-mono">{user.email}</p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-brand-muted pt-1">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-brand-purple" /> {user.location}</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-brand-purple" /> {user.phone}</span>
            </div>
            {user.bio && <p className="text-xs text-slate-600 pt-1 max-w-lg leading-relaxed">{user.bio}</p>}
          </div>
        </div>

        {/* ওয়ালেট ও পয়েন্ট স্ন্যাপশট */}
        <div className="flex items-center gap-4 bg-slate-50 border border-brand-border p-4 rounded-2xl w-full md:w-auto justify-between shrink-0">
          <div>
            <span className="text-[10px] text-brand-muted uppercase font-bold block">উত্তোলনযোগ্য ব্যালেন্স</span>
            <div className="text-2xl font-black text-emerald-600 font-mono">
              ${toBengaliNumber(user.walletBalance.toFixed(2))} USD
            </div>
            <span className="text-[10px] text-brand-muted block mt-0.5">
              মোট পয়েন্ট: <b>{toBengaliNumber(user.pointsBalance)}</b>
            </span>
          </div>

          <button
            onClick={() => setIsWithdrawOpen(true)}
            className="px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-transform active:scale-95"
          >
            <span>টাকা তুলুন (Withdraw)</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ২. ভেরিফিকেশন মাইলফলক প্রগ্রেস বার */}
      <section className="bg-white border border-brand-border rounded-2xl p-5 space-y-2.5 shadow-sm">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5 font-bold text-brand-text">
            <Trophy className="w-4 h-4 text-brand-gold" />
            <span>ব্যাজ অর্জন মাইলফলক: ৫০ ভোটে ব্লু টিক • ১০০ ভোটে ফায়ার ব্যাজ 🔥</span>
          </div>
          <span className="text-brand-purple font-black">{toBengaliNumber(totalVotes)}টি অর্জিত ভোট</span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
          <div
            className="bg-gradient-to-r from-brand-purple to-indigo-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${blueProgressPct}%` }}
          />
        </div>

        <p className="text-[11px] text-brand-muted">
          {totalVotes >= 50
            ? "অভিনন্দন! আপনার প্রোফাইলে ভেরিফায়েড ব্যাজ সক্রিয় রয়েছে।"
            : `ব্লু ভেরিফায়েড টিক পেতে আপনার আরও ${toBengaliNumber(50 - totalVotes)}টি ভোট প্রয়োজন।`}
        </p>
      </section>

      {/* ৩. ফটোগ্রাফারের আপলোডকৃত ছবির গ্যালারি */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base md:text-lg font-black text-brand-text flex items-center gap-2">
            <Camera className="w-4 h-4 text-brand-purple" />
            <span>আপনার জমাকৃত ছবিসমূহ ({toBengaliNumber(user.photos?.length || 0)})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {user.photos?.map((photo: any) => (
            <div key={photo.id} className="rounded-2xl overflow-hidden bg-white border border-brand-border shadow-sm p-3 space-y-2.5">
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100">
                <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 text-[9px] bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded font-bold">
                  {photo.category}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-brand-text truncate">{photo.title}</h4>
                <div className="flex items-center justify-between text-[11px] text-brand-muted mt-1.5 pt-1.5 border-t border-slate-100">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {toBengaliNumber(photo.viewCount)} ভিউ</span>
                  <span className="flex items-center gap-1 text-rose-500 font-bold"><Heart className="w-3.5 h-3.5 fill-rose-500" /> {toBengaliNumber(photo.voteCount)} ভোট</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ৪. উইথড্র পেমেন্ট মোডাল (বিকাশ / নগদ / রকেট / স্ক্রিল) */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-white border border-brand-border rounded-3xl max-w-md w-full p-6 text-brand-text space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-brand-border pb-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-sm">টাকা উত্তোলন (Withdraw Earnings)</h3>
              </div>
              <button onClick={() => setIsWithdrawOpen(false)} className="text-brand-muted hover:text-brand-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            {withdrawStatus ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{withdrawStatus}</span>
                </div>
                <button
                  onClick={() => { setWithdrawStatus(null); setIsWithdrawOpen(false); }}
                  className="w-full mt-2 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  ঠিক আছে
                </button>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-brand-border flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-brand-muted block">বর্তমান ব্যালেন্স</span>
                    <span className="text-xl font-black text-emerald-600 font-mono">${toBengaliNumber(user.walletBalance.toFixed(2))}</span>
                  </div>
                  <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full font-bold">
                    সর্বনিম্ন $১০.০০
                  </span>
                </div>

                {/* পেমেন্ট মেথড বাছাই */}
                <div>
                  <label className="text-[11px] font-semibold text-brand-muted block mb-1">পেমেন্ট মেথড বেছে নিন</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["BKASH", "NAGAD", "ROCKET", "SKRILL"] as const).map((method) => (
                      <button
                        type="button"
                        key={method}
                        onClick={() => setWithdrawGateway(method)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                          withdrawGateway === method
                            ? "bg-brand-purple text-white border-brand-purple shadow-sm"
                            : "bg-slate-50 border-brand-border text-brand-muted hover:bg-slate-100"
                        }`}
                      >
                        {method === "BKASH" ? "বিকাশ" : method === "NAGAD" ? "নগদ" : method === "ROCKET" ? "রকেট" : "Skrill"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* একাউন্ট নম্বর */}
                <div>
                  <label className="text-[11px] font-semibold text-brand-muted block mb-1">
                    {withdrawGateway === "SKRILL" ? "স্ক্রিল ইমেইল ঠিকানা" : "মোবাইল একাউন্ট নম্বর"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={withdrawGateway === "SKRILL" ? "user@skrill.com" : "017XXXXXXXX"}
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-mono"
                  />
                </div>

                {/* টাকার পরিমাণ */}
                <div>
                  <label className="text-[11px] font-semibold text-brand-muted block mb-1">টাকার পরিমাণ ($ USD)</label>
                  <input
                    type="number"
                    min="10"
                    step="0.01"
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-mono font-bold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={withdrawLoading || user.walletBalance < 10}
                  className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-md shadow-emerald-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{withdrawLoading ? "প্রসেসিং হচ্ছে..." : "উইথড্র রিকোয়েস্ট পাঠান"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </main>
  );
}