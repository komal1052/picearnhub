"use client";

import { useState, useEffect } from "react";
import {
  Layers,
  Wallet,
  Megaphone,
  CheckCircle,
  XCircle,
  Send,
  ArrowLeft,
  Image as ImageIcon,
  UploadCloud,
  Trophy,
  PlusCircle,
  Calendar,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { toBengaliNumber } from "@/lib/formatters";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"PAYOUTS" | "NOTICES" | "PROOFS" | "CONTESTS">("CONTESTS");

  // নোটিশ স্টেট
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeTag, setNoticeTag] = useState("PAYOUT");
  const [noticeStatus, setNoticeStatus] = useState<string | null>(null);
  const [loadingNotice, setLoadingNotice] = useState(false);

  // পেমেন্ট প্রুফ স্টেট
  const [proofUser, setProofUser] = useState("");
  const [proofAmount, setProofAmount] = useState("৳৫০০");
  const [proofGateway, setProofGateway] = useState("BKASH");
  const [proofTrx, setProofTrx] = useState("");
  const [proofImageBase64, setProofImageBase64] = useState<string | null>(null);
  const [proofStatus, setProofStatus] = useState<string | null>(null);
  const [proofLoading, setProofLoading] = useState(false);

  // কনটেস্ট তৈরি স্টেট
  const [contestTitle, setContestTitle] = useState("");
  const [contestTier, setContestTier] = useState<"HOURLY_24" | "WEEKLY_7D" | "MONTHLY_30D">("HOURLY_24");
  const [contestPrize, setContestPrize] = useState("5.00");
  const [contestAllowAi, setContestAllowAi] = useState(true);
  const [contestStatus, setContestStatus] = useState<string | null>(null);
  const [contestLoading, setContestLoading] = useState(false);
  const [activeContests, setActiveContests] = useState<any[]>([]);

  // পেন্ডিং উইথড্র তালিকা
  const [payouts, setPayouts] = useState([
    {
      id: "trx-demo-1",
      userName: "তানভীর হাসান",
      userEmail: "tanvir.lens@gmail.com",
      amount: "25.00",
      gateway: "BKASH",
      accountDetails: "01711223344",
      date: "১০ মিনিট আগে",
    },
    {
      id: "trx-demo-2",
      userName: "সারাহ জেনকিন্স",
      userEmail: "sarah.nature@gmail.com",
      amount: "50.00",
      gateway: "SKRILL",
      accountDetails: "sarah@skrill.com",
      date: "১ ঘণ্টা আগে",
    },
  ]);

  // কনটেস্ট লিস্ট লোড করা
  const loadContests = () => {
    fetch("/api/admin/contests")
      .then((res) => res.json())
      .then((data) => {
        if (data.contests) setActiveContests(data.contests);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadContests();
  }, []);

  const handlePayoutAction = async (trxId: string, action: "APPROVE" | "REJECT") => {
    let refId = "MANUAL_DISBURSED";
    if (action === "APPROVE") {
      const input = prompt("বিকাশ/নগদ ট্রানজেকশন আইডি (TrxID) লিখুন:");
      if (input) refId = input;
    }

    try {
      await fetch("/api/admin/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: trxId, action, referenceId: refId }),
      });

      setPayouts((prev) => prev.filter((p) => p.id !== trxId));
      alert(action === "APPROVE" ? `উইথড্র সফল হয়েছে! TrxID: ${refId}` : "উইথড্র বাতিল করা হয়েছে এবং টাকা ওয়ালেটে ফেরত দেওয়া হয়েছে।");
    } catch {
      alert("অ্যাকশন সম্পন্ন করা যায়নি।");
    }
  };

  const handlePostNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingNotice(true);
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: noticeTitle, badgeTag: noticeTag }),
      });

      if (res.ok) {
        setNoticeStatus("নোটিশটি সফলভাবে হোমপেজের লাইভ সাইডবারে যুক্ত হয়েছে!");
        setNoticeTitle("");
        setTimeout(() => setNoticeStatus(null), 3000);
      }
    } catch {
      alert("নোটিশ প্রকাশ করা যায়নি।");
    } finally {
      setLoadingNotice(false);
    }
  };

  const handleProofImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 800;
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
        setProofImageBase64(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handlePostProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofImageBase64) {
      alert("অনুগ্রহ করে পেমেন্ট রসিদের স্ক্রিনশট সিলেক্ট করুন!");
      return;
    }
    setProofLoading(true);

    try {
      const res = await fetch("/api/admin/proofs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: proofUser,
          amount: proofAmount,
          gateway: proofGateway,
          trxId: proofTrx,
          proofImage: proofImageBase64,
        }),
      });

      if (res.ok) {
        setProofStatus("পেমেন্ট প্রুফ সফলভাবে সাইডবারে প্রকাশিত হয়েছে!");
        setProofUser("");
        setProofTrx("");
        setProofImageBase64(null);
        setTimeout(() => setProofStatus(null), 4000);
      }
    } catch {
      alert("প্রুফ আপলোড ব্যর্থ হয়েছে।");
    } finally {
      setProofLoading(false);
    }
  };

  // নতুন কনটেস্ট লঞ্চ হ্যান্ডলার
  const handleCreateContest = async (e: React.FormEvent) => {
    e.preventDefault();
    setContestLoading(true);

    try {
      const res = await fetch("/api/admin/contests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: contestTitle,
          tier: contestTier,
          prizePool: contestPrize,
          allowAi: contestAllowAi,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setContestStatus("নতুন কনটেস্ট সফলভাবে চালু হয়েছে এবং হোমপেজে লাইভ দেখাচ্ছে!");
        setContestTitle("");
        loadContests();
        setTimeout(() => setContestStatus(null), 4000);
      } else {
        alert(data.error || "কনটেস্ট তৈরি ব্যর্থ হয়েছে।");
      }
    } catch {
      alert("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setContestLoading(false);
    }
  };

  const totalPendingAmount = payouts.reduce((a, b) => a + parseFloat(b.amount), 0);

  return (
    <main className="min-h-screen bg-brand-bg text-brand-text p-4 md:p-8 max-w-[1440px] mx-auto space-y-6">
      
      {/* টপ হেডার বার */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-brand-border shadow-sm">
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline mb-2 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>মূল ওয়েবসাইটে ফিরে যান</span>
          </Link>
          <h1 className="text-xl md:text-2xl font-black text-brand-text flex items-center gap-2">
            <Layers className="text-brand-purple w-6 h-6" />
            <span>পিকআর্নহাব অ্যাডমিন কন্ট্রোল সেন্টার</span>
          </h1>
          <p className="text-xs text-brand-muted mt-0.5">
            কনটেস্ট পরিচালনা, উইথড্র অনুমোদন, সাইডবার নোটিশ ও পেমেন্ট প্রুফ ব্যবস্থাপনা।
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 px-5 py-3 rounded-2xl text-center shrink-0">
          <span className="text-[10px] text-amber-800 uppercase font-black block">অপেক্ষমাণ উইথড্র</span>
          <span className="text-lg md:text-xl font-black text-amber-900 font-mono">
            ${toBengaliNumber(totalPendingAmount.toFixed(2))} USD
          </span>
        </div>
      </div>

      {/* ট্যাব সুইচ নেভিগেশন (৪টি ট্যাব) */}
      <div className="flex gap-2 border-b border-brand-border pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("CONTESTS")}
          className={`py-2 px-4 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "CONTESTS"
              ? "bg-brand-purple text-white shadow-md shadow-brand-purple/20 font-black"
              : "bg-white border border-brand-border text-brand-muted hover:text-brand-text"
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>কনটেস্ট পরিচালনা ও নতুন কনটেস্ট</span>
        </button>

        <button
          onClick={() => setActiveTab("PAYOUTS")}
          className={`py-2 px-4 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "PAYOUTS"
              ? "bg-brand-purple text-white shadow-md shadow-brand-purple/20 font-black"
              : "bg-white border border-brand-border text-brand-muted hover:text-brand-text"
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>উইথড্র রিকোয়েস্টসমূহ ({toBengaliNumber(payouts.length)})</span>
        </button>

        <button
          onClick={() => setActiveTab("NOTICES")}
          className={`py-2 px-4 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "NOTICES"
              ? "bg-brand-purple text-white shadow-md shadow-brand-purple/20 font-black"
              : "bg-white border border-brand-border text-brand-muted hover:text-brand-text"
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>লাইভ নোটিশ প্রকাশ করুন</span>
        </button>

        <button
          onClick={() => setActiveTab("PROOFS")}
          className={`py-2 px-4 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "PROOFS"
              ? "bg-brand-purple text-white shadow-md shadow-brand-purple/20 font-black"
              : "bg-white border border-brand-border text-brand-muted hover:text-brand-text"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>পেমেন্ট প্রুফ আপলোড (বিকাশ/নগদ)</span>
        </button>
      </div>

      {/* ট্যাব ১: কনটেস্ট পরিচালনা ও নতুন কনটেস্ট ফর্ম */}
      {activeTab === "CONTESTS" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* নতুন কনটেস্ট তৈরির ফর্ম (৫ কলাম) */}
          <div className="lg:col-span-5 bg-white border border-brand-border rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-brand-border pb-3">
              <PlusCircle className="w-5 h-5 text-brand-purple" />
              <h2 className="text-base font-black text-brand-text">নতুন কনটেস্ট চালু করুন</h2>
            </div>

            {contestStatus && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{contestStatus}</span>
              </div>
            )}

            <form onSubmit={handleCreateContest} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-brand-muted block mb-1">কনটেস্টের নাম / থিম</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: গোল্ডেন আওয়ার ও সূর্যাস্ত ফটোগ্রাফি"
                  value={contestTitle}
                  onChange={(e) => setContestTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-brand-muted block mb-1">কনটেস্টের মেয়াদ (Tier)</label>
                  <select
                    value={contestTier}
                    onChange={(e) => {
                      const tier = e.target.value as any;
                      setContestTier(tier);
                      if (tier === "HOURLY_24") setContestPrize("5.00");
                      if (tier === "WEEKLY_7D") setContestPrize("25.00");
                      if (tier === "MONTHLY_30D") setContestPrize("100.00");
                    }}
                    className="w-full bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-sans"
                  >
                    <option value="HOURLY_24">২৪ ঘণ্টা (Daily Flash)</option>
                    <option value="WEEKLY_7D">৭ দিন (Weekly)</option>
                    <option value="MONTHLY_30D">৩০ দিন (Monthly Grand)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-brand-muted block mb-1">প্রাইজমানি ($ USD)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={contestPrize}
                    onChange={(e) => setContestPrize(e.target.value)}
                    className="w-full bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-mono font-bold"
                  />
                  <span className="text-[10px] text-brand-muted block mt-0.5">
                    আনুমানিক: ৳{toBengaliNumber(Math.round(parseFloat(contestPrize || "0") * 120))} টাকা
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-brand-border">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contestAllowAi}
                    onChange={(e) => setContestAllowAi(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-purple focus:ring-0"
                  />
                  <span className="text-xs font-bold text-brand-text flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                    <span>এআই আর্ট (AI Generated Art) জমা নেওয়া অনুমোদন করুন</span>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={contestLoading}
                className="w-full py-3 rounded-full bg-gradient-to-r from-brand-purple to-brand-deep hover:opacity-95 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md shadow-brand-purple/20"
              >
                <Trophy className="w-4 h-4 text-brand-gold" />
                <span>{contestLoading ? "লঞ্চ হচ্ছে..." : "কনটেস্ট লাইভ করুন (Launch Contest)"}</span>
              </button>
            </form>
          </div>

          {/* বর্তমানে চলমান কনটেস্টগুলোর তালিকা (৭ কলাম) */}
          <div className="lg:col-span-7 bg-white border border-brand-border rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h2 className="text-base font-black text-brand-text flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                <span>চলমান ও সম্প্রতি সমাপ্ত কনটেস্টসমূহ</span>
              </h2>
              <span className="text-xs font-bold text-brand-muted">
                মোট: {toBengaliNumber(activeContests.length)}টি
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
              {activeContests.length === 0 ? (
                <div className="text-center py-10 text-brand-muted text-xs">
                  কোনো কনটেস্ট পাওয়া যায়নি।
                </div>
              ) : (
                activeContests.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          c.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                        }`}>
                          {c.status === "ACTIVE" ? "চলমান (ACTIVE)" : "সমাপ্ত (COMPLETED)"}
                        </span>
                        <span className="text-[10px] text-brand-muted uppercase font-bold">{c.tier}</span>
                      </div>
                      <h4 className="text-xs font-bold text-brand-text">{c.title}</h4>
                      <div className="text-[11px] text-brand-muted">
                        মোট জমা: <b>{toBengaliNumber(c._count?.entries || 0)}টি ছবি</b> &bull; শেষ: {new Date(c.endTime).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-brand-muted block font-semibold">প্রাইজমানি</span>
                      <span className="text-base font-black text-emerald-600 font-mono">${toBengaliNumber(c.prizePool)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* ট্যাব ২: উইথড্র রিকোয়েস্ট টেবিল */}
      {activeTab === "PAYOUTS" && (
        <div className="bg-white border border-brand-border rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-brand-muted uppercase font-bold border-b border-brand-border">
                <tr>
                  <th className="p-4">ফটোগ্রাফার / ইমেইল</th>
                  <th className="p-4">পেমেন্ট মেথড</th>
                  <th className="p-4">অ্যাকাউন্ট নম্বর</th>
                  <th className="p-4">টাকার পরিমাণ</th>
                  <th className="p-4 text-right">কার্যক্রম (অ্যাকশন)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-brand-text">
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-brand-muted font-medium">
                      এই মুহূর্তে কোনো অপেক্ষমাণ উইথড্র রিকোয়েস্ট নেই।
                    </td>
                  </tr>
                ) : (
                  payouts.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-brand-text text-sm">{item.userName}</div>
                        <div className="text-[11px] text-brand-muted font-mono">{item.userEmail}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold px-2.5 py-1 rounded-md text-[10px] bg-slate-100 text-brand-purple border border-slate-200">
                          {item.gateway}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-xs">{item.accountDetails}</td>
                      <td className="p-4 font-black text-emerald-600 text-sm font-mono">
                        ${toBengaliNumber(item.amount)} USD
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handlePayoutAction(item.id, "APPROVE")}
                          className="px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs inline-flex items-center gap-1 shadow-sm transition-transform active:scale-95"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>অনুমোদন ও পরিশোধ</span>
                        </button>
                        <button
                          onClick={() => handlePayoutAction(item.id, "REJECT")}
                          className="px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>বাতিল ও ফেরত</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ট্যাব ৩: লাইভ নোটিশ প্রকাশ */}
      {activeTab === "NOTICES" && (
        <div className="max-w-2xl bg-white border border-brand-border rounded-3xl p-6 md:p-8 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-brand-border pb-3">
            <Megaphone className="w-5 h-5 text-brand-purple" />
            <h2 className="text-base font-black text-brand-text">হোমপেজ সাইডবারে নোটিশ প্রকাশ করুন</h2>
          </div>

          {noticeStatus && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{noticeStatus}</span>
            </div>
          )}

          <form onSubmit={handlePostNotice} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-brand-muted block mb-1">নোটিশের বিভাগ (ট্যাগ)</label>
              <select
                value={noticeTag}
                onChange={(e) => setNoticeTag(e.target.value)}
                className="w-full bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-sans"
              >
                <option value="PAYOUT">PAYOUT (উইথড্র পরিশোধ নোটিশ)</option>
                <option value="RULES">RULES (নিয়মাবলী ও ব্যাজ অর্জন)</option>
                <option value="UPDATE">UPDATE (নতুন কনটেস্ট / প্ল্যাটফর্ম আপডেট)</option>
                <option value="NOTICE">NOTICE (সাধারণ নোটিশ)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-brand-muted block mb-1">নোটিশের বিবরণ</label>
              <textarea
                rows={3}
                required
                placeholder="যেমন: এই সপ্তাহের সকল বিকাশ এবং নগদ উইথড্র পেমেন্ট সফলভাবে পাঠিয়ে দেওয়া হয়েছে।"
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                className="w-full bg-slate-50 border border-brand-border rounded-xl p-3.5 text-xs text-brand-text focus:outline-none focus:border-brand-purple resize-none font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={loadingNotice}
              className="w-full py-3 rounded-full bg-gradient-to-r from-brand-purple to-brand-deep hover:opacity-95 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md shadow-brand-purple/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loadingNotice ? "প্রকাশ হচ্ছে..." : "সাইডবারে নোটিশ সম্প্রচার করুন"}</span>
            </button>
          </form>
        </div>
      )}

      {/* ট্যাব ৪: পেমেন্ট প্রুফ আপলোড */}
      {activeTab === "PROOFS" && (
        <div className="max-w-2xl bg-white border border-brand-border rounded-3xl p-6 md:p-8 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-brand-border pb-3">
            <ImageIcon className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-black text-brand-text">বিকাশ / নগদ পেমেন্ট রসিদ আপলোড করুন</h2>
          </div>

          {proofStatus && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{proofStatus}</span>
            </div>
          )}

          <form onSubmit={handlePostProof} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[11px] font-semibold text-brand-muted block mb-1">ফটোগ্রাফারের নাম</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: তানভীর হাসান"
                  value={proofUser}
                  onChange={(e) => setProofUser(e.target.value)}
                  className="w-full bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-sans"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-brand-muted block mb-1">টাকার পরিমাণ</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ৳৫০০ বা $৫.০০"
                  value={proofAmount}
                  onChange={(e) => setProofAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-bold font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[11px] font-semibold text-brand-muted block mb-1">পেমেন্ট মেথড</label>
                <select
                  value={proofGateway}
                  onChange={(e) => setProofGateway(e.target.value)}
                  className="w-full bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-sans"
                >
                  <option value="BKASH">bKash (বিকাশ)</option>
                  <option value="NAGAD">Nagad (নগদ)</option>
                  <option value="ROCKET">Rocket (রকেট)</option>
                  <option value="SKRILL">Skrill</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-brand-muted block mb-1">ট্রানজেকশন আইডি / TrxID (ঐচ্ছিক)</label>
                <input
                  type="text"
                  placeholder="যেমন: BL83K9XZ10"
                  value={proofTrx}
                  onChange={(e) => setProofTrx(e.target.value)}
                  className="w-full bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-purple font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-brand-muted block mb-1">
                পেমেন্ট রসিদের স্ক্রিনশট সিলেক্ট করুন
              </label>
              <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-5 text-center cursor-pointer bg-slate-50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProofImageSelect}
                  className="hidden"
                  id="proof-upload-admin"
                />
                <label htmlFor="proof-upload-admin" className="cursor-pointer flex flex-col items-center gap-2">
                  <UploadCloud className="w-8 h-8 text-emerald-600" />
                  <span className="text-xs font-bold text-brand-text">
                    {proofImageBase64 ? "✅ স্ক্রিনশট সিলেক্ট হয়েছে (পরিবর্তন করতে ক্লিক করুন)" : "ক্লিক করে স্ক্রিনশট ফাইল সিলেক্ট করুন"}
                  </span>
                  <span className="text-[10px] text-brand-muted">PNG, JPG, WebP ফাইল সাপোর্টেড</span>
                </label>
              </div>

              {proofImageBase64 && (
                <div className="mt-2.5 p-2 bg-slate-100 rounded-2xl border border-slate-200 flex justify-center">
                  <img src={proofImageBase64} alt="প্রুফ প্রিভিউ" className="max-h-48 object-contain rounded-xl" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={proofLoading}
              className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md shadow-emerald-600/20"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{proofLoading ? "আপলোড হচ্ছে..." : "পেমেন্ট প্রুফ পাবলিশ করুন"}</span>
            </button>
          </form>
        </div>
      )}

    </main>
  );
}