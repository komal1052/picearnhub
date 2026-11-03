"use client";

import { useState, useEffect } from "react";
import {
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
  Camera,
  Maximize2,
  Share2
} from "lucide-react";
import SocialBar from "./SocialBar";

interface HomeExperienceProps {
  contests: any[];
  photos: any[];
  announcements: any[];
  winnerPhoto: any;
}

export default function HomeExperience({
  contests,
  photos: initialPhotos,
  announcements,
}: HomeExperienceProps) {
  const [activeFilter, setActiveFilter] = useState<"ALL" | "16:9" | "9:16" | "FREE" | "AI">("ALL");
  const [photoList, setPhotoList] = useState(initialPhotos);
  const [mounted, setMounted] = useState(false);

  // Full Screen Preview Modal State
  const [previewPhoto, setPreviewPhoto] = useState<any | null>(null);

  // User State
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"LOGIN" | "REGISTER">("REGISTER");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Profile Edit Modal States
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileLocation, setProfileLocation] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Voting Modal States
  const [votingPhoto, setVotingPhoto] = useState<any | null>(null);
  const [voteCountdown, setVoteCountdown] = useState(6);
  const [canConfirmVote, setCanConfirmVote] = useState(false);

  // Download Modal States
  const [downloadPhoto, setDownloadPhoto] = useState<any | null>(null);
  const [selectedTier, setSelectedTier] = useState<"720P_WM" | "720P_CLEAN" | "1080P" | "2K">("720P_WM");
  const [unlockStep, setUnlockStep] = useState(1);
  const [unlockCountdown, setUnlockCountdown] = useState(6);
  const [canDownload, setCanDownload] = useState(false);
  const [isVerifyingDownload, setIsVerifyingDownload] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const triggerAdsterraDirectLink = () => {
    const directLink = process.env.NEXT_PUBLIC_ADSTERRA_DIRECT_LINK;
    if (directLink && !directLink.includes("your_direct_link")) {
      window.open(directLink, "_blank", "noopener,noreferrer");
    }
  };

  // Voting Timer
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

  // Download Timer
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

  const handleConfirmVote = () => {
    if (!votingPhoto) return;
    setPhotoList((prev) =>
      prev.map((p) =>
        p.id === votingPhoto.id ? { ...p, voteCount: p.voteCount + 1, hasVoted: true } : p
      )
    );
    if (previewPhoto && previewPhoto.id === votingPhoto.id) {
      setPreviewPhoto((prev: any) => ({ ...prev, voteCount: prev.voteCount + 1, hasVoted: true }));
    }
    setVotingPhoto(null);
  };

  const handleSkipVoteWithPoints = () => {
    if (!currentUser || currentUser.pointsBalance < 2) {
      alert("Please log in or earn points to skip ads!");
      return;
    }
    setCurrentUser((prev: any) => ({ ...prev, pointsBalance: prev.pointsBalance - 2 }));
    handleConfirmVote();
  };

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
        alert(authMode === "REGISTER" ? "Account created! 50 Points awarded 🎉" : "Logged in successfully!");
      } else {
        alert(data.error);
      }
    } catch {
      alert("Network error.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOpenEditProfile = () => {
    if (!currentUser) return;
    setProfileName(currentUser.name || "");
    setProfilePhone(currentUser.phone || "");
    setProfileBio(currentUser.bio || "");
    setProfileLocation(currentUser.location || "Dhaka, Bangladesh");
    setProfileAvatar(currentUser.avatarUrl || "");
    setIsProfileModalOpen(true);
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
        alert("Profile details updated successfully! ✅");
      } else {
        alert(data.error);
      }
    } catch {
      alert("Failed to update profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const getPhotoUrl = (photo: any) => {
    if (photo.title.includes("Padma")) return "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600";
    if (photo.title.includes("Rickshaw")) return "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600";
    if (photo.title.includes("Cyberpunk")) return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600";
    return "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1600";
  };

  const filteredPhotos = photoList.filter((p) => {
    if (activeFilter === "16:9") return p.aspectRatio === "RATIO_16_9";
    if (activeFilter === "9:16") return p.aspectRatio === "RATIO_9_16";
    if (activeFilter === "FREE") return p.isFree;
    if (activeFilter === "AI") return p.isAiGenerated;
    return true;
  });

  return (
    <div className="space-y-8">
      <SocialBar />

      {/* ==================================================== */}
      {/* 0. TOP NAVBAR WITH LOGO & USER PROFILE               */}
      {/* ==================================================== */}
      <header className="flex justify-between items-center border-b border-zinc-800 pb-4">
        {/* Brand Logo (Supports custom logo.png with vector fallback) */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-black flex items-center justify-center font-black shadow-lg shadow-amber-500/20 overflow-hidden">
            <img
              src="/logo.png"
              alt="PicEarnHub Logo"
              onError={(e) => {
                // If logo.png doesn't exist, hide image and show Camera icon
                e.currentTarget.style.display = "none";
              }}
              className="w-full h-full object-cover"
            />
            <Camera className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight leading-none">
              PicEarn<span className="text-amber-400">Hub.</span>
            </h1>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
              Photo Contests & Digital Rewards
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-amber-400 text-xs font-bold">
                <Coins className="w-4 h-4" />
                <span>{currentUser.pointsBalance} Pts</span>
              </div>

              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 pl-2 pr-3 py-1.5 rounded-xl">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full object-cover border border-amber-400"
                  />
                ) : (
                  <UserIcon className="w-4 h-4 text-zinc-400" />
                )}
                <span className="text-xs font-bold text-white max-w-[120px] truncate">{currentUser.name}</span>

                <button
                  onClick={handleOpenEditProfile}
                  className="p-1 rounded-md text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 transition-colors"
                  title="Edit Profile Data"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setCurrentUser(null)}
                  className="p-1 rounded-md text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="py-2 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition-transform active:scale-95 shadow-md shadow-amber-400/20"
            >
              লগইন / রেজিস্টার (Sign In)
            </button>
          )}
        </div>
      </header>

      {/* ==================================================== */}
      {/* 1. HERO SECTION: WINNER SPOTLIGHT & BULLETIN         */}
      {/* ==================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div
          onClick={() => {
            const winner = photoList.find((p) => p.title.includes("Tiger"));
            if (winner) setPreviewPhoto(winner);
          }}
          className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl h-[420px] group flex flex-col justify-end p-6 cursor-pointer"
        >
          <img
            src="https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1600"
            alt="Winner Photo"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

          <div className="absolute top-5 left-5 z-10 flex items-center gap-2 bg-amber-400 text-black px-3.5 py-1.5 rounded-full font-black text-xs uppercase tracking-wider shadow-lg">
            <Trophy className="w-4 h-4" />
            <span>Grand Contest Winner &bull; $50.00 Won</span>
          </div>

          <div className="absolute top-5 right-5 z-10 bg-black/60 backdrop-blur-md p-2 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-4 h-4" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                মুনসুন রিফ্লেকশন চ্যালেঞ্জ (বিগত বিজয়ী)
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                Bengal Tiger Gaze at Dawn
              </h2>

              <div className="flex items-center gap-3 bg-black/70 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 w-fit">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
                  alt="Tanvir Hasan"
                  className="w-10 h-10 rounded-full object-cover border border-amber-400"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                    <span>Tanvir Hasan</span>
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  </div>
                  <span className="text-xs text-zinc-400">Dhaka, Bangladesh</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-zinc-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-zinc-700 text-white self-start md:self-end">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <div>
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Winning Votes</div>
                <div className="font-mono font-black text-base leading-none">180 Votes</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 rounded-3xl bg-zinc-950 border border-zinc-800 p-5 flex flex-col justify-between shadow-2xl space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Megaphone className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Bulletin & Live Notices</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-900 text-amber-400 border border-zinc-800">
                LIVE
              </span>
            </div>

            <div className="space-y-3 divide-y divide-zinc-900">
              {announcements.map((a) => (
                <div key={a.id} className="pt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                      {a.badgeTag}
                    </span>
                    <span className="text-[11px] text-zinc-500">Notice</span>
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-200 leading-snug">{a.title}</h4>
                </div>
              ))}
            </div>
          </div>

          <div
            onClick={triggerAdsterraDirectLink}
            className="p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 text-center space-y-1 cursor-pointer hover:border-amber-400/40 transition-colors"
          >
            <div className="flex items-center justify-between text-[9px] uppercase tracking-widest text-zinc-500">
              <span>Sponsored Offer</span>
              <ExternalLink className="w-3 h-3 text-amber-400" />
            </div>
            <div className="h-32 bg-zinc-900 rounded-xl flex items-center justify-center text-xs text-zinc-500 font-bold border border-dashed border-zinc-800">
              [Click to View Sponsor &bull; 300x250]
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 2. ACTIVE CONTESTS TICKER                            */}
      {/* ==================================================== */}
      <section className="space-y-3">
        <h2 className="text-base font-extrabold text-white flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Active Contests & Prize Pools (চলমান কনটেস্ট)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contests.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-amber-400/50 transition-colors space-y-2 flex flex-col justify-between"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-zinc-900 text-amber-400 border border-zinc-800">
                  {c.tier}
                </span>
                <span className="text-emerald-400 font-mono font-black text-sm">
                  ${Number(c.prizePool).toFixed(2)} Prize
                </span>
              </div>
              <h3 className="font-extrabold text-xs text-zinc-100">{c.title}</h3>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 pt-2 border-t border-zinc-900">
                <Calendar className="w-3 h-3 text-amber-400" />
                <span>Ends: {mounted ? new Date(c.endTime).toLocaleDateString() : "Active"}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 3. FILTER PILLS                                      */}
      {/* ==================================================== */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
          {(["ALL", "16:9", "9:16", "FREE", "AI"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeFilter === tab
                  ? "bg-amber-400 text-black shadow-lg shadow-amber-400/20 font-black"
                  : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-900"
              }`}
            >
              {tab === "ALL" && "🔥 All Items (সব ছবি)"}
              {tab === "16:9" && "🖥 Landscape (16:9)"}
              {tab === "9:16" && "📱 Portrait (9:16)"}
              {tab === "FREE" && "🆓 Free (720p)"}
              {tab === "AI" && "✨ AI Generated Art"}
            </button>
          ))}
        </div>

        {/* ==================================================== */}
        {/* 4. GALLERY PHOTO GRID                                */}
        {/* ==================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              {/* Image Container: Clicking opens Full Image Lightbox */}
              <div
                onClick={() => setPreviewPhoto(photo)}
                className="relative cursor-pointer"
              >
                <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
                  <div className="flex gap-1.5">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-zinc-300 border border-white/10 uppercase">
                      {photo.aspectRatio === "RATIO_9_16" ? "9:16" : "16:9"}
                    </span>
                    {photo.isAiGenerated && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-violet-600/90 text-white shadow-md">
                        <Sparkles className="w-2.5 h-2.5" /> AI Art
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-400 text-black uppercase">
                    HD / 2K
                  </span>
                </div>

                <div
                  className={`relative w-full bg-zinc-900 overflow-hidden ${
                    photo.aspectRatio === "RATIO_9_16" ? "aspect-[9/16]" : "aspect-[16/9]"
                  }`}
                >
                  <img
                    src={getPhotoUrl(photo)}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>বড় করে দেখুন (Full View)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Photo Meta & Actions */}
              <div className="p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="max-w-[170px]">
                    <h3 className="text-xs font-bold text-white truncate">{photo.title}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[11px] text-zinc-400 truncate">{photo.user.name}</span>
                      {photo.user.badge === "BLUE_VERIFIED" && (
                        <CheckCircle className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                      )}
                      {photo.user.badge === "FIRE_CREATOR" && (
                        <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 flex-shrink-0" />
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setDownloadPhoto(photo)}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors border border-zinc-800"
                    title="Unlock Resolutions"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => setVotingPhoto(photo)}
                  disabled={photo.hasVoted}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-transform active:scale-[0.98] ${
                    photo.hasVoted
                      ? "bg-rose-500/15 text-rose-400 border border-rose-500/30 cursor-default"
                      : "bg-zinc-900 hover:bg-amber-400 hover:text-black text-white border border-zinc-800 shadow-md"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${photo.hasVoted ? "fill-rose-500 text-rose-500" : ""}`} />
                  <span>{photo.hasVoted ? "Voted (ভোট সম্পন্ন)" : "Vote Entry (ভোট দিন)"}</span>
                  <span className="opacity-40">&bull;</span>
                  <span className="font-mono">{photo.voteCount}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 5. CINEMATIC FULLSCREEN PICTURE PREVIEW (LIGHTBOX)   */}
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
            {/* Main Picture Display (Full Aspect View) */}
            <div className="relative w-full lg:w-2/3 h-[50vh] lg:h-[80vh] bg-black flex items-center justify-center p-2">
              <img
                src={getPhotoUrl(previewPhoto)}
                alt={previewPhoto.title}
                className="max-h-full max-w-full object-contain rounded-2xl"
              />
            </div>

            {/* Photo Details & Controls Sidebar */}
            <div className="w-full lg:w-1/3 p-6 space-y-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-zinc-900 text-amber-400 border border-zinc-800 uppercase">
                    {previewPhoto.aspectRatio === "RATIO_9_16" ? "9:16 Portrait" : "16:9 Landscape"}
                  </span>
                  {previewPhoto.isAiGenerated && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-violet-600/90 text-white flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Art
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-400">
                    Category: {previewPhoto.category}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-black text-white">{previewPhoto.title}</h2>

                {/* Creator Profile */}
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                  <img
                    src={previewPhoto.user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                    alt={previewPhoto.user.name}
                    className="w-11 h-11 rounded-full object-cover border border-amber-400"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                      <span>{previewPhoto.user.name}</span>
                      {previewPhoto.user.badge === "BLUE_VERIFIED" && <CheckCircle className="w-4 h-4 text-sky-400" />}
                      {previewPhoto.user.badge === "FIRE_CREATOR" && <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />}
                    </div>
                    <span className="text-xs text-zinc-400">{previewPhoto.user.location || "Bangladesh"}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase font-semibold">Total Votes</span>
                    <div className="text-lg font-black text-rose-500 flex items-center justify-center gap-1 mt-0.5">
                      <Heart className="w-4 h-4 fill-rose-500" />
                      <span>{previewPhoto.voteCount}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase font-semibold">Quality Tiers</span>
                    <div className="text-sm font-black text-amber-400 mt-1">720p &bull; 1080p &bull; 2K</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4 border-t border-zinc-900">
                <button
                  onClick={() => {
                    setVotingPhoto(previewPhoto);
                  }}
                  disabled={previewPhoto.hasVoted}
                  className={`w-full py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-transform active:scale-95 ${
                    previewPhoto.hasVoted
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : "bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20"
                  }`}
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>{previewPhoto.hasVoted ? "Already Voted (ভোট দিয়েছেন)" : "Vote for this Photo (ভোট দিন)"}</span>
                </button>

                <button
                  onClick={() => {
                    setDownloadPhoto(previewPhoto);
                  }}
                  className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs flex items-center justify-center gap-2 border border-zinc-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resolutions (ডাউনলোড অপশন)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 6. EDIT USER PROFILE MODAL                           */}
      {/* ==================================================== */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <h3 className="font-extrabold text-sm text-white">প্রোফাইল আপডেট করুন (Edit Profile)</h3>
              </div>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">পূর্ণ নাম (Full Name)</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-amber-400" />
                  <span>মোবাইল নম্বর (Phone / bKash / Nagad Number)</span>
                </label>
                <input
                  type="text"
                  placeholder="017XXXXXXXX"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>ঠিকানা / শহর (City / Address)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka, Bangladesh"
                  value={profileLocation}
                  onChange={(e) => setProfileLocation(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1 flex items-center gap-1">
                  <Camera className="w-3 h-3 text-amber-400" />
                  <span>প্রোফাইল ছবির লিংক (Profile Picture URL)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={profileAvatar}
                  onChange={(e) => setProfileAvatar(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">ছোট বিবরণ / বায়ো (Short Bio)</label>
                <textarea
                  rows={2}
                  placeholder="Passionate landscape & street photographer..."
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-black text-xs transition-transform active:scale-95"
              >
                {profileLoading ? "Updating..." : "Save Profile (সংরক্ষণ করুন)"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 7. USER AUTH MODAL (REGISTRATION & LOGIN)            */}
      {/* ==================================================== */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-sm w-full p-6 text-white space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-extrabold text-sm text-amber-400">
                {authMode === "REGISTER" ? "নতুন একাউন্ট তৈরি করুন" : "আপনার একাউন্টে লগইন করুন"}
              </h3>
              <button onClick={() => setIsAuthModalOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {authMode === "REGISTER" && (
              <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center gap-2 text-xs text-amber-300">
                <Sparkles className="w-4 h-4 flex-shrink-0 text-amber-400" />
                <span>রেজিস্টার করলেই পাবেন ৫০ পয়েন্ট ফ্রি ওয়েলকাম বোনাস!</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {authMode === "REGISTER" && (
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">আপনার নাম (Full Name)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">ইমেইল (Unique Email)</label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">পাসওয়ার্ড (Password)</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-black text-xs transition-transform active:scale-95"
              >
                {authLoading
                  ? "Processing..."
                  : authMode === "REGISTER"
                  ? "Create Account (+50 Pts)"
                  : "Sign In"}
              </button>
            </form>

            <div className="pt-2 border-t border-zinc-900 text-center">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === "REGISTER" ? "LOGIN" : "REGISTER")}
                className="text-xs text-zinc-400 hover:text-amber-400 transition-colors"
              >
                {authMode === "REGISTER"
                  ? "আগে থেকেই একাউন্ট আছে? লগইন করুন"
                  : "একাউন্ট নেই? নতুন একাউন্ট খুলুন (+৫০ পয়েন্ট)"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 8. SPONSORED VOTING MODAL                            */}
      {/* ==================================================== */}
      {votingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl relative text-center">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span className="font-black text-xs text-amber-400 uppercase tracking-wider">
                  Human Verification for Vote
                </span>
              </div>
              <button onClick={() => setVotingPhoto(null)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-sm text-zinc-100">
                ভোট নিশ্চিত করতে স্পন্সর বিজ্ঞাপনটি দেখুন
              </h3>
              <p className="text-xs text-zinc-400">
                Voting for: <b className="text-white">"{votingPhoto.title}"</b>
              </p>
            </div>

            <div
              onClick={triggerAdsterraDirectLink}
              className="h-44 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center text-xs text-zinc-500 font-bold space-y-1 cursor-pointer hover:border-amber-400/40"
            >
              <div className="flex items-center gap-1 text-amber-400 text-[10px] uppercase">
                <span>Adsterra Sponsored Offer</span>
                <ExternalLink className="w-3 h-3" />
              </div>
              <span>[Click to visit sponsor &bull; 300x250]</span>
            </div>

            <div className="space-y-2">
              {canConfirmVote ? (
                <button
                  onClick={handleConfirmVote}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-transform active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Vote Now (ভোট নিশ্চিত করুন)</span>
                </button>
              ) : (
                <div className="w-full py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>Verifying Human... Please wait {voteCountdown}s</span>
                </div>
              )}

              <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-xs">
                <span className="text-zinc-400 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  Points: <b className="text-white">{currentUser?.pointsBalance ?? 50} Pts</b>
                </span>
                <button
                  onClick={handleSkipVoteWithPoints}
                  className="text-amber-400 hover:text-amber-300 font-bold transition-colors"
                >
                  Skip Ad with 2 Points
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 9. DOWNLOAD QUALITY MODAL                            */}
      {/* ==================================================== */}
      {downloadPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-extrabold text-sm">Select Download Quality</h3>
              <button
                onClick={() => {
                  setDownloadPhoto(null);
                  setIsVerifyingDownload(false);
                }}
                className="text-zinc-500 hover:text-white"
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
                      ? "border-amber-400 bg-amber-400/10"
                      : "border-zinc-800 bg-zinc-900/40"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">720p (With Watermark)</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-black">
                        Instant Free
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Watermark included &bull; No verification</p>
                  </div>
                  <span className="font-bold text-emerald-400 text-xs">Free</span>
                </div>

                <div
                  onClick={() => setSelectedTier("720P_CLEAN")}
                  className={`p-3 rounded-2xl border cursor-pointer flex justify-between items-center transition-all ${
                    selectedTier === "720P_CLEAN"
                      ? "border-amber-400 bg-amber-400/10"
                      : "border-zinc-800 bg-zinc-900/40"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">720p (No Watermark)</span>
                      <span className="text-[9px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-black">
                        1 Ad Step
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Clean wallpaper &bull; Watch 1 ad or 5 pts</p>
                  </div>
                  <span className="font-bold text-amber-400 text-xs">Unlock</span>
                </div>

                <div
                  onClick={() => setSelectedTier("1080P")}
                  className={`p-3 rounded-2xl border cursor-pointer flex justify-between items-center transition-all ${
                    selectedTier === "1080P"
                      ? "border-amber-400 bg-amber-400/10"
                      : "border-zinc-800 bg-zinc-900/40"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">1080p Full HD</span>
                      <span className="text-[9px] bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded font-black">
                        1 Ad Step
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Full resolution &bull; 1 ad or 10 pts</p>
                  </div>
                  <span className="font-bold text-sky-400 text-xs">Unlock</span>
                </div>

                <div
                  onClick={() => setSelectedTier("2K")}
                  className={`p-3 rounded-2xl border cursor-pointer flex justify-between items-center transition-all ${
                    selectedTier === "2K"
                      ? "border-amber-400 bg-amber-400/10"
                      : "border-zinc-800 bg-zinc-900/40"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">2K Ultra HD (AI Upscaled)</span>
                      <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Maximum sharpness &bull; 2 ads or 25 pts</p>
                  </div>
                  <span className="font-bold text-amber-400 text-xs">Unlock</span>
                </div>

                <button
                  onClick={() => {
                    if (selectedTier === "720P_WM") {
                      alert("Downloading 720p watermarked wallpaper...");
                      setDownloadPhoto(null);
                    } else {
                      setUnlockStep(1);
                      setIsVerifyingDownload(true);
                    }
                  }}
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {selectedTier === "720P_WM"
                      ? "Download Free 720p (Watermarked)"
                      : `Proceed to Unlock ${selectedTier.replace("_", " ")}`}
                  </span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-center">
                <span className="text-xs text-amber-400 font-black uppercase">
                  Step {unlockStep} of {selectedTier === "2K" ? 2 : 1} Verification
                </span>
                <div
                  onClick={triggerAdsterraDirectLink}
                  className="h-40 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center text-xs text-zinc-500 font-bold space-y-1 cursor-pointer hover:border-amber-400/40"
                >
                  <div className="flex items-center gap-1 text-amber-400 text-[10px] uppercase">
                    <span>Adsterra Sponsored Offer</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                  <span>[Click sponsor offer to support creator &bull; 300x250]</span>
                </div>

                {canDownload ? (
                  <button
                    onClick={() => {
                      if (selectedTier === "2K" && unlockStep === 1) {
                        setUnlockStep(2);
                      } else {
                        alert(
                          `Verification complete! ${selectedTier.replace("_", " ")} unlocked successfully.`
                        );
                        setIsVerifyingDownload(false);
                        setDownloadPhoto(null);
                      }
                    }}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {selectedTier === "2K" && unlockStep === 1
                        ? "Continue to Step 2 (পরবর্তী ধাপ)"
                        : "Download File Now (ডাউনলোড করুন)"}
                    </span>
                  </button>
                ) : (
                  <div className="w-full py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>Waiting for sponsor check... ({unlockCountdown}s)</span>
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