import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Trophy, CheckCircle, Flame, Calendar, ArrowLeft, Heart } from "lucide-react";
import { toBengaliNumber, toBengaliDate } from "@/lib/formatters";

export const revalidate = 300;

export default async function HallOfFamePage() {
  const completedContests = await prisma.contest.findMany({
    where: { status: "COMPLETED" },
    orderBy: { endTime: "desc" },
    take: 20,
    include: {
      entries: {
        where: { isWinner: true },
        include: {
          user: true,
          photo: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-brand-bg text-brand-text px-4 md:px-8 py-10 max-w-[1440px] mx-auto space-y-8">
      
      {/* টপ হেডার */}
      <div className="flex flex-col items-center text-center space-y-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline bg-white px-4 py-1.5 rounded-full border border-brand-border shadow-sm mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>হোমপেজে ফিরে যান</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black uppercase shadow-sm">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>হল অফ ফেম (Hall of Fame)</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-black text-brand-text tracking-tight">
          বিগত কনটেস্টের চ্যাম্পিয়ন ও বিজয়ী তালিকা
        </h1>
        <p className="text-brand-muted text-xs md:text-sm max-w-lg mx-auto">
          পিকআর্নহাবের বিভিন্ন ফটো কনটেস্টে সর্বোচ্চ ভোট পেয়ে মেগা প্রাইজমানি জিতে নেওয়া শীর্ষ ফটোগ্রাফারদের আর্কাইভ।
        </p>
      </div>

      {/* উইনার্স গ্যালারি গ্রিড */}
      {completedContests.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-brand-border text-center space-y-2 shadow-sm max-w-md mx-auto">
          <Trophy className="w-10 h-10 text-amber-400 mx-auto opacity-70" />
          <h3 className="text-sm font-bold text-brand-text">এখনো কোনো কনটেস্ট সমাপ্ত হয়নি</h3>
          <p className="text-xs text-brand-muted">
            চলমান কনটেস্ট শেষ হওয়ার সাথে সাথে বিজয়ী ফটোগ্রাফারদের ছবি এখানে স্বয়ংক্রিয়ভাবে প্রদর্শিত হবে।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedContests.map((contest) => {
            const winnerEntry = contest.entries[0];
            if (!winnerEntry) return null;

            const photoUrl =
              winnerEntry.photo.imageUrl ||
              "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1000";

            return (
              <div
                key={contest.id}
                className="bg-white border border-brand-border rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col justify-between shadow-sm"
              >
                <div>
                  {/* বিজয়ী ছবি */}
                  <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                    <img
                      src={photoUrl}
                      alt={winnerEntry.photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-brand-gold text-brand-text font-black text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>${toBengaliNumber(contest.prizePool.toString())} USD ক্যাশ প্রাইজ জয়ী</span>
                    </div>
                  </div>

                  {/* বিস্তারিত তথ্য */}
                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[11px] font-bold text-brand-purple uppercase">
                        {contest.title}
                      </span>
                      <h3 className="text-base font-black text-brand-text mt-0.5">{winnerEntry.photo.title}</h3>
                    </div>

                    {/* ফটোগ্রাফার প্রোফাইল স্ট্রিপ */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 border border-brand-border flex items-center justify-center">
                          {winnerEntry.user.avatarUrl ? (
                            <img src={winnerEntry.user.avatarUrl} alt={winnerEntry.user.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-black text-xs text-brand-purple">
                              {winnerEntry.user.name?.charAt(0) || "U"}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-brand-text">{winnerEntry.user.name}</span>
                            {winnerEntry.user.badge === "BLUE_VERIFIED" && <CheckCircle className="w-3.5 h-3.5 text-sky-500" />}
                            {winnerEntry.user.badge === "FIRE_CREATOR" && <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />}
                          </div>
                          <span className="text-[10px] text-brand-muted">{winnerEntry.user.location || "ফটোগ্রাফার"}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-black text-rose-500 flex items-center justify-end gap-1">
                          <Heart className="w-3.5 h-3.5 fill-rose-500" />
                          <span>{toBengaliNumber(winnerEntry.votesReceived)} ভোট</span>
                        </div>
                        <div className="text-[10px] text-brand-muted flex items-center justify-end gap-1 mt-0.5">
                          <Calendar className="w-2.5 h-2.5" />
                          <span>{toBengaliDate(contest.endTime)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </main>
  );
}