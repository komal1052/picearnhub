import { prisma } from "@/lib/prisma";
import HomeExperience from "@/components/HomeExperience";

export const revalidate = 0; // Fresh database updates on reload

export default async function HomePage() {
  const [contests, photos, announcements] = await Promise.all([
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
      take: 4,
    }),
  ]);

  return (
    <main className="min-h-screen bg-black text-white px-4 md:px-8 py-6 max-w-[1400px] mx-auto">
      <HomeExperience
        contests={contests}
        photos={photos}
        announcements={announcements}
        winnerPhoto={null}
      />
    </main>
  );
}