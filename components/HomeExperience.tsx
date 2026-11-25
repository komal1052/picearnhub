"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Camera,
  Trophy,
  Flame,
  CheckCircle,
  Heart,
  Sparkles,
  Megaphone,
  Download,
  Coins,
  ShieldCheck,
  X,
  CheckCircle2,
  Calendar,
  ExternalLink,
  User as UserIcon,
  LogOut,
  Edit3,
  Phone,
  MapPin,
  Maximize2,
  UploadCloud,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Mail,
  MessageCircle,
  Search,
  Bell,
  Home as HomeIcon,
  Award,
  BarChart3,
  Gift,
  HelpCircle,
  PhoneCall,
  Clock,
  Crown,
  Diamond,
  ArrowRight,
  LayoutGrid,
  Mountain,
  MoreHorizontal,
  Plus,
  Users
} from "lucide-react";
import SocialBar from "./SocialBar";
import AdSlot from "./ads/AdSlot";
import { t } from "@/lib/translations";
import { toBengaliNumber, toBengaliDate } from "@/lib/formatters";

interface HomeExperienceProps {
  contests: any[];
  photos: any[];
  announcements: any[];
  payoutProofs?: any[];
  winnerPhoto: any;
}

export default function HomeExperience({
  contests,
  photos: initialPhotos,
  announcements,
  payoutProofs = [],
}: HomeExperienceProps) {
  const [activeNavTab, setActiveNavTab] = useState("home");
  const [activeFilter, setActiveFilter] = useState<"ALL" | "16:9" | "9:16" | "FREE" | "AI" | "WALLPAPER">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [photoList, setPhotoList] = useState(initialPhotos);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPhotoList(initialPhotos);
  }, [initialPhotos]);

  // ডাইনামিক হিরো স্লাইডার
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const heroSlides = photoList.length > 0 ? photoList.slice(0, 5) : [];

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // সাইডবার ট্যাব
  const [sidebarTab, setSidebarTab] = useState<"NOTICES" | "PROOFS">("NOTICES");
  const [proofs, setProofs] = useState<any[]>(payoutProofs);
  const [viewingProof, setViewingProof] = useState<any | null>(null);

  // মোডালসমূহ
  const [previewPhoto, setPreviewPhoto] = useState<any | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // ইউজার অথ স্টেট
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"LOGIN" | "REGISTER">("REGISTER");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // প্রোফাইল এডিটর স্টেট
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileLocation, setProfileLocation] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // ফটো আপলোড স্টেট
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Nature");
  const [uploadContestId, setUploadContestId] = useState("");
  const [uploadIsAi, setUploadIsAi] = useState(false);
  const [uploadAiModel, setUploadAiModel] = useState("Midjourney v6");
  const [uploadImageBase64, setUploadImageBase64] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // ভোটিং স্টেট
  const [votingPhoto, setVotingPhoto] = useState<any | null>(null);
  const [voteCountdown, setVoteCountdown] = useState(6);
  const [canConfirmVote, setCanConfirmVote] = useState(false);

  // ডাউনলোড স্টেট
  const [downloadPhoto, setDownloadPhoto] = useState<any | null>(null);
  const [selectedTier, setSelectedTier] = useState<"720P_WM" | "720P_CLEAN" | "1080P" | "2K">("720P_WM");
  const [unlockStep, setUnlockStep] = useState(1);
  const [unlockCountdown, setUnlockCountdown] = useState(6);
  const [canDownload, setCanDownload] = useState(false);
  const [isVerifyingDownload, setIsVerifyingDownload] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (proofs.length === 0) {
      fetch("/api/admin/proofs")
        .then((res) => res.json())
        .then((data) => {
          if (data.proofs) setProofs(data.proofs);
        })
        .catch(() => {});
    }
  }, [proofs.length]);

  const triggerAdsterraDirectLink = () => {
    const directLink = process.env.NEXT_PUBLIC_ADSTERRA_DIRECT_LINK || "https://asiafilm.org/4/2a484ad42c374471ff9da78604cdb7d8";
    if (directLink) {
      window.open(directLink, "_blank", "noopener,noreferrer");
    }
  };

  useEffect(() => {
    if (!votingPhoto) return;
    setVoteCountdown(6);
    setCanConfirmVote(false);
    triggerAdsterraDirectLink();

    const timer = setInterval(() => {
      setVoteCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanConfirmVote(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [votingPhoto]);

  useEffect(() => {
    if (!isVerifyingDownload) return;
    setUnlockCountdown(6);
    setCanDownload(false);
    triggerAdsterraDirectLink();

    const timer = setInterval(() => {
      setUnlockCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanDownload(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVerifyingDownload, unlockStep]);

 // পয়েন্ট দিয়ে অ্যাড স্কিপ করে ভোট দেওয়া
  const handleSkipVoteWithPoints = () => {
    if (!currentUser) {
      alert("পয়েন্ট ব্যবহার করে ভোট দিতে অনুগ্রহ করে প্রথমে একাউন্টে লগইন করুন!");
      setVotingPhoto(null);
      setIsAuthModalOpen(true);
      return;
    }
    if (currentUser.pointsBalance < 2) {
      alert("আপনার পর্যাপ্ত পয়েন্ট নেই! ভোট দিতে পয়েন্ট অর্জন করুন অথবা ৬ সেকেন্ড বিজ্ঞাপন দেখে ভোট নিশ্চিত করুন।");
      return;
    }
    setCurrentUser((prev: any) => ({ ...prev, pointsBalance: prev.pointsBalance - 2 }));
    handleConfirmVote();
  };
// লগইন ও রেজিস্ট্রেশন সাবমিট হ্যান্ডলার
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const endpoint = authMode === "REGISTER" ? "/api/auth/register" : "/api/auth/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: authName, email: authEmail, password: authPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setCurrentUser(data.user);
        setIsAuthModalOpen(false);
        setAuthName("");
        setAuthEmail("");
        setAuthPassword("");
        alert(authMode === "REGISTER" ? "একাউন্ট সফলভাবে তৈরি হয়েছে এবং ৫০ পয়েন্ট বোনাস যুক্ত হয়েছে! 🎉" : "সফলভাবে লগইন হয়েছে!");
      } else {
        alert(data.error || "কার্যক্রম ব্যর্থ হয়েছে।");
      }
    } catch {
      alert("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setAuthLoading(false);
    }
  };
// ভোট নিশ্চিত করা (API কল সহ)
  const handleConfirmVote = async () => {
    if (!votingPhoto) return;

    if (!currentUser) {
      alert("ভোট দিতে অনুগ্রহ করে প্রথমে একাউন্টে লগইন করুন!");
      setVotingPhoto(null);
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const res = await fetch(`/api/photos/${votingPhoto.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          fingerprint: typeof window !== "undefined" ? window.navigator.userAgent : "browser",
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "ভোট গ্রহণ করা সম্ভব হয়নি।");
        setVotingPhoto(null);
        return;
      }

      // সফল হলে ভোট বাড়ানো
      setPhotoList((prev) =>
        prev.map((p) =>
          p.id === votingPhoto.id ? { ...p, voteCount: (p.voteCount || 0) + 1, hasVoted: true } : p
        )
      );
      if (previewPhoto && previewPhoto.id === votingPhoto.id) {
        setPreviewPhoto((prev: any) => ({ ...prev, voteCount: (prev.voteCount || 0) + 1, hasVoted: true }));
      }
      alert("🎉 আপনার মূল্যবান ভোটটি সফলভাবে গ্রহণ করা হয়েছে!");
    } catch {
      alert("ভোট সাবমিট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setVotingPhoto(null);
    }
  };

  const handleOpenEditProfile = () => {
    if (!currentUser) return;
    setProfileName(currentUser.name || "");
    setProfilePhone(currentUser.phone || "");
    setProfileBio(currentUser.bio || "");
    setProfileLocation(currentUser.location || "ঢাকা, বাংলাদেশ");
    setProfileAvatar(currentUser.avatarUrl || "");
    setIsProfileModalOpen(true);
  };

  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 150;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx?.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
        setProfileAvatar(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          name: profileName,
          phone: profilePhone,
          bio: profileBio,
          location: profileLocation,
          avatarUrl: profileAvatar,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setCurrentUser(data.user);
        setIsProfileModalOpen(false);
        alert("প্রোফাইল সফলভাবে আপডেট করা হয়েছে! ✅");
      } else {
        alert(data.error);
      }
    } catch {
      alert("প্রোফাইল আপডেট ব্যর্থ হয়েছে।");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePhotoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 1200;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, w, h);
        setUploadImageBase64(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("ছবি জমা দিতে অনুগ্রহ করে প্রথমে একাউন্টে লগইন করুন!");
      setIsUploadModalOpen(false);
      setIsAuthModalOpen(true);
      return;
    }
    if (!uploadImageBase64) {
      alert("অনুগ্রহ করে একটি ছবি সিলেক্ট করুন!");
      return;
    }

    setUploadLoading(true);

    try {
      const res = await fetch("/api/photos/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          title: uploadTitle,
          category: uploadCategory,
          contestId: uploadContestId || contests[0]?.id,
          isAiGenerated: uploadIsAi,
          aiModelUsed: uploadIsAi ? uploadAiModel : null,
          imageBase64: uploadImageBase64,
        }),
      });
      // ব্রাউজারের নিজস্ব Canvas ও Blob দিয়ে ১০০% গ্যারান্টিযুক্ত ডাউনলোড
  const handleExecuteDownload = (photo: any, tier: string) => {
    if (!photo) return;
    const photoUrl = getPhotoUrl(photo);
    const safeFilename = `picearnhub_${(photo.title || "photo").replace(/[^a-zA-Z0-9_\u0980-\u09FF]/g, "_")}_${tier.toLowerCase()}.jpg`;

    // ১. মোডাল অবিলম্বে বন্ধ করা
    setIsVerifyingDownload(false);
    setDownloadPhoto(null);
    setUnlockStep(1);

    // ২. যদি ছবি Base64 ডাটা হয়
    if (photoUrl.startsWith("data:")) {
      const link = document.createElement("a");
      link.href = photoUrl;
      link.download = safeFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert(`🎉 "${photo.title}" ছবিটি ডাউনলোড সম্পন্ন হয়েছে!\nআপনার Downloads ফোল্ডার চেক করুন।`);
      return;
    }

    // ৩. ক্যানভাস দিয়ে রিয়েল ইমেজ ফাইল জেনারেট করে সরাসরি ডাউনলোড
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = photoUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = safeFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2000);
            alert(`🎉 "${photo.title}" ছবিটি ডাউনলোড হচ্ছে!\nআপনার ব্রাউজারের Downloads বারে ফাইলটি চেক করুন।`);
          } else {
            // ব্লব ফেইল করলে সরাসরি ওপেন
            window.location.href = photoUrl;
          }
        }, "image/jpeg", 0.95);
      } catch (e) {
        // ক্যানভাসে CORS আটকালে সরাসরি ব্রাউজারে ফাইল রিডাইরেক্ট
        window.location.href = photoUrl;
      }
    };

    img.onerror = () => {
      window.location.href = photoUrl;
    };
  };
      const data = await res.json();

      if (res.ok) {
        alert("🎉 ছবি সফলভাবে কনটেস্টে জমা হয়েছে! আপনার একাউন্টে ১৫ পয়েন্ট বোনাস যুক্ত হয়েছে।");
        const newEntry = {
          ...data.photo,
          user: { name: currentUser.name, avatarUrl: currentUser.avatarUrl, badge: currentUser.badge },
        };
        setPhotoList((prev) => [newEntry, ...prev]);
        setCurrentUser((prev: any) => ({ ...prev, pointsBalance: prev.pointsBalance + 15 }));
        setIsUploadModalOpen(false);
        setUploadTitle("");
        setUploadImageBase64(null);
      } else {
        alert(data.error);
      }
    } catch {
      alert("ছবি আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setUploadLoading(false);
    }
  };
// ব্রাউজারের ক্যানভাস ও ব্লব দিয়ে আসল ছবি ডাউনলোড ফাংশন
  const handleExecuteDownload = (photo: any, tier: string) => {
    if (!photo) return;
    const photoUrl = getPhotoUrl(photo);
    const cleanTitle = (photo.title || "photo").replace(/[^a-zA-Z0-9_\u0980-\u09FF]/g, "_");
    const safeFilename = `picearnhub_${cleanTitle}_${tier.toLowerCase()}.jpg`;

    // ১. মোডাল অবিলম্বে বন্ধ করা
    setIsVerifyingDownload(false);
    setDownloadPhoto(null);
    setUnlockStep(1);

    // ২. যদি ছবি Base64 ডাটা হয় (সরাসরি ডাউনলোড)
    if (photoUrl.startsWith("data:")) {
      const link = document.createElement("a");
      link.href = photoUrl;
      link.download = safeFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert(`🎉 "${photo.title}" ছবিটি ডাউনলোড সম্পন্ন হয়েছে!\nআপনার Downloads ফোল্ডার চেক করুন।`);
      return;
    }

    // ৩. রিয়েল ইমেজ ফাইল তৈরি ও ডাউনলোড
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = photoUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = safeFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
            alert(`🎉 "${photo.title}" ছবিটি ডাউনলোড হচ্ছে!\nআপনার ব্রাউজারের Downloads বারে ফাইলটি চেক করুন।`);
          } else {
            window.location.href = photoUrl;
          }
        }, "image/jpeg", 0.95);
      } catch (e) {
        window.location.href = photoUrl;
      }
    };

    img.onerror = () => {
      window.location.href = photoUrl;
    };
  };
  const getPhotoUrl = (photo: any) => {
    if (!photo) return "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1200&h=675&fit=crop";
    if (photo.imageUrl) return photo.imageUrl;
    return "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&h=675&fit=crop";
  };

  // সার্চ ও ফিল্টার
  const filteredPhotos = photoList.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title?.toLowerCase().includes(q);
      const matchAuthor = p.user?.name?.toLowerCase().includes(q);
      const matchCategory = p.category?.toLowerCase().includes(q);
      if (!matchTitle && !matchAuthor && !matchCategory) return false;
    }

    if (activeFilter === "16:9") return p.aspectRatio === "RATIO_16_9";
    if (activeFilter === "9:16") return p.aspectRatio === "RATIO_9_16";
    if (activeFilter === "FREE") return p.isFree;
    if (activeFilter === "AI") return p.isAiGenerated;
    if (activeFilter === "WALLPAPER") return p.category === "Wallpaper";
    return true;
  });

  const activeHeroPhoto = heroSlides[currentSlideIndex] || heroSlides[0];

  const leaderboardCreators: any[] = Array.from(
    photoList.reduce((acc: Map<string, any>, p: any) => {
      const u = p.user;
      if (!u) return acc;
      const existing = acc.get(u.id) || {
        id: u.id,
        name: u.name,
        avatarUrl: u.avatarUrl,
        badge: u.badge,
        votes: 0,
      };
      existing.votes += p.voteCount || 0;
      acc.set(u.id, existing);
      return acc;
    }, new Map<string, any>()).values()
  ).sort((a: any, b: any) => b.votes - a.votes);

  return (
    <div className="space-y-6 md:space-y-8">
      <SocialBar />

      {/* ==================================================== */}
      {/* ১. টপ হেডার বার                                      */}
      {/* ==================================================== */}
      <header className="bg-white border-b border-brand-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-18 py-2.5 flex items-center justify-between gap-3">
          
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center group py-1">
              <img
                src="/logo.png"
                alt="PicEarnHub Logo"
                className="h-10 sm:h-11 md:h-12 w-auto object-contain transition-transform group-hover:scale-105 duration-200"
              />
            </Link>
          </div>

          <div className="hidden xl:flex items-center gap-2.5 shrink-0">
            <a
              href="mailto:picearnhub@gmail.com"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-brand-border text-xs text-brand-text font-medium transition-colors"
              title={t.header.emailHelp}
            >
              <Mail className="w-3.5 h-3.5 text-brand-purple" />
              <span className="font-mono text-[11px]">picearnhub@gmail.com</span>
            </a>

            <a
              href="https://wa.me/8801700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs text-emerald-700 font-bold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
              <span>{t.header.whatsappHelp}</span>
            </a>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.header.searchPlaceholder}
                className="w-full bg-slate-50 border border-brand-border rounded-full py-2 pl-10 pr-4 text-xs text-brand-text placeholder-brand-muted focus:bg-white focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 transition-all font-sans"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex lg:hidden items-center gap-1.5">
              <a
                href="mailto:picearnhub@gmail.com"
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-brand-purple"
                title={t.header.emailHelp}
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"
                title={t.header.whatsappHelp}
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>

            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-sm">
              <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span className="font-bold">{toBengaliNumber(currentUser?.pointsBalance ?? 50)}</span>
              <span className="text-[10px] text-amber-700 font-extrabold">{t.header.pointsTag}</span>
            </div>

            <button
              onClick={() => {
                if (!currentUser) {
                  setIsAuthModalOpen(true);
                } else {
                  setIsUploadModalOpen(true);
                }
              }}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-brand-purple to-brand-deep hover:opacity-95 text-white font-bold text-xs shadow-md shadow-brand-purple/30 transition-transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>{t.header.uploadBtn}</span>
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full border border-brand-border hover:border-brand-purple transition-colors bg-white"
                >
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover border border-brand-purple"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-purple text-white font-black text-xs flex items-center justify-center">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-brand-border p-2 z-50 animate-in fade-in duration-150">
                    <div className="px-3 py-2 border-b border-brand-border">
                      <p className="text-xs font-bold text-brand-text truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-brand-muted truncate font-mono">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleOpenEditProfile();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-brand-text hover:bg-slate-50 transition-colors text-left"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-brand-purple" />
                      <span>{t.header.editProfile}</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setCurrentUser(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.header.logout}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 rounded-full bg-slate-900 hover:bg-black text-white font-bold text-xs transition-transform active:scale-95 shadow-sm"
              >
                {t.header.signIn}
              </button>
            )}

          </div>
        </div>
      </header>

      {/* ==================================================== */}
      {/* ২. মেইন ন্যাভিগেশন রিবন                               */}
      {/* ==================================================== */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-brand-border sticky top-18 z-30 hidden md:block">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-12 flex items-center justify-between">
          <div className="flex items-center gap-1 lg:gap-2 text-xs font-bold text-brand-muted">
            <button
              onClick={() => setActiveNavTab("home")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all ${
                activeNavTab === "home"
                  ? "bg-brand-purple text-white shadow-md shadow-brand-purple/20 font-bold"
                  : "hover:text-brand-purple hover:bg-slate-50"
              }`}
            >
              <HomeIcon className="w-3.5 h-3.5" />
              <span>{t.nav.home}</span>
            </button>

            <button
              onClick={() => {
                setActiveNavTab("contests");
                document.getElementById("ongoing-contests")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:text-brand-purple hover:bg-slate-50 transition-colors"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{t.nav.contests}</span>
            </button>

            <button
              onClick={() => {
                setActiveNavTab("gallery");
                document.getElementById("trending-gallery")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:text-brand-purple hover:bg-slate-50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.nav.gallery}</span>
            </button>

            <Link
              href="/hall-of-fame"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:text-brand-purple hover:bg-slate-50 transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span>{t.nav.winners}</span>
            </Link>

            <Link
              href="/leaderboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:text-brand-purple hover:bg-slate-50 transition-colors"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{t.nav.leaderboard}</span>
            </Link>

            <Link
              href="/rewards"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:text-brand-purple hover:bg-slate-50 transition-colors"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>{t.nav.rewards}</span>
            </Link>

            <Link
              href="/faq"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:text-brand-purple hover:bg-slate-50 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t.nav.faq}</span>
            </Link>

            <Link
              href="/contact"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:text-brand-purple hover:bg-slate-50 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{t.nav.contact}</span>
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:text-brand-purple hover:bg-slate-50 transition-colors text-brand-muted"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>অ্যাডমিন</span>
            </Link>
          </div>

          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t.nav.activeContestTag}</span>
          </span>
        </div>
      </nav>

      {/* ==================================================== */}
      {/* ৩. হিরো স্লাইডার ও সাইডবার                            */}
      {/* ==================================================== */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6 md:space-y-8">
        
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          <div className="lg:col-span-8">
            <div
              onClick={() => {
                if (activeHeroPhoto) setPreviewPhoto(activeHeroPhoto);
              }}
              className="relative rounded-3xl overflow-hidden bg-brand-surface border border-brand-border shadow-xl h-[360px] md:h-[420px] group cursor-pointer flex flex-col justify-end p-6 md:p-8"
            >
              {activeHeroPhoto && (
                <img
                  key={activeHeroPhoto.id}
                  src={getPhotoUrl(activeHeroPhoto)}
                  alt={activeHeroPhoto.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700 animate-in fade-in"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-transparent to-transparent" />

              <div className="absolute top-5 left-5 z-10 flex items-center gap-2 bg-brand-purple/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg">
                <Trophy className="w-3.5 h-3.5 text-brand-gold" />
                <span>{t.hero.topContestTag}</span>
              </div>

              <button
                onClick={handlePrevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity active:scale-95"
                title="পূর্ববর্তী ছবি"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <button
                onClick={handleNextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity active:scale-95"
                title="পরবর্তী ছবি"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>

              {activeHeroPhoto && (
                <div className="relative z-10 space-y-3 max-w-xl">
                  <h2 className="text-2xl md:text-4xl font-black text-white leading-tight drop-shadow-md">
                    {activeHeroPhoto.title}
                  </h2>
                  <p className="text-xs md:text-sm text-slate-200 line-clamp-2 leading-relaxed font-normal">
                    {t.hero.subtitle}
                  </p>

                  <div className="pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!currentUser) setIsAuthModalOpen(true);
                        else setIsUploadModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-gold hover:bg-amber-400 text-brand-text font-black text-xs shadow-lg shadow-amber-500/30 transition-transform active:scale-95"
                    >
                      <span>{t.hero.joinContestBtn}</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 font-bold text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      {activeHeroPhoto.user?.avatarUrl ? (
                        <img
                          src={activeHeroPhoto.user.avatarUrl}
                          alt={activeHeroPhoto.user.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-brand-gold text-brand-text font-black text-[9px] flex items-center justify-center">
                          {activeHeroPhoto.user?.name?.charAt(0) || "U"}
                        </div>
                      )}
                      <span>{t.hero.byCreator} {activeHeroPhoto.user?.name || "ফটোগ্রাফার"}</span>
                      {activeHeroPhoto.user?.badge === "BLUE_VERIFIED" && <CheckCircle className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />}
                      {activeHeroPhoto.user?.badge === "FIRE_CREATOR" && <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />}
                    </div>

                    <span>|</span>
                    <span className="font-semibold">{activeHeroPhoto.category || "প্রকৃতি"} {t.hero.categorySuffix}</span>
                    <span>|</span>
                    <div className="flex items-center gap-1 font-bold text-rose-400">
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span>{toBengaliNumber(activeHeroPhoto.voteCount || 0)} {t.hero.totalVotes}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="absolute bottom-5 right-6 flex gap-1.5 z-20">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlideIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentSlideIndex ? "w-6 bg-brand-gold" : "w-2 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* সাইডবার: নোটিশ বোর্ড ও পেমেন্ট প্রুফ + অ্যাডস্লট */}
          <div className="lg:col-span-4 rounded-3xl bg-white border border-brand-border p-5 flex flex-col justify-between shadow-sm space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-brand-border pb-2.5">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSidebarTab("NOTICES")}
                    className={`text-xs font-bold pb-1 transition-colors ${
                      sidebarTab === "NOTICES"
                        ? "text-brand-purple border-b-2 border-brand-purple"
                        : "text-brand-muted hover:text-brand-text"
                    }`}
                  >
                    {t.sidebar.tabNotices}
                  </button>
                  <button
                    onClick={() => setSidebarTab("PROOFS")}
                    className={`text-xs font-bold pb-1 transition-colors flex items-center gap-1 ${
                      sidebarTab === "PROOFS"
                        ? "text-emerald-600 border-b-2 border-emerald-600"
                        : "text-brand-muted hover:text-brand-text"
                    }`}
                  >
                    <span>{t.sidebar.tabProofs}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </button>
                </div>

                <span className="flex items-center gap-1.5 text-[9px] font-black px-2 py-0.5 rounded-full bg-rose-50 text-rose-500 border border-rose-200 tracking-wider">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
                  </span>
                  <span>{t.sidebar.liveBadge}</span>
                </span>
              </div>

              {sidebarTab === "NOTICES" ? (
                <div className="space-y-2.5 divide-y divide-slate-100">
                  {announcements.map((a) => (
                    <div key={a.id} className="pt-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-purple-50 text-brand-purple border border-purple-100">
                          {a.badgeTag || "নোটিশ"}
                        </span>
                        <span className="text-[11px] text-brand-muted">আপডেট</span>
                      </div>
                      <h4 className="text-xs font-bold text-brand-text leading-snug">{a.title}</h4>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                  {proofs.length === 0 ? (
                    <div className="text-center py-6 text-brand-muted text-xs font-medium">
                      {t.sidebar.noProofs}
                    </div>
                  ) : (
                    proofs.map((proof) => (
                      <div
                        key={proof.id}
                        onClick={() => setViewingProof(proof)}
                        className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-300 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={proof.proofImage}
                            alt="পেমেন্ট প্রুফ"
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                          />
                          <div>
                            <div className="text-xs font-bold text-brand-text">{proof.userName}</div>
                            <div className="text-[10px] text-brand-muted">
                              {proof.gateway} &bull; {toBengaliDate(proof.createdAt)}
                            </div>
                          </div>
                        </div>
                        <span className="text-emerald-600 font-bold text-xs">{proof.amount}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* আসল Adsterra 300x250 স্লট */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center overflow-hidden">
              <AdSlot zoneId="32346376" width={300} height={250} />
            </div>
          </div>

        </section>

        {/* ==================================================== */}
        {/* ৪. চলমান কনটেস্টসমূহ ও ক্যাটাগরি ম্যাট্রিক্স            */}
        {/* ==================================================== */}
        <section id="ongoing-contests" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base md:text-lg font-black text-brand-text flex items-center gap-2">
                <Trophy className="w-5 h-5 text-brand-gold" />
                <span>{t.contests.title}</span>
              </h3>
              <button
                onClick={() => {
                  if (!currentUser) setIsAuthModalOpen(true);
                  else setIsUploadModalOpen(true);
                }}
                className="text-xs font-bold text-brand-purple hover:underline flex items-center gap-1"
              >
                <span>{t.contests.viewAll}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* ৩টি ব্যালেন্সড ডাইনামিক কার্ড */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(() => {
                const c24 = contests.filter((c: any) => c.tier === "HOURLY_24").slice(-1)[0];
                const c7 = contests.filter((c: any) => c.tier === "WEEKLY_7D").slice(-1)[0];
                const c30 = contests.filter((c: any) => c.tier === "MONTHLY_30D").slice(-1)[0];

                const prominentContests = [
                  c24 || { id: "c24_default", title: "২৪ ঘণ্টার ফ্ল্যাশ কনটেস্ট", tier: "HOURLY_24", prizePool: 5, endTime: new Date(Date.now() + 24 * 3600 * 1000) },
                  c7 || { id: "c7_default", title: "৭ দিনের সাপ্তাহিক কনটেস্ট", tier: "WEEKLY_7D", prizePool: 25, endTime: new Date(Date.now() + 7 * 24 * 3600 * 1000) },
                  c30 || { id: "c30_default", title: "৩০ দিনের মেগা গ্র্যান্ড প্রাইজ", tier: "MONTHLY_30D", prizePool: 100, endTime: new Date(Date.now() + 30 * 24 * 3600 * 1000) },
                ];

                return prominentContests.map((c: any) => {
                  const is24h = c.tier === "HOURLY_24";
                  const is7d = c.tier === "WEEKLY_7D";

                  const gradientClass = is24h
                    ? "from-rose-500 via-rose-600 to-pink-600 glow-rose"
                    : is7d
                    ? "from-amber-500 via-amber-600 to-orange-500 glow-amber"
                    : "from-blue-600 via-blue-700 to-cyan-600 glow-blue";

                  const badgeText = is24h ? "২৪ ঘণ্টা" : is7d ? "৭ দিন" : "৩০ দিন";
                  const Icon = is24h ? Clock : is7d ? Crown : Diamond;
                  const prizeTaka = Math.round(Number(c.prizePool) * 120);

                  return (
                    <div
                      key={c.id}
                      className={`rounded-3xl p-5 text-white bg-gradient-to-br ${gradientClass} shadow-lg relative overflow-hidden flex flex-col justify-between h-[195px] transition-transform hover:-translate-y-1`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                            <Icon className="w-3 h-3 text-brand-gold" />
                            <span>{badgeText}</span>
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white pt-1 line-clamp-2 leading-snug drop-shadow-sm">
                          {c.title}
                        </h4>
                        <p className="text-[10px] text-white/80">
                          সমাপ্তি: {toBengaliDate(c.endTime)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/20">
                        <div>
                          <span className="text-[9px] text-white/80 uppercase font-bold block">
                            {t.contests.prizeLabel}
                          </span>
                          <span className="text-base md:text-lg font-black font-sans flex items-center gap-1">
                            <Gift className="w-4 h-4 text-brand-gold shrink-0" />
                            <span>৳{toBengaliNumber(prizeTaka.toLocaleString("en-US"))} (${toBengaliNumber(c.prizePool)})</span>
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            setUploadContestId(c.id);
                            if (!currentUser) setIsAuthModalOpen(true);
                            else setIsUploadModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-[11px] shadow-md transition-transform active:scale-95 shrink-0"
                        >
                          {t.contests.joinNow}
                        </button>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-base md:text-lg font-black text-brand-text flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-purple" />
              <span>{t.filters.heading}</span>
            </h3>

            <div className="hidden lg:grid grid-cols-3 gap-2.5 bg-white p-3.5 rounded-3xl border border-brand-border shadow-sm">
              {[
                { id: "ALL", label: t.filters.all, icon: LayoutGrid, color: "text-purple-600", bg: "bg-purple-50" },
                { id: "16:9", label: t.filters.landscape, icon: Mountain, color: "text-emerald-600", bg: "bg-emerald-50" },
                { id: "9:16", label: t.filters.portrait, icon: UserIcon, color: "text-amber-600", bg: "bg-amber-50" },
                { id: "FREE", label: t.filters.free, icon: Gift, color: "text-rose-600", bg: "bg-rose-50" },
                { id: "AI", label: t.filters.aiArt, icon: Sparkles, color: "text-indigo-600", bg: "bg-indigo-50" },
                { id: "WALLPAPER", label: t.filters.wallpaper, icon: MoreHorizontal, color: "text-slate-600", bg: "bg-slate-50" },
              ].map((f) => {
                const Icon = f.icon;
                const isActive = activeFilter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id as any)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center gap-1 ${
                      isActive
                        ? "border-brand-purple bg-brand-purple/5 shadow-sm"
                        : "border-slate-100 hover:border-slate-200 bg-white"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl ${f.bg} flex items-center justify-center ${f.color}`}>
                      <Icon className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <span className={`text-[11px] font-bold ${isActive ? "text-brand-purple" : "text-brand-text"}`}>
                      {f.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex lg:hidden items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {[
                { id: "ALL", label: t.filters.all },
                { id: "16:9", label: "১৬:৯" },
                { id: "9:16", label: "৯:১৬" },
                { id: "FREE", label: t.filters.free },
                { id: "AI", label: t.filters.aiArt },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all ${
                    activeFilter === tab.id
                      ? "bg-brand-purple text-white shadow-md shadow-brand-purple/20"
                      : "bg-white text-brand-muted border border-brand-border hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

        </section>

        {/* ==================================================== */}
        {/* ৫. ট্রেন্ডিং ফটো গ্যালারি ও ডানপাশে স্টিকি লিডারবোর্ড */}
        {/* ==================================================== */}
        <section id="trending-gallery" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base md:text-xl font-black text-brand-text flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500 fill-rose-500" />
                <span>{t.gallery.heading}</span>
              </h3>
              <span className="text-xs font-bold text-brand-muted">
                {t.gallery.showingCount(toBengaliNumber(filteredPhotos.length))}
              </span>
            </div>

            <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
              {filteredPhotos.map((photo) => {
                const isPortrait = photo.aspectRatio === "RATIO_9_16";
                return (
                  <div
                    key={photo.id}
                    onClick={() => setPreviewPhoto(photo)}
                    className={`group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer bg-slate-900 border border-brand-border break-inside-avoid mb-4 ${
                      isPortrait ? "aspect-[9/16]" : "aspect-[16/10]"
                    }`}
                  >
                    <img
                      src={getPhotoUrl(photo)}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />

                    <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none group-hover:opacity-0 transition-opacity duration-200">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-white font-mono">
                        {isPortrait ? "৯:১৬" : "১৬:৯"}
                      </span>
                      {photo.isAiGenerated && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-purple/90 text-white shadow-sm flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> AI
                        </span>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between text-white z-20">
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1.5">
                          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white">
                            {isPortrait ? "৯:১৬ পোর্ট্রেট" : "১৬:৯ ল্যান্ডস্কেপ"}
                          </span>
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white">
                            {photo.isFree ? t.gallery.badgeFree : t.gallery.badgePremium}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDownloadPhoto(photo);
                            }}
                            className="p-1.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-brand-purple transition-all shadow-md active:scale-90"
                            title="Download Resolutions"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <div className="p-1.5 rounded-full bg-white/20 text-white">
                            <Maximize2 className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <h4 className="text-sm font-bold text-white drop-shadow-md truncate">
                            {photo.title}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-300">
                            {photo.user?.avatarUrl ? (
                              <img
                                src={photo.user.avatarUrl}
                                alt={photo.user.name}
                                className="w-4 h-4 rounded-full object-cover border border-amber-400"
                              />
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-brand-gold text-brand-text font-black text-[8px] flex items-center justify-center">
                                {photo.user?.name ? photo.user.name.charAt(0).toUpperCase() : "U"}
                              </div>
                            )}
                            <span className="font-semibold truncate">{photo.user?.name}</span>
                            {photo.user?.badge === "BLUE_VERIFIED" && <CheckCircle className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />}
                            {photo.user?.badge === "FIRE_CREATOR" && <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />}
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!currentUser) {
                              alert("ভোট দিতে অনুগ্রহ করে প্রথমে একাউন্টে লগইন করুন!");
                              setIsAuthModalOpen(true);
                              return;
                            }
                            setVotingPhoto(photo);
                          }}
                          disabled={photo.hasVoted}
                          className={`w-full py-2 px-3 rounded-full text-xs font-black flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-lg ${
                            photo.hasVoted
                              ? "bg-rose-500/80 text-white cursor-default"
                              : "bg-white hover:bg-rose-500 text-slate-900 hover:text-white"
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${photo.hasVoted ? "fill-white text-white" : "fill-rose-500 text-rose-500"}`} />
                          <span>{photo.hasVoted ? t.gallery.votedBtn : t.gallery.voteBtn}</span>
                          <span className="opacity-40">&bull;</span>
                          <span className="font-mono">{toBengaliNumber(photo.voteCount || 0)}</span>
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ডানপাশের স্টিকি লিডারবোর্ড ও আসল Adsterra ব্যানার */}
          <div className="lg:col-span-4 sticky top-20 space-y-4">
            
            <div id="leaderboard-section" className="bg-white p-5 rounded-3xl border border-brand-border shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-brand-border pb-3">
                <h3 className="text-sm font-black text-brand-text flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-brand-gold" />
                  <span>{t.leaderboard.title}</span>
                </h3>
                <Link href="/hall-of-fame" className="text-[11px] font-bold text-brand-purple hover:underline flex items-center gap-1">
                  <span>{t.leaderboard.viewAll}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3">
                {leaderboardCreators.map((creator: any, index: number) => (
                  <div key={creator.id || index} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        index === 0 ? "bg-amber-400 text-brand-text" : index === 1 ? "bg-slate-200 text-slate-700" : index === 2 ? "bg-amber-100 text-amber-900" : "text-brand-muted"
                      }`}>
                        {toBengaliNumber(index + 1)}
                      </span>

                      {creator.avatarUrl ? (
                        <img
                          src={creator.avatarUrl}
                          alt={creator.name}
                          className="w-7 h-7 rounded-full object-cover border border-brand-border"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-100 font-bold text-xs flex items-center justify-center text-brand-purple">
                          {creator.name?.charAt(0) || "U"}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-1 font-bold text-brand-text truncate max-w-[110px]">
                          <span>{creator.name}</span>
                          {creator.badge === "BLUE_VERIFIED" && <CheckCircle className="w-3.5 h-3.5 text-sky-500" />}
                          {creator.badge === "FIRE_CREATOR" && <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />}
                        </div>
                      </div>
                    </div>

                    <span className="font-bold text-brand-purple">
                      {toBengaliNumber(creator.votes || 0)} {t.leaderboard.votesSuffix}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* আসল Adsterra ব্যানার */}
            <div className="rounded-3xl bg-white border border-brand-border p-2 shadow-sm flex items-center justify-center overflow-hidden">
              <AdSlot zoneId="32346376" width={300} height={250} />
            </div>

          </div>

        </section>

        {/* ==================================================== */}
        {/* ৬. ট্রাস্ট ব্যানার ও "চ্যাম্পিয়ন হোন" সিটিএ           */}
        {/* ==================================================== */}
        <section className="space-y-4 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-brand-border shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                <Gift className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-brand-text">{t.banners.pillar1Title}</h5>
                <p className="text-[10px] text-brand-muted">{t.banners.pillar1Desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-brand-border shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-brand-text">{t.banners.pillar2Title}</h5>
                <p className="text-[10px] text-brand-muted">{t.banners.pillar2Desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-brand-border shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                <Users className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-brand-text">{t.banners.pillar3Title}</h5>
                <p className="text-[10px] text-brand-muted">{t.banners.pillar3Desc}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-r from-brand-deep via-brand-purple to-indigo-600 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
                <Trophy className="w-7 h-7 md:w-9 md:h-9 text-brand-gold stroke-[2.5]" />
              </div>
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-xl md:text-3xl font-black tracking-tight leading-none">
                  {t.banners.championTitle}
                </h3>
                <p className="text-xs md:text-sm text-slate-200">
                  {t.banners.championDesc}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (!currentUser) setIsAuthModalOpen(true);
                else setIsUploadModalOpen(true);
              }}
              className="px-6 py-3 rounded-full bg-brand-gold hover:bg-amber-400 text-brand-text font-black text-xs md:text-sm shadow-xl shadow-amber-500/20 transition-transform active:scale-95 shrink-0 flex items-center gap-2"
            >
              <span>{t.banners.championBtn}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </section>

      </div>

      {/* ==================================================== */}
      {/* ৭. ফিক্সড মোবাইল বটম ন্যাভিগেশন বার                    */}
      {/* ==================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-brand-border md:hidden safe-area-bottom pb-safe">
        <div className="flex items-center justify-around h-16 px-2 relative">
          
          <button
            onClick={() => {
              setActiveNavTab("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`flex flex-col items-center justify-center gap-1 w-14 transition-colors ${
              activeNavTab === "home" ? "text-brand-purple" : "text-brand-muted hover:text-brand-text"
            }`}
          >
            <HomeIcon className={`w-5 h-5 ${activeNavTab === "home" ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
            <span className="text-[10px] font-bold">{t.mobileNav.home}</span>
          </button>

          <button
            onClick={() => {
              setActiveNavTab("contests");
              document.getElementById("ongoing-contests")?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`flex flex-col items-center justify-center gap-1 w-14 transition-colors ${
              activeNavTab === "contests" ? "text-brand-purple" : "text-brand-muted hover:text-brand-text"
            }`}
          >
            <Trophy className={`w-5 h-5 ${activeNavTab === "contests" ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
            <span className="text-[10px] font-bold">{t.mobileNav.contests}</span>
          </button>

          <div className="relative -top-5 flex items-center justify-center">
            <button
              onClick={() => {
                if (!currentUser) setIsAuthModalOpen(true);
                else setIsUploadModalOpen(true);
              }}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-deep to-brand-purple text-white flex items-center justify-center shadow-xl shadow-brand-purple/40 border-4 border-white active:scale-90 transition-transform"
              aria-label={t.mobileNav.upload}
            >
              <Plus className="w-7 h-7 stroke-[3]" />
            </button>
          </div>

          <Link
            href="/rewards"
            className="flex flex-col items-center justify-center gap-1 w-14 text-brand-muted hover:text-brand-text transition-colors"
          >
            <Gift className="w-5 h-5 stroke-[1.75]" />
            <span className="text-[10px] font-bold">{t.mobileNav.rewards}</span>
          </Link>

          <button
            onClick={() => {
              if (!currentUser) setIsAuthModalOpen(true);
              else handleOpenEditProfile();
            }}
            className="flex flex-col items-center justify-center gap-1 w-14 text-brand-muted hover:text-brand-text transition-colors"
          >
            <UserIcon className="w-5 h-5 stroke-[1.75]" />
            <span className="text-[10px] font-bold">{t.mobileNav.profile}</span>
          </button>

        </div>
      </nav>

      {/* ==================================================== */}
      {/* ৮. ফুলস্ক্রিন লাইটবক্স প্রিভিউ মোডাল                   */}
      {/* ==================================================== */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-8 animate-in fade-in duration-200">
          <button
            onClick={() => setPreviewPhoto(null)}
            className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-zinc-700"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-6xl w-full max-h-[92vh] flex flex-col lg:flex-row items-center gap-6 overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl">
            <div className="relative w-full lg:w-2/3 h-[50vh] lg:h-[80vh] bg-black flex items-center justify-center p-2">
              <img
                src={getPhotoUrl(previewPhoto)}
                alt={previewPhoto.title}
                className="max-h-full max-w-full object-contain rounded-2xl"
              />
            </div>

            <div className="w-full lg:w-1/3 p-6 space-y-6 flex flex-col justify-between overflow-y-auto text-white">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-zinc-900 text-amber-400 border border-zinc-800 uppercase font-mono">
                    {previewPhoto.aspectRatio === "RATIO_9_16" ? "৯:১৬ পোর্ট্রেট" : "১৬:৯ ল্যান্ডস্কেপ"}
                  </span>
                  {previewPhoto.isAiGenerated && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-violet-600/90 text-white flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> {t.gallery.badgeAi}
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-400">
                    বিভাগ: {previewPhoto.category}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-black text-white">{previewPhoto.title}</h2>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                  {previewPhoto.user?.avatarUrl ? (
                    <img
                      src={previewPhoto.user.avatarUrl}
                      alt={previewPhoto.user.name}
                      className="w-11 h-11 rounded-full object-cover border border-amber-400"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-brand-gold text-brand-text font-black text-base flex items-center justify-center">
                      {previewPhoto.user?.name ? previewPhoto.user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                      <span>{previewPhoto.user?.name}</span>
                      {previewPhoto.user?.badge === "BLUE_VERIFIED" && <CheckCircle className="w-4 h-4 text-sky-400" />}
                      {previewPhoto.user?.badge === "FIRE_CREATOR" && <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />}
                    </div>
                    <span className="text-xs text-zinc-400">{previewPhoto.user?.location || "বাংলাদেশ"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">{t.hero.totalVotes}</span>
                    <div className="text-lg font-black text-rose-500 flex items-center justify-center gap-1 mt-0.5">
                      <Heart className="w-4 h-4 fill-rose-500" />
                      <span>{toBengaliNumber(previewPhoto.voteCount || 0)}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">কোয়ালিটি</span>
                    <div className="text-sm font-bold text-amber-400 mt-1 font-mono">720p • 1080p • 2K</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-zinc-900">
                <button
                  onClick={() => {
                    setVotingPhoto(previewPhoto);
                  }}
                  disabled={previewPhoto.hasVoted}
                  className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 ${
                    previewPhoto.hasVoted
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : "bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20 font-black"
                  }`}
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>{previewPhoto.hasVoted ? t.gallery.votedBtn : t.gallery.voteBtn}</span>
                </button>

                <button
                  onClick={() => {
                    setDownloadPhoto(previewPhoto);
                  }}
                  className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs flex items-center justify-center gap-2 border border-zinc-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.gallery.downloadBtnTitle}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* ৯. মোডাল: ফটো আপলোডার                               */}
      {/* ==================================================== */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-brand-text space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar border border-brand-border">
            <div className="flex justify-between items-center border-b border-brand-border pb-3">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-brand-purple" />
                <h3 className="font-extrabold text-sm">{t.modals.upload.heading}</h3>
              </div>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-brand-muted hover:text-brand-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePhotoSubmit} className="space-y-3.5">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={photoInputRef}
                  onChange={handlePhotoFileSelect}
                  className="hidden"
                />
                <div
                  onClick={() => photoInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-brand-purple rounded-2xl p-4 text-center cursor-pointer bg-slate-50 transition-colors"
                >
                  {uploadImageBase64 ? (
                    <div className="space-y-2">
                      <img
                        src={uploadImageBase64}
                        alt="Upload Preview"
                        className="max-h-40 mx-auto rounded-xl object-contain"
                      />
                      <span className="text-[11px] text-emerald-600 font-bold block">
                        {t.modals.upload.selectedReady}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 py-4">
                      <UploadCloud className="w-8 h-8 text-brand-purple" />
                      <span className="text-xs font-bold text-brand-text">
                        {t.modals.upload.selectPrompt}
                      </span>
                      <span className="text-[10px] text-brand-muted">{t.modals.upload.fileHint}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-brand-muted block mb-1">
                  {t.modals.upload.titleLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.modals.upload.titlePlaceholder}
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-brand-border rounded-xl px-3 py-2 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-brand-muted block mb-1">{t.modals.upload.categoryLabel}</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-brand-border rounded-xl px-3 py-2 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-sans"
                  >
                    <option value="Nature">প্রকৃতি (Nature)</option>
                    <option value="Street">রাস্তাঘাট (Street)</option>
                    <option value="Portrait">পোর্ট্রেট (Portrait)</option>
                    <option value="Wallpaper">ওয়ালপেপার (Wallpaper)</option>
                    <option value="Abstract">এবস্ট্রাক্ট (Abstract)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-brand-muted block mb-1">{t.modals.upload.contestLabel}</label>
                  <select
                    value={uploadContestId}
                    onChange={(e) => setUploadContestId(e.target.value)}
                    className="w-full bg-slate-50 border border-brand-border rounded-xl px-3 py-2 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-sans"
                  >
                    {contests.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.tier === "HOURLY_24" ? "২৪ ঘণ্টা" : c.tier === "WEEKLY_7D" ? "৭ দিন" : "৩০ দিন"} ({toBengaliNumber(c.prizePool)} USD)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-brand-border space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={uploadIsAi}
                    onChange={(e) => setUploadIsAi(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-purple focus:ring-0"
                  />
                  <span className="text-xs font-bold text-brand-text flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                    <span>{t.modals.upload.aiCheckbox}</span>
                  </span>
                </label>

                {uploadIsAi && (
                  <input
                    type="text"
                    placeholder={t.modals.upload.aiInputPlaceholder}
                    value={uploadAiModel}
                    onChange={(e) => setUploadAiModel(e.target.value)}
                    className="w-full bg-white border border-brand-border rounded-lg px-2.5 py-1.5 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-sans"
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={uploadLoading}
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-brand-purple to-brand-deep hover:opacity-95 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-md shadow-brand-purple/20"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>{uploadLoading ? t.modals.upload.uploading : t.modals.upload.submitBtn}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* ১০. মোডাল: প্রোফাইল এডিটর                           */}
      {/* ==================================================== */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-white border border-brand-border rounded-3xl max-w-md w-full p-6 text-brand-text space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-brand-border pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-brand-purple" />
                <h3 className="font-extrabold text-sm">{t.modals.profile.heading}</h3>
              </div>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-brand-muted hover:text-brand-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="flex flex-col items-center justify-center space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={avatarInputRef}
                  onChange={handleAvatarFileSelect}
                  className="hidden"
                />
                <div
                  onClick={() => avatarInputRef.current?.click()}
                  className="relative w-20 h-20 rounded-full border-2 border-dashed border-brand-purple hover:border-brand-deep p-0.5 cursor-pointer group overflow-hidden bg-slate-50 flex items-center justify-center shadow-md shadow-brand-purple/10"
                >
                  {profileAvatar ? (
                    <img
                      src={profileAvatar}
                      alt="Avatar Preview"
                      className="w-full h-full rounded-full object-cover group-hover:opacity-75 transition-opacity"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-brand-muted group-hover:text-brand-purple transition-colors">
                      <Camera className="w-6 h-6 mb-0.5" />
                      <span className="text-[9px] font-bold">ছবি দিন</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full text-white">
                    <Camera className="w-5 h-5" />
                  </div>
                </div>
                <span className="text-[10px] text-brand-muted">
                  {profileAvatar ? t.modals.profile.avatarReady : t.modals.profile.avatarNotice}
                </span>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-brand-muted block mb-1">{t.modals.profile.fullName}</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-slate-50 border border-brand-border rounded-xl px-3 py-2 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-sans"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-brand-muted block mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-brand-purple" />
                  <span>{t.modals.profile.phone}</span>
                </label>
                <input
                  type="text"
                  placeholder="017XXXXXXXX"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full bg-slate-50 border border-brand-border rounded-xl px-3 py-2 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-brand-muted block mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-purple" />
                  <span>{t.modals.profile.location}</span>
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ঢাকা, বাংলাদেশ"
                  value={profileLocation}
                  onChange={(e) => setProfileLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-brand-border rounded-xl px-3 py-2 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-sans"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-brand-muted block mb-1">{t.modals.profile.bio}</label>
                <textarea
                  rows={2}
                  placeholder="আপনার ফটোগ্রাফি অভিজ্ঞতা..."
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  className="w-full bg-slate-50 border border-brand-border rounded-xl px-3 py-2 text-xs text-brand-text focus:outline-none focus:border-brand-purple resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="w-full py-2.5 rounded-full bg-brand-purple hover:bg-brand-deep disabled:opacity-50 text-white font-bold text-xs transition-transform active:scale-95 shadow-md shadow-brand-purple/20"
              >
                {profileLoading ? t.modals.profile.saving : t.modals.profile.saveBtn}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* ১১. মোডাল: পেমেন্ট প্রুফ লাইটবক্স                   */}
      {/* ==================================================== */}
      {viewingProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-sm w-full p-5 text-white space-y-4 shadow-2xl relative text-center">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <span className="text-xs font-bold text-emerald-400">💸 ভেরিফায়েড পেমেন্ট রসিদ</span>
              <button onClick={() => setViewingProof(null)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-black flex items-center justify-center max-h-[70vh]">
              <img src={viewingProof.proofImage} alt="Payment Proof" className="max-h-[65vh] object-contain w-full" />
            </div>

            <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex justify-between items-center text-xs">
              <div>
                <div className="font-bold text-white text-left">{viewingProof.userName}</div>
                <div className="text-[10px] text-zinc-400 text-left font-mono">{viewingProof.gateway}</div>
              </div>
              <div className="font-bold text-emerald-400 text-sm">{viewingProof.amount}</div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* ১২. মোডাল: ইউজার অথ (রেজিস্ট্রেশন ও লগইন)            */}
      {/* ==================================================== */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-white border border-brand-border rounded-3xl max-w-sm w-full p-6 text-brand-text space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-brand-border pb-3">
              <h3 className="font-extrabold text-sm text-brand-purple">
                {authMode === "REGISTER" ? t.modals.auth.registerHeading : t.modals.auth.loginHeading}
              </h3>
              <button onClick={() => setIsAuthModalOpen(false)} className="text-brand-muted hover:text-brand-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            {authMode === "REGISTER" && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs text-amber-900">
                <Sparkles className="w-4 h-4 flex-shrink-0 text-amber-500" />
                <span>{t.modals.auth.bonusNotice}</span>
              </div>
            )}

           {/* ১-ক্লিক গুগল সাইন ইন বাটন */}
            <div className="space-y-3">
              <a
                href="/api/auth/signin/google"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-brand-text font-bold text-xs flex items-center justify-center gap-3 border border-slate-200 shadow-sm transition-all active:scale-95"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google দিয়ে চালিয়ে যান (Continue with Google)</span>
              </a>

              <div className="flex items-center gap-2 text-slate-300">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-[10px] uppercase font-bold text-slate-400">অথবা ইমেইল দিয়ে</span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>
            </div> 

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {authMode === "REGISTER" && (
                <div>
                  <label className="text-[11px] font-semibold text-brand-muted block mb-1">{t.modals.auth.fullNameLabel}</label>
                  <input
                    type="text"
                    required
                    placeholder={t.modals.auth.fullNamePlaceholder}
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full bg-slate-50 border border-brand-border rounded-xl px-3 py-2 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-sans"
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold text-brand-muted block mb-1">{t.modals.auth.emailLabel}</label>
                <input
                  type="email"
                  required
                  placeholder={t.modals.auth.emailPlaceholder}
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-brand-border rounded-xl px-3 py-2 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-brand-muted block mb-1">{t.modals.auth.passwordLabel}</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-brand-border rounded-xl px-3 py-2 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-brand-purple to-brand-deep hover:opacity-95 disabled:opacity-50 text-white font-bold text-xs transition-transform active:scale-95 shadow-md shadow-brand-purple/20"
              >
                {authLoading
                  ? t.modals.auth.processing
                  : authMode === "REGISTER"
                  ? t.modals.auth.registerBtn
                  : t.modals.auth.loginBtn}
              </button>
            </form>

            <div className="pt-2 border-t border-brand-border text-center">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === "REGISTER" ? "LOGIN" : "REGISTER")}
                className="text-xs text-brand-muted hover:text-brand-purple font-semibold transition-colors"
              >
                {authMode === "REGISTER"
                  ? t.modals.auth.toLoginPrompt
                  : t.modals.auth.toRegisterPrompt}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* ১৩. মোডাল: স্পন্সরড ভোটিং অ্যাড-গেট                   */}
      {/* ==================================================== */}
      {votingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-white border border-brand-border rounded-3xl max-w-md w-full p-6 text-brand-text space-y-4 shadow-2xl relative text-center">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-purple" />
                <span className="font-bold text-xs text-brand-purple">
                  {t.modals.votingGate.heading}
                </span>
              </div>
              <button onClick={() => setVotingPhoto(null)} className="text-brand-muted hover:text-brand-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-sm text-brand-text">
                {t.modals.votingGate.subheading}
              </h3>
              <p className="text-xs text-brand-muted">
                {t.modals.votingGate.targetText(votingPhoto.title)}
              </p>
            </div>

            <div className="my-2 flex justify-center">
              <AdSlot zoneId="32346376" width={300} height={250} />
            </div>

            <div className="space-y-2">
              {canConfirmVote ? (
                <button
                  onClick={handleConfirmVote}
                  className="w-full py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-transform active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.modals.votingGate.confirmBtn}</span>
                </button>
              ) : (
                <div className="w-full py-3 rounded-full bg-slate-100 border border-slate-200 text-brand-muted font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed">
                  <span className="inline-block w-2 h-2 rounded-full bg-brand-purple animate-ping" />
                  <span>{t.modals.votingGate.waiting(toBengaliNumber(voteCountdown))}</span>
                </div>
              )}

              <div className="pt-2 border-t border-brand-border flex items-center justify-between text-xs">
                <span className="text-brand-muted flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.modals.votingGate.balanceText(toBengaliNumber(currentUser?.pointsBalance ?? 50))}</span>
                </span>
                <button
                  onClick={handleSkipVoteWithPoints}
                  className="text-brand-purple hover:underline font-bold transition-colors"
                >
                  {t.modals.votingGate.skipWithPoints}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* ১৪. মোডাল: ৪-লেয়ার ছবির কোয়ালিটি ও ডাউনলোড           */}
      {/* ==================================================== */}
      {downloadPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-white border border-brand-border rounded-3xl max-w-md w-full p-6 text-brand-text space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-brand-border pb-3">
              <h3 className="font-extrabold text-sm">{t.modals.download.heading}</h3>
              <button
                onClick={() => {
                  setDownloadPhoto(null);
                  setIsVerifyingDownload(false);
                }}
                className="text-brand-muted hover:text-brand-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isVerifyingDownload ? (
              <div className="space-y-2.5">
                <div
                  onClick={() => setSelectedTier("720P_WM")}
                  className={`p-3 rounded-2xl border cursor-pointer flex justify-between items-center transition-all ${
                    selectedTier === "720P_WM"
                      ? "border-brand-purple bg-brand-purple/5"
                      : "border-slate-100 bg-slate-50"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">{t.modals.download.tier720WmTitle}</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        {t.modals.download.tier720WmTag}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-muted mt-0.5">{t.modals.download.tier720WmDesc}</p>
                  </div>
                  <span className="font-bold text-emerald-600 text-xs">{t.modals.download.freeBadge}</span>
                </div>

                <div
                  onClick={() => setSelectedTier("720P_CLEAN")}
                  className={`p-3 rounded-2xl border cursor-pointer flex justify-between items-center transition-all ${
                    selectedTier === "720P_CLEAN"
                      ? "border-brand-purple bg-brand-purple/5"
                      : "border-slate-100 bg-slate-50"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">{t.modals.download.tier720CleanTitle}</span>
                      <span className="text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                        {t.modals.download.tier720CleanTag}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-muted mt-0.5">{t.modals.download.tier720CleanDesc}</p>
                  </div>
                  <span className="font-bold text-amber-600 text-xs">{t.modals.download.unlockBadge}</span>
                </div>

                <div
                  onClick={() => setSelectedTier("1080P")}
                  className={`p-3 rounded-2xl border cursor-pointer flex justify-between items-center transition-all ${
                    selectedTier === "1080P"
                      ? "border-brand-purple bg-brand-purple/5"
                      : "border-slate-100 bg-slate-50"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">{t.modals.download.tier1080Title}</span>
                      <span className="text-[9px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-black">
                        {t.modals.download.tier1080Tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-muted mt-0.5">{t.modals.download.tier1080Desc}</p>
                  </div>
                  <span className="font-bold text-sky-600 text-xs">{t.modals.download.unlockBadge}</span>
                </div>

                <div
                  onClick={() => setSelectedTier("2K")}
                  className={`p-3 rounded-2xl border cursor-pointer flex justify-between items-center transition-all ${
                    selectedTier === "2K"
                      ? "border-brand-purple bg-brand-purple/5"
                      : "border-slate-100 bg-slate-50"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">{t.modals.download.tier2kTitle}</span>
                      <Sparkles className="w-3 h-3 text-brand-purple animate-pulse" />
                    </div>
                    <p className="text-[11px] text-brand-muted mt-0.5">{t.modals.download.tier2kDesc}</p>
                  </div>
                  <span className="font-bold text-brand-purple text-xs">{t.modals.download.unlockBadge}</span>
                </div>

                <button
                  onClick={() => {
                    if (selectedTier === "720P_WM") {
                      handleExecuteDownload(downloadPhoto, "720p_watermarked");
                    } else {
                      setUnlockStep(1);
                      setIsVerifyingDownload(true);
                    }
                  }}
                  className="w-full py-3 rounded-full bg-brand-purple hover:bg-brand-deep text-white font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md shadow-brand-purple/20"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {selectedTier === "720P_WM"
                      ? t.modals.download.downloadFreeBtn
                      : t.modals.download.proceedUnlockBtn(selectedTier === "720P_CLEAN" ? "৭২০p" : selectedTier === "1080P" ? "১০৮০p" : "২কে")}
                  </span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-center">
                <span className="text-xs text-brand-purple font-bold">
                  {t.modals.download.stepVerification(toBengaliNumber(unlockStep), toBengaliNumber(selectedTier === "2K" ? 2 : 1))}
                </span>

                <div className="my-2 flex justify-center">
                  <AdSlot zoneId="32346376" width={300} height={250} />
                </div>

                {canDownload ? (
                  <button
                    onClick={() => {
                      if (selectedTier === "2K" && unlockStep === 1) {
                        setUnlockStep(2);
                      } else {
                        handleExecuteDownload(downloadPhoto, selectedTier);
                      }
                    }}
                    className="w-full py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {selectedTier === "2K" && unlockStep === 1
                        ? t.modals.download.continueStep2
                        : t.modals.download.downloadNow}
                    </span>
                  </button>
                ) : (
                  <div className="w-full py-3 rounded-full bg-slate-100 border border-slate-200 text-brand-muted font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed">
                    <span className="inline-block w-2 h-2 rounded-full bg-brand-purple animate-ping" />
                    <span>স্পন্সর চেক করা হচ্ছে... ({toBengaliNumber(unlockCountdown)} সেকেন্ড)</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}