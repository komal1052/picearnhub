import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyPhotoUploadAlert } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const { title, category, contestId, isAiGenerated, aiModelUsed, imageBase64, userId } = await req.json();

    if (!title || !imageBase64 || !userId) {
      return NextResponse.json({ error: "ছবির টাইটেল এবং ছবি দেওয়া আবশ্যক।" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "ইউজার একাউন্ট খুঁজে পাওয়া যায়নি। আবার লগইন করুন।" }, { status: 401 });
    }

    // ১. ডাটাবেসে ছবি তৈরি
    const newPhoto = await prisma.photo.create({
      data: {
        userId: user.id,
        title,
        imageUrl: imageBase64,
        category: category || "Nature",
        aspectRatio: "RATIO_16_9",
        isFree: true,
        status: "APPROVED",
        isAiGenerated: isAiGenerated || false,
        aiModelUsed: isAiGenerated ? aiModelUsed : null,
        voteCount: 0,
        viewCount: 1,
      },
      include: {
        user: true,
      },
    });

    // ২. কনটেস্টে যুক্ত করা (যদি কনটেস্ট থাকে)
    let targetContestId = contestId;
    if (!targetContestId) {
      const activeContest = await prisma.contest.findFirst({
        where: { status: "ACTIVE" },
        orderBy: { endTime: "asc" },
      });
      if (activeContest) targetContestId = activeContest.id;
    }

    if (targetContestId) {
      try {
        await prisma.contestEntry.create({
          data: {
            contestId: targetContestId,
            photoId: newPhoto.id,
            userId: user.id,
            votesReceived: 0,
          },
        });
      } catch (entryErr) {
        console.warn("Contest entry notice:", entryErr);
      }
    }

    // ৩. পয়েন্ট বোনাস দেওয়া
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { pointsBalance: { increment: 15 } },
      });
    } catch (ptErr) {
      console.warn("Points update notice:", ptErr);
    }

    // ৪. টেলিগ্রামে নোটিফিকেশন পাঠানো
    notifyPhotoUploadAlert({
      title: newPhoto.title,
      category: newPhoto.category,
      creatorName: user.name || "Creator",
      isAiGenerated: newPhoto.isAiGenerated,
      aiModel: newPhoto.aiModelUsed,
      photoId: newPhoto.id,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: "ছবি সফলভাবে জমা হয়েছে!",
      photo: newPhoto,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    // সরাসরি আসল কারণ ব্রাউজারে রিটার্ন করবে
    return NextResponse.json({ error: error.message || "ছবি আপলোড ব্যর্থ হয়েছে।" }, { status: 400 });
  }
}