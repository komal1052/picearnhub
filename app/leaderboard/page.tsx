import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Trophy, CheckCircle, Flame, Heart, ArrowLeft, Crown } from "lucide-react";
import { toBengaliNumber } from "@/lib/formatters";

export const revalidate = 60; // প্রতি ১ মিনিটে লাইভ র‍্যাংকিং আপডেট

export default async function LeaderboardPage() {
  const users = await prisma.user.findMany({
    include: {
      photos: {
        where: { status: "APPROVED" },
      },
    },
  });

  // মোট ভোটের ভিত্তিতে ক্রিয়েটরদের সর্ট করা
  const rankedCreators = users
    .map((u) => {
      const totalVotes = u.photos.reduce((sum, p) => sum + (p.voteCount || 0), 0);
      return {
        id: u.id,
        name: u.name || "ফটোগ্রাফার",
        avatarUrl: u.avatarUrl,
        badge: u.badge,
        location: u.location || "বাংলাদেশ",
        totalPhotos: u.photos.length,
        totalVotes,
      };
    })
    .sort((a, b) => b.totalVotes - a.totalVotes);

  return (
    <main className="min-h-screen bg-brand-bg text-brand-text px-4 md:px-8 py-10 max-w-[1100px] mx-auto space-y-8">
      
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
          <Trophy className="w-4 h-4 text-brand-gold" />
          <span>পিকআর্নহাব লিডারবোর্ড (Top Photographers)</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-black text-brand-text tracking-tight">
          শীর্ষ ফটোগ্রাফারদের র‍্যাংকিং তালিকা
        </h1>
        <p className="text-brand-muted text-xs md:text-sm max-w-lg mx-auto">
          কমিউনিটি ভোটের ভিত্তিতে পিকআর্নহাবের সেরা ক্রিয়েটরদের লাইভ অবস্থান ও ব্যাজ অর্জন।
        </p>
      </div>

      {/* টপ ৩ চ্যাম্পিয়ন পোডিয়াম হাইলাইট */}
      {rankedCreators.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-4">
          
          {/* ২য় স্থান (সিলভার) */}
          <div className="bg-white border border-brand-border rounded-3xl p-6 text-center space-y-3 shadow-sm order-2 md:order-1">
            <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-black text-sm flex items-center justify-center mx-auto shadow-sm">
              ২
            </span>
            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-300 mx-auto">
              {rankedCreators[1].avatarUrl ? (
                <img src={rankedCreators[1].avatarUrl} alt={rankedCreators[1].name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-200 font-black text-xl flex items-center justify-center text-slate-700">
                  {rankedCreators[1].name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm text-brand-text">{rankedCreators[1].name}</h4>
              <span className="text-[10px] text-brand-muted">{rankedCreators[1].location}</span>
            </div>
            <div className="text-sm font-black text-brand-purple flex items-center justify-center gap-1 font-mono">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>{toBengaliNumber(rankedCreators[1].totalVotes)} ভোট</span>
            </div>
          </div>

          {/* ১ম স্থান (গোল্ড চ্যাম্পিয়ন) */}
          <div className="bg-gradient-to-b from-amber-50 to-white border-2 border-amber-300 rounded-3xl p-6 md:p-8 text-center space-y-3 shadow-xl glow-amber order-1 md:order-2 relative -top-3">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-brand-text font-black text-[10px] px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" />
              <span>১ম স্থান (Champion)</span>
            </div>
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white border-4 border-amber-400 mx-auto shadow-md">
              {rankedCreators[0].avatarUrl ? (
                <img src={rankedCreators[0].avatarUrl} alt={rankedCreators[0].name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-amber-400 font-black text-2xl flex items-center justify-center text-brand-text">
                  {rankedCreators[0].name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-black text-base text-brand-text">{rankedCreators[0].name}</h3>
              <span className="text-[11px] text-brand-muted">{rankedCreators[0].location}</span>
            </div>
            <div className="text-base font-black text-rose-600 flex items-center justify-center gap-1 font-mono">
              <Heart className="w-5 h-5 fill-rose-500" />
              <span>{toBengaliNumber(rankedCreators[0].totalVotes)} ভোট</span>
            </div>
          </div>

          {/* ৩য় স্থান (ব্রোঞ্জ) */}
          <div className="bg-white border border-brand-border rounded-3xl p-6 text-center space-y-3 shadow-sm order-3">
            <span className="w-8 h-8 rounded-full bg-amber-700/15 text-amber-900 font-black text-sm flex items-center justify-center mx-auto shadow-sm">
              ৩
            </span>
            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border-2 border-amber-700/30 mx-auto">
              {rankedCreators[2].avatarUrl ? (
                <img src={rankedCreators[2].avatarUrl} alt={rankedCreators[2].name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-amber-100 font-black text-xl flex items-center justify-center text-amber-900">
                  {rankedCreators[2].name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm text-brand-text">{rankedCreators[2].name}</h4>
              <span className="text-[10px] text-brand-muted">{rankedCreators[2].location}</span>
            </div>
            <div className="text-sm font-black text-brand-purple flex items-center justify-center gap-1 font-mono">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>{toBengaliNumber(rankedCreators[2].totalVotes)} ভোট</span>
            </div>
          </div>

        </div>
      )}

      {/* পূর্ণাঙ্গ র‍্যাংকিং টেবিল */}
      <div className="bg-white border border-brand-border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-brand-border bg-slate-50 font-bold text-xs text-brand-muted">
          সকল ফটোগ্রাফারদের র‍্যাংকিং তালিকা
        </div>
        <div className="divide-y divide-slate-100">
          {rankedCreators.map((creator, index) => (
            <div key={creator.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  index === 0 ? "bg-amber-400 text-brand-text" : index === 1 ? "bg-slate-200 text-slate-700" : index === 2 ? "bg-amber-100 text-amber-900" : "text-brand-muted"
                }`}>
                  {toBengaliNumber(index + 1)}
                </span>

                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-brand-border flex items-center justify-center shrink-0">
                  {creator.avatarUrl ? (
                    <img src={creator.avatarUrl} alt={creator.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-sm text-brand-purple">{creator.name.charAt(0)}</span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1 font-bold text-sm text-brand-text">
                    <span>{creator.name}</span>
                    {creator.badge === "BLUE_VERIFIED" && <CheckCircle className="w-4 h-4 text-sky-500" />}
                    {creator.badge === "FIRE_CREATOR" && <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />}
                  </div>
                  <div className="text-[11px] text-brand-muted">
                    {creator.location} &bull; {toBengaliNumber(creator.totalPhotos)}টি ছবি জমা
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-black text-brand-purple font-mono">
                  {toBengaliNumber(creator.totalVotes)} ভোট
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}