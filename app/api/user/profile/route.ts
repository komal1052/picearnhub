import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const { userId, name, phone, bio, location, avatarUrl } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        phone: phone || undefined,
        bio: bio || undefined,
        location: location || undefined,
        avatarUrl: avatarUrl || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bio: true,
        location: true,
        avatarUrl: true,
        pointsBalance: true,
        walletBalance: true,
        badge: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        ...updatedUser,
        walletBalance: Number(updatedUser.walletBalance),
      },
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: error.message || "Failed to update profile." }, { status: 500 });
  }
}