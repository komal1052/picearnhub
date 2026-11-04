"use client";

import { useState } from "react";
import {
  Layers,
  Wallet,
  Megaphone,
  CheckCircle,
  XCircle,
  Send,
  ArrowLeft,
  Image as ImageIcon,
  UploadCloud
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"PAYOUTS" | "NOTICES" | "PROOFS">("PAYOUTS");

  // Notices state
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeTag, setNoticeTag] = useState("PAYOUT");
  const [noticeStatus, setNoticeStatus] = useState<string | null>(null);
  const [loadingNotice, setLoadingNotice] = useState(false);

  // Payment Proof state
  const [proofUser, setProofUser] = useState("");
  const [proofAmount, setProofAmount] = useState("৳৫০০");
  const [proofGateway, setProofGateway] = useState("BKASH");
  const [proofTrx, setProofTrx] = useState("");
  const [proofImageBase64, setProofImageBase64] = useState<string | null>(null);
  const [proofStatus, setProofStatus] = useState<string | null>(null);
  const [proofLoading, setProofLoading] = useState(false);

  // Pending payouts list
  const [payouts, setPayouts] = useState([
    {
      id: "trx-demo-1",
      userName: "Tanvir Hasan",
      userEmail: "tanvir.lens@gmail.com",
      amount: "25.00",
      gateway: "BKASH",
      accountDetails: "01711223344",
    },
    {
      id: "trx-demo-2",
      userName: "Sarah Jenkins",
      userEmail: "sarah.nature@gmail.com",
      amount: "50.00",
      gateway: "SKRILL",
      accountDetails: "sarah@skrill.com",
    },
  ]);

  const handlePayoutAction = async (trxId: string, action: "APPROVE" | "REJECT") => {
    let refId = "MANUAL_DISBURSED";
    if (action === "APPROVE") {
      const input = prompt("Enter bKash/Nagad TrxID or Transaction Reference:");
      if (input) refId = input;
    }

    try {
      await fetch("/api/admin/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: trxId, action, referenceId: refId }),
      });

      setPayouts((prev) => prev.filter((p) => p.id !== trxId));
      alert(action === "APPROVE" ? `Payout approved with TrxID: ${refId}` : "Payout rejected and balance refunded to user.");
    } catch {
      alert("Action failed.");
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
        setNoticeStatus("Notice broadcasted live to the homepage sidebar!");
        setNoticeTitle("");
        setTimeout(() => setNoticeStatus(null), 3000);
      }
    } catch {
      alert("Failed to publish notice.");
    } finally {
      setLoadingNotice(false);
    }
  };

  // স্ক্রিনশট সিলেক্ট করলে ইমেজ কম্প্রেস করে বেস৬৪ করা
  const handleProofImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 800; // মোবাইল স্ক্রিনশটের জন্য উপযুক্ত
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
        setProofImageBase64(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handlePostProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofImageBase64) {
      alert("অনুগ্রহ করে বিকাশের স্ক্রিনশট সিলেক্ট করুন!");
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
        setProofStatus("পেমেন্ট প্রুফ সফলভাবে প্রকাশিত হয়েছে! হোমপেজে প্রদর্শিত হবে।");
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

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10 max-w-[1300px] mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-6">
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 mb-2 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Live Website</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
            <Layers className="text-amber-400 w-7 h-7" />
            <span>PicEarnHub Admin Control Center</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage live withdrawals, announcements, and payment proofs.
          </p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 px-4 py-2.5 rounded-2xl text-center">
          <span className="text-[10px] text-zinc-500 uppercase font-black block">Pending Payouts</span>
          <span className="text-lg font-black text-amber-400">
            ${payouts.reduce((a, b) => a + parseFloat(b.amount), 0).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("PAYOUTS")}
          className={`py-2 px-4 rounded-xl text-xs font-black transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === "PAYOUTS" ? "bg-amber-400 text-black shadow-lg shadow-amber-400/20" : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Payout Requests ({payouts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("NOTICES")}
          className={`py-2 px-4 rounded-xl text-xs font-black transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === "NOTICES" ? "bg-amber-400 text-black shadow-lg shadow-amber-400/20" : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Post Live Notice (সাইডবার নোটিশ)</span>
        </button>

        <button
          onClick={() => setActiveTab("PROOFS")}
          className={`py-2 px-4 rounded-xl text-xs font-black transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === "PROOFS" ? "bg-amber-400 text-black shadow-lg shadow-amber-400/20" : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Upload Payout Proof (পেমেন্ট প্রুফ আপলোড)</span>
        </button>
      </div>

      {/* TAB 1: PAYOUTS */}
      {activeTab === "PAYOUTS" && (
        <div className="space-y-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/60 text-zinc-400 uppercase font-black border-b border-zinc-800">
                <tr>
                  <th className="p-4">Creator / Email</th>
                  <th className="p-4">Gateway</th>
                  <th className="p-4">Account / Number</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                      No pending withdrawal requests right now.
                    </td>
                  </tr>
                ) : (
                  payouts.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{item.userName}</div>
                        <div className="text-[11px] text-zinc-500">{item.userEmail}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-black px-2.5 py-1 rounded-md text-[10px] bg-zinc-900 text-amber-400 border border-zinc-800">
                          {item.gateway}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-white text-xs">{item.accountDetails}</td>
                      <td className="p-4 font-black text-emerald-400 text-sm font-mono">${item.amount} USD</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handlePayoutAction(item.id, "APPROVE")}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs inline-flex items-center gap-1 transition-transform active:scale-95 shadow-md shadow-emerald-500/20"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve & Paid
                        </button>
                        <button
                          onClick={() => handlePayoutAction(item.id, "REJECT")}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 font-black text-xs inline-flex items-center gap-1 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject & Refund
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

      {/* TAB 2: POST NOTICE */}
      {activeTab === "NOTICES" && (
        <div className="max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Megaphone className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-black text-white">Broadcast Announcement to Live Sidebar</h2>
          </div>

          {noticeStatus && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{noticeStatus}</span>
            </div>
          )}

          <form onSubmit={handlePostNotice} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Badge Tag</label>
              <select
                value={noticeTag}
                onChange={(e) => setNoticeTag(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="PAYOUT">PAYOUT (উইথড্র সফল নোটিশ)</option>
                <option value="RULES">RULES (নিয়মাবলী ও ব্যাজ আপডেট)</option>
                <option value="UPDATE">UPDATE (নতুন কনটেস্ট / ফিচার আপডেট)</option>
                <option value="NOTICE">NOTICE (সাধারণ নোটিশ)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Notice Headline</label>
              <textarea
                rows={3}
                required
                placeholder="যেমন: এই সপ্তাহের সকল বিকাশ এবং নগদ উইথড্র পেমেন্ট পাঠিয়ে দেওয়া হয়েছে।"
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loadingNotice}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-black text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-md shadow-amber-400/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loadingNotice ? "Broadcasting..." : "Broadcast Notice Live"}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: UPLOAD PAYOUT PROOF */}
      {activeTab === "PROOFS" && (
        <div className="max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-black text-white">Upload Payment Proof (বিকাশ / নগদ স্ক্রিনশট)</h2>
          </div>

          {proofStatus && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{proofStatus}</span>
            </div>
          )}

          <form onSubmit={handlePostProof} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">ইউজারের নাম (User Name)</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: Tanvir Hasan"
                  value={proofUser}
                  onChange={(e) => setProofUser(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">টাকার পরিমাণ (Amount)</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ৳৫০০ বা $৫.০০"
                  value={proofAmount}
                  onChange={(e) => setProofAmount(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">পেমেন্ট মেথড (Gateway)</label>
                <select
                  value={proofGateway}
                  onChange={(e) => setProofGateway(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="BKASH">bKash (বিকাশ)</option>
                  <option value="NAGAD">Nagad (নগদ)</option>
                  <option value="ROCKET">Rocket (রকেট)</option>
                  <option value="SKRILL">Skrill</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">TrxID (ঐচ্ছিক)</label>
                <input
                  type="text"
                  placeholder="9H48SK20..."
                  value={proofTrx}
                  onChange={(e) => setProofTrx(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            {/* স্ক্রিনশট ফাইল আপলোডার */}
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                বিকাশ/লেনদেনের স্ক্রিনশট সিলেক্ট করুন (Screenshot Image)
              </label>
              <div className="border-2 border-dashed border-zinc-800 hover:border-amber-400 rounded-2xl p-4 text-center cursor-pointer bg-zinc-900/40">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProofImageSelect}
                  className="hidden"
                  id="proof-upload"
                />
                <label htmlFor="proof-upload" className="cursor-pointer flex flex-col items-center gap-1.5">
                  <UploadCloud className="w-8 h-8 text-amber-400" />
                  <span className="text-xs font-bold text-zinc-300">
                    {proofImageBase64 ? "✅ স্ক্রিনশট সিলেক্ট করা হয়েছে (পরিবর্তন করতে ক্লিক করুন)" : "ছবি আপলোড করতে ক্লিক করুন"}
                  </span>
                  <span className="text-[10px] text-zinc-500">PNG, JPG, WebP স্ক্রিনশট</span>
                </label>
              </div>

              {proofImageBase64 && (
                <div className="mt-2 p-2 bg-zinc-900 rounded-xl border border-zinc-800 flex justify-center">
                  <img src={proofImageBase64} alt="Proof Preview" className="max-h-36 object-contain rounded-lg" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={proofLoading}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-black text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-md shadow-amber-400/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{proofLoading ? "Publishing..." : "পেমেন্ট প্রুফ পাবলিশ করুন (Publish Proof)"}</span>
            </button>
          </form>
        </div>
      )}
    </main>
  );
}