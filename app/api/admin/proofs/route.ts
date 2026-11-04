import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: হোমপেজে দেখানোর জন্য প্রুফ লিস্ট নেওয়া
export async function GET() {
  try {
    const proofs = await prisma.payoutProof.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    });
    return NextResponse.json({ proofs });
  } catch (error) {
    return NextResponse.json({ proofs: [] });
  }
}

// POST: অ্যাডমিন নতুন স্ক্রিনশট আপলোড দিলে সেভ করা
export async function POST(req: NextRequest) {
  try {
    const { userName, amount, gateway, proofImage, trxId } = await req.json();

    if (!proofImage || !userName || !amount) {
      return NextResponse.json({ error: "সকল তথ্য ও স্ক্রিনশট দেওয়া আবশ্যক।" }, { status: 400 });
    }

    const newProof = await prisma.payoutProof.create({
      data: {
        userName,
        amount,
        gateway: gateway || "BKASH",
        proofImage,
        trxId: trxId || null,
      },
    });

    return NextResponse.json({ success: true, proof: newProof });
  } catch (error) {
    return NextResponse.json({ error: "প্রুফ আপলোড ব্যর্থ হয়েছে।" }, { status: 500 });
  }
}