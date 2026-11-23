import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  events: {
    // গুগল দিয়ে প্রথমবার একাউন্ট খুললে স্বয়ংক্রিয়ভাবে ৫০ পয়েন্ট উপহার
    async createUser({ user }) {
      if (!user.id) return;
      try {
        await prisma.pointTransaction.create({
          data: {
            userId: user.id,
            amount: 50,
            reason: "SIGNUP_BONUS",
            description: "গুগল সাইন-আপ ওয়েলকাম বোনাস ৫০ পয়েন্ট",
          },
        });
      } catch (e) {
        console.warn("Points notice:", e);
      }
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true, badge: true, pointsBalance: true, walletBalance: true },
        });
        if (dbUser) {
          (session.user as any).role = dbUser.role;
          (session.user as any).badge = dbUser.badge;
          (session.user as any).pointsBalance = dbUser.pointsBalance;
          (session.user as any).walletBalance = Number(dbUser.walletBalance);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});