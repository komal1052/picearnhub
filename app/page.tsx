import { prisma } from "@/lib/prisma";
import HomeExperience from "@/components/HomeExperience";

export const revalidate = 0; // প্রতি রিলোডে ফ্রেশ ডাটাবেস আপডেট

export default async function HomePage() {
  const [contests, photos, announcements, payoutProofs] = await Promise.all([
    prisma.contest.findMany({
      where: { status: "ACTIVE" },
      orderBy: { endTime: "asc" },
    }),
    prisma.photo.findMany({
      where: { status: "APPROVED" },
      include: { user: true, variants: true },
      orderBy: { voteCount: "desc" },
    }),
    prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: { priority: "desc" },
      take: 5,
    }),
    prisma.payoutProof.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  // প্রিজমার Decimal অবজেক্টগুলোকে প্লেইন অবজেক্টে রূপান্তর (Next.js RSC Serialization Fix)
  const serializedContests = JSON.parse(JSON.stringify(contests));
  const serializedPhotos = JSON.parse(JSON.stringify(photos));
  const serializedAnnouncements = JSON.parse(JSON.stringify(announcements));
  const serializedProofs = JSON.parse(JSON.stringify(payoutProofs));

  return (
    <main className="min-h-screen bg-brand-bg text-brand-text pb-20 md:pb-12">
      <HomeExperience
        contests={serializedContests}
        photos={serializedPhotos}
        announcements={serializedAnnouncements}
        payoutProofs={serializedProofs}
        winnerPhoto={serializedPhotos[0] || null}
      />
    </main>
  );
}