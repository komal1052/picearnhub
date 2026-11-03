import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        pointsBalance: true,
        walletBalance: true,
        badge: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "No account found with this email." }, { status: 404 });
    }

    if (user.password && user.password !== password) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        pointsBalance: user.pointsBalance,
        walletBalance: Number(user.walletBalance),
        badge: user.badge,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}