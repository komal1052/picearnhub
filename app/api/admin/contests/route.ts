import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: সকল চলমান ও সমাপ্ত কনটেস্ট দেখা
export async function GET() {
  try {
    const contests = await prisma.contest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { entries: true },
        },
      },
    });
    return NextResponse.json({ contests });
  } catch (error) {
    return NextResponse.json({ contests: [] });
  }
}

// POST: অ্যাডমিন প্যানেল থেকে নতুন কনটেস্ট চালু করা
export async function POST(req: NextRequest) {
  try {
    const { title, tier, prizePool, durationDays, allowAi } = await req.json();

    if (!title || !prizePool) {
      return NextResponse.json({ error: "কনটেস্টের নাম এবং প্রাইজমানি দেওয়া আবশ্যক।" }, { status: 400 });
    }

    const startTime = new Date();
    // মেয়াদ গণনা
    const days = durationDays ? parseFloat(durationDays) : (tier === "HOURLY_24" ? 1 : tier === "WEEKLY_7D" ? 7 : 30);
    const endTime = new Date(startTime.getTime() + days * 24 * 60 * 60 * 1000);

    const newContest = await prisma.contest.create({
      data: {
        title,
        tier: tier || "HOURLY_24",
        prizePool: parseFloat(prizePool),
        startTime,
        endTime,
        status: "ACTIVE",
        allowAi: allowAi ?? true,
      },
    });

    return NextResponse.json({ success: true, contest: newContest });
  } catch (error: any) {
    console.error("Contest creation error:", error);
    return NextResponse.json({ error: error.message || "কনটেস্ট তৈরি ব্যর্থ হয়েছে।" }, { status: 500 });
  }
}