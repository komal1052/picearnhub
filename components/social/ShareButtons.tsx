"use client";

import { useState } from "react";
import { MessageCircle, Facebook, Send, Copy, Check, Share2 } from "lucide-react";

interface ShareButtonsProps {
  photoId: string;
  photoTitle: string;
  creatorName: string;
}

export default function ShareButtons({ photoId, photoTitle, creatorName }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/photos/${photoId}`
    : `https://picearnhub.vercel.app/photos/${photoId}`;

  // উচ্চ রূপান্তরযোগ্য প্রাক-নির্ধারিত বাংলা শেয়ার মেসেজ
  const shareMessage = `🔥 পিকআর্নহাবে আমার "${photoTitle}" ছবিতে একটি ফ্রি ভোট দিয়ে আমাকে বিজয়ী হতে সাহায্য করুন! ভোট দিতে মাত্র ৬ সেকেন্ড লাগবে: ${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareToWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, "_blank");
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank");
  };

  const shareToTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareMessage)}`;
    window.open(url, "_blank");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: photoTitle,
          text: shareMessage,
          url: shareUrl,
        });
      } catch {
        // user dismissed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-white border border-brand-border rounded-3xl p-5 space-y-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-brand-text flex items-center gap-1.5">
          <Share2 className="w-4 h-4 text-brand-purple" />
          <span>ভোট বাড়াতে শেয়ার করুন (Share to get votes)</span>
        </span>
        {copied && (
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> লিংক কপি হয়েছে!
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {/* হোয়াটসঅ্যাপ বাটন */}
        <button
          onClick={shareToWhatsApp}
          className="py-2.5 px-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95"
          title="WhatsApp-এ শেয়ার করুন"
        >
          <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
          <span className="hidden sm:inline">WhatsApp</span>
        </button>

        {/* ফেসবুক বাটন */}
        <button
          onClick={shareToFacebook}
          className="py-2.5 px-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95"
          title="Facebook-এ শেয়ার করুন"
        >
          <Facebook className="w-4 h-4 fill-blue-600 text-blue-600" />
          <span className="hidden sm:inline">Facebook</span>
        </button>

        {/* টেলিগ্রাম বাটন */}
        <button
          onClick={shareToTelegram}
          className="py-2.5 px-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95"
          title="Telegram-এ শেয়ার করুন"
        >
          <Send className="w-4 h-4 text-sky-600" />
          <span className="hidden sm:inline">Telegram</span>
        </button>

        {/* লিংক কপি বাটন */}
        <button
          onClick={handleNativeShare}
          className="py-2.5 px-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-brand-text border border-brand-border font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95"
          title="লিংক কপি করুন"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span className="hidden sm:inline">{copied ? "কপি হয়েছে" : "কপি লিংক"}</span>
        </button>
      </div>
    </div>
  );
}