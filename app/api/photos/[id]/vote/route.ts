import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: photoId } = await params;
    const body = await req.json();
    const { fingerprint, userId: bodyUserId } = body;

    // ১. ইউজার লগইন চেক (লগইন ছাড়া ভোট দেওয়া সম্পূর্ণ নিষিদ্ধ)
    const session = await auth();
    const userId = session?.user?.id || bodyUserId;

    if (!userId) {
      return NextResponse.json(
        { error: "ভোট দিতে অনুগ্রহ করে প্রথমে একাউন্টে লগইন করুন।" },
        { status: 401 }
      );
    }

    const clientIp =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      "127.0.0.1";

    // ২. ফটো এবং সক্রিয় কনটেস্ট চেক
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: {
        contestEntries: {
          where: { contest: { status: "ACTIVE" } },
        },
        user: true,
      },
    });

    if (!photo || photo.status !== "APPROVED") {
      return NextResponse.json({ error: "ছবিটি খুঁজে পাওয়া যায়নি।" }, { status: 404 });
    }

    const activeEntry = photo.contestEntries[0];
    if (!activeEntry) {
      return NextResponse.json(
        { error: "এই ছবিটি বর্তমানে কোনো সক্রিয় কনটেস্টে নেই।" },
        { status: 400 }
      );
    }

    // ৩. নিজের ছবিতে নিজে ভোট দেওয়া ব্লক করা
    if (userId === photo.userId) {
      return NextResponse.json(
        { error: "আপনি নিজের ছবিতে নিজে ভোট দিতে পারবেন না।" },
        { status: 400 }
      );
    }

    // ৪. এক ইউজার যেন একই ছবিতে একাধিকবার ভোট দিতে না পারে
    const existingVote = await prisma.vote.findFirst({
      where: {
        entryId: activeEntry.id,
        userId: userId,
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: "আপনি ইতোমধ্যে এই ছবিতে আপনার মূল্যবান ভোটটি প্রদান করেছেন!" },
        { status: 400 }
      );
    }

    // ৫. ডাটাবেসে ভোট সেভ ও সংখ্যা বৃদ্ধি (Atomic Transaction)
    const updatedVoteCount = await prisma.$transaction(async (tx) => {
      // ভোট রেকর্ড তৈরি
      await tx.vote.create({
        data: {
          entryId: activeEntry.id,
          userId: userId,
          ipAddress: clientIp,
          fingerprint: fingerprint || "user-verified-device",
        },
      });

      // কনটেস্ট এন্ট্রি কাউন্টার বৃদ্ধি
      await tx.contestEntry.update({
        where: { id: activeEntry.id },
        data: { votesReceived: { increment: 1 } },
      });

      // ছবির ভোট কাউন্টার বৃদ্ধি
      const updated = await tx.photo.update({
        where: { id: photoId },
        data: { voteCount: { increment: 1 } },
      });

      // ফটোগ্রাফারের ব্লু টিক (৫০ ভোট) ও ফায়ার ব্যাজ (১০০ ভোট) মাইলফলক চেক
      const creatorTotal = await tx.photo.aggregate({
        where: { userId: photo.userId },
        _sum: { voteCount: true },
      });

      const totalVotes = creatorTotal._sum.voteCount || 0;

      if (totalVotes >= 100 && photo.user.badge !== "FIRE_CREATOR") {
        await tx.user.update({
          where: { id: photo.userId },
          data: { badge: "FIRE_CREATOR" },
        });
      } else if (totalVotes >= 50 && photo.user.badge === "NONE") {
        await tx.user.update({
          where: { id: photo.userId },
          data: { badge: "BLUE_VERIFIED" },
        });
      }

      return updated.voteCount;
    });

    return NextResponse.json({
      success: true,
      message: "আপনার ভোটটি সফলভাবে গ্রহণ করা হয়েছে!",
      votes: updatedVoteCount,
    });
  } catch (error: any) {
    console.error("Voting error:", error);
    return NextResponse.json({ error: error.message || "ভোট গ্রহণ করা সম্ভব হয়নি।" }, { status: 500 });
  }
}