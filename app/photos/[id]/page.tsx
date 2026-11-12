import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ShareButtons from "@/components/social/ShareButtons";
import { CheckCircle, Flame, Sparkles, Heart, ArrowLeft, Download, ShieldCheck } from "lucide-react";
import { toBengaliNumber } from "@/lib/formatters";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const photo = await prisma.photo.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!photo) return { title: "ছবি পাওয়া যায়নি | PicEarnHub" };

  return {
    title: `${photo.title} - ${photo.user.name} এর ছবি | PicEarnHub`,
    description: `পিকআর্নহাবের লাইভ ফটো কনটেস্টে ${photo.user.name}-এর "${photo.title}" ছবিতে ভোট দিয়ে বিজয়ী হতে সাহায্য করুন।`,
  };
}

export default async function PhotoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const photo = await prisma.photo.findUnique({
    where: { id },
    include: {
      user: true,
      variants: true,
    },
  });

  if (!photo) notFound();

  const photoUrl = photo.imageUrl || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600";
  const isPortrait = photo.aspectRatio === "RATIO_9_16";

  return (
    <main className="min-h-screen bg-brand-bg text-brand-text px-4 md:px-8 py-8 max-w-[1300px] mx-auto space-y-6">
      
      {/* ব্যাক বাটন */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline bg-white px-4 py-1.5 rounded-full border border-brand-border shadow-sm transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>গ্যালারিতে ফিরে যান</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* বাম কলাম: বড় ছবি ও সোশ্যাল শেয়ার */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative w-full rounded-3xl overflow-hidden bg-white border border-brand-border shadow-sm p-2 flex items-center justify-center">
            <div className={`relative w-full ${isPortrait ? "aspect-[9/16] max-h-[720px]" : "aspect-[16/9] max-h-[550px]"} rounded-2xl overflow-hidden bg-black flex items-center justify-center`}>
              <img
                src={photoUrl}
                alt={photo.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          {/* ১-ক্লিক হোয়াটসঅ্যাপ ও সোশ্যাল শেয়ার উইজেট */}
          <ShareButtons
            photoId={photo.id}
            photoTitle={photo.title}
            creatorName={photo.user.name || "ফটোগ্রাফার"}
          />
        </div>

        {/* ডান কলাম: ফটোগ্রাফার প্রোফাইল, ভোট কাউন্টার ও অ্যাকশন */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white border border-brand-border rounded-3xl p-6 space-y-4 shadow-sm">
            {/* ব্যাজসমূহ */}
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-slate-100 text-brand-text font-mono">
                {isPortrait ? "৯:১৬ পোর্ট্রেট" : "১৬:৯ ল্যান্ডস্কেপ"}
              </span>
              {photo.isAiGenerated && (
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-brand-purple text-white flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3" /> এআই আর্ট
                </span>
              )}
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-slate-100 text-brand-muted">
                বিভাগ: {photo.category}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-brand-text leading-tight">{photo.title}</h1>

            {/* ফটোগ্রাফার প্রোফাইল কার্ড */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-brand-border">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-white border border-brand-border flex items-center justify-center shrink-0">
                {photo.user.avatarUrl ? (
                  <img src={photo.user.avatarUrl} alt={photo.user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-black text-sm text-brand-purple">
                    {photo.user.name?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm text-brand-text">
                  <span>{photo.user.name}</span>
                  {photo.user.badge === "BLUE_VERIFIED" && <CheckCircle className="w-4 h-4 text-sky-500" />}
                  {photo.user.badge === "FIRE_CREATOR" && <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />}
                </div>
                <span className="text-xs text-brand-muted">{photo.user.location || "বাংলাদেশ"}</span>
              </div>
            </div>

            {/* মোট ভোট পরিসংখ্যান */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50/60 border border-rose-100">
              <span className="text-xs text-rose-900 font-bold">কনটেস্টে অর্জিত ভোট:</span>
              <span className="text-xl font-black text-rose-600 flex items-center gap-1.5 font-mono">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                <span>{toBengaliNumber(photo.voteCount || 0)}</span>
              </span>
            </div>

            {/* কুইক অ্যাকশন বাটন */}
            <div className="space-y-2 pt-2 border-t border-brand-border">
              <Link
                href="/"
                className="w-full py-3 rounded-full bg-brand-gold hover:bg-amber-400 text-brand-text font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-400/20 transition-transform active:scale-95"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>হোমপেজে গিয়ে ভোট দিন</span>
              </Link>
            </div>
          </div>

          {/* স্পন্সর বিজ্ঞাপন বক্স */}
          <div className="bg-white border border-brand-border rounded-3xl p-4 text-center space-y-2 shadow-sm">
            <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider block">স্পন্সরড অফার</span>
            <div className="h-44 bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-xs text-brand-muted font-bold border border-dashed border-slate-200 space-y-1">
              <span className="text-brand-purple font-black">Adsterra Sponsored Banner</span>
              <span className="text-[10px] text-slate-400">[৩০০x২৫০ সাইজ বিজ্ঞাপন]</span>
            </div>
          </div>

        </div>

      </div>

    </main>
  );
}