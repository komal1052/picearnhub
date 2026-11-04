import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyPhotoUploadAlert } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const { title, category, contestId, isAiGenerated, aiModelUsed, imageBase64, userId } = await req.json();

    if (!title || !imageBase64 || !userId) {
      return NextResponse.json({ error: "ছবির টাইটেল এবং ছবি দেওয়া আবশ্যক।" }, { status: 400 });
    }

    // ১. ইউজারের তথ্য চেক
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "অনুগ্রহ করে প্রথমে লগইন করুন।" }, { status: 401 });
    }

    // ২. ডাটাবেসে ছবি তৈরি করা
    const newPhoto = await prisma.photo.create({
      data: {
        userId: user.id,
        title,
        category: category || "Nature",
        aspectRatio: "RATIO_16_9",
        isFree: true,
        status: "APPROVED",
        isAiGenerated: isAiGenerated || false,
        aiModelUsed: isAiGenerated ? aiModelUsed : null,
        voteCount: 0,
        viewCount: 1,
      },
    });

    // ৩. অ্যাক্টিভ কনটেস্টে এন্ট্রি যুক্ত করা
    let targetContestId = contestId;
    if (!targetContestId) {
      const activeContest = await prisma.contest.findFirst({
        where: { status: "ACTIVE" },
        orderBy: { endTime: "asc" },
      });
      if (activeContest) targetContestId = activeContest.id;
    }

    if (targetContestId) {
      await prisma.contestEntry.create({
        data: {
          contestId: targetContestId,
          photoId: newPhoto.id,
          userId: user.id,
          votesReceived: 0,
        },
      });
    }

    // ৪. ছবি আপলোড করার জন্য রিওয়ার্ড পয়েন্ট (+১৫ পয়েন্ট) দেওয়া
    await prisma.user.update({
      where: { id: user.id },
      data: { pointsBalance: { increment: 15 } },
    });

    await prisma.pointTransaction.create({
      data: {
        userId: user.id,
        amount: 15,
        reason: "PHOTO_UPLOAD",
        description: "ছবি আপলোড বোনাস",
      },
    });

    // ৫. অ্যাডমিনের টেলিগ্রামে সাথে সাথে অ্যালার্ট পাঠানো
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
      message: "ছবি সফলভাবে জমা হয়েছে এবং ১৫ পয়েন্ট বোনাস পেয়েছেন!",
      photo: newPhoto,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "ছবি আপলোড ব্যর্থ হয়েছে।" }, { status: 500 });
  }
}