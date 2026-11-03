import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !name || !password) {
      return NextResponse.json({ error: "Name, Email, and Password are required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "This email is already registered. Please log in." },
        { status: 400 }
      );
    }

    // 2. Create the user
    const newUser = await prisma.user.create({
      data: {
        name,
        email: cleanEmail,
        password,
      },
      select: {
        id: true,
        name: true,
        email: true,
        pointsBalance: true,
        walletBalance: true,
        badge: true,
      },
    });

    // 3. Log initial signup points in ledger
    try {
      await prisma.pointTransaction.create({
        data: {
          userId: newUser.id,
          amount: 50,
          reason: "SIGNUP_BONUS",
          description: "Welcome bonus points for joining PicEarnHub",
        },
      });
    } catch (e) {
      console.warn("Point ledger notice:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully with 50 bonus points!",
      user: {
        ...newUser,
        walletBalance: Number(newUser.walletBalance),
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: error.message || "Failed to create user account." }, { status: 400 });
  }
}