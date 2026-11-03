import { PrismaClient, Role, BadgeType, AspectRatio, PhotoStatus, ResolutionTier, ContestTier, ContestStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Database Seeding for PicEarnHub...");

  // 1. Clean existing records (safe idempotent rerun)
  await prisma.vote.deleteMany();
  await prisma.contestEntry.deleteMany();
  await prisma.contest.deleteMany();
  await prisma.unlockedPhoto.deleteMany();
  await prisma.photoVariant.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.pointTransaction.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.adPlacement.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users (Admin & Verified Photographers)
  const admin = await prisma.user.create({
    data: {
      email: "admin@picearnhub.com",
      name: "Platform Administrator",
      role: Role.ADMIN,
      badge: BadgeType.LEGENDARY,
      walletBalance: 1500.0,
      pointsBalance: 1000,
      referralCode: "ADMIN-VIP",
      location: "Dhaka, Bangladesh",
    },
  });

  const creatorTanvir = await prisma.user.create({
    data: {
      email: "tanvir.lens@gmail.com",
      name: "Tanvir Hasan",
      role: Role.CREATOR,
      badge: BadgeType.FIRE_CREATOR, // 100+ votes milestone
      walletBalance: 145.5,
      lifetimeEarned: 320.0,
      pointsBalance: 120,
      referralCode: "TANVIR-SHOTS",
      location: "Dhaka, Bangladesh",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
    },
  });

  const creatorSarah = await prisma.user.create({
    data: {
      email: "sarah.nature@gmail.com",
      name: "Sarah Jenkins",
      role: Role.CREATOR,
      badge: BadgeType.BLUE_VERIFIED, // 50+ votes milestone
      walletBalance: 82.0,
      lifetimeEarned: 150.0,
      pointsBalance: 85,
      referralCode: "SARAH-NATURE",
      location: "Toronto, Canada",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    },
  });

  const creatorArif = await prisma.user.create({
    data: {
      email: "arif.ai@gmail.com",
      name: "Arif Khan",
      role: Role.CREATOR,
      badge: BadgeType.NONE,
      walletBalance: 12.0,
      pointsBalance: 50,
      referralCode: "ARIF-AI",
      location: "Chittagong, Bangladesh",
      avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200",
    },
  });

  console.log("✅ Users & Creators created.");

  // 3. Contests (24h Flash, 7d Weekly, 30d Mega, Past Winner)
  const now = new Date();

  const contest24h = await prisma.contest.create({
    data: {
      title: "⚡ ২৪ ঘণ্টার ফ্ল্যাশ কনটেস্ট (Golden Hour Challenge)",
      tier: ContestTier.HOURLY_24,
      prizePool: 5.0,
      startTime: now,
      endTime: new Date(now.getTime() + 14 * 60 * 60 * 1000),
      status: ContestStatus.ACTIVE,
      allowAi: true,
    },
  });

  const contest7d = await prisma.contest.create({
    data: {
      title: "👑 ৭ দিনের স্ট্রিট ও লাইফস্টাইল চ্যাম্পিয়নশিপ",
      tier: ContestTier.WEEKLY_7D,
      prizePool: 25.0,
      startTime: now,
      endTime: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
      status: ContestStatus.ACTIVE,
      allowAi: false,
    },
  });

  const contest30d = await prisma.contest.create({
    data: {
      title: "💎 ৩০ দিনের মেগা ল্যান্ডস্কেপ গ্র্যান্ড প্রাইজ ($100 Pool)",
      tier: ContestTier.MONTHLY_30D,
      prizePool: 100.0,
      startTime: now,
      endTime: new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000),
      status: ContestStatus.ACTIVE,
      allowAi: true,
    },
  });

  const contestPast = await prisma.contest.create({
    data: {
      title: "🏆 মুনসুন রিফ্লেকশন চ্যালেঞ্জ (বিগত বিজয়ী)",
      tier: ContestTier.WEEKLY_7D,
      prizePool: 50.0,
      startTime: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      status: ContestStatus.COMPLETED,
      allowAi: true,
    },
  });

  console.log("✅ Contests created.");

  // 4. Sample Photos & Multi-tier variants
  const samplePhotos = [
    {
      title: "Sunset Over Padma Bridge",
      category: "Nature",
      aspectRatio: AspectRatio.RATIO_16_9,
      userId: creatorTanvir.id,
      isAi: false,
      votes: 135,
      views: 1420,
      contestId: contest30d.id,
    },
    {
      title: "Old Dhaka Rickshaw Life",
      category: "Street",
      aspectRatio: AspectRatio.RATIO_9_16,
      userId: creatorTanvir.id,
      isAi: false,
      votes: 94,
      views: 890,
      contestId: contest7d.id,
    },
    {
      title: "Cyberpunk Neon Temple in 2088",
      category: "Abstract",
      aspectRatio: AspectRatio.RATIO_16_9,
      userId: creatorArif.id,
      isAi: true,
      aiModel: "Midjourney v6.0",
      votes: 48,
      views: 650,
      contestId: contest30d.id,
    },
    {
      title: "Bengal Tiger Gaze at Dawn",
      category: "Nature",
      aspectRatio: AspectRatio.RATIO_16_9,
      userId: creatorTanvir.id,
      isAi: false,
      votes: 180,
      views: 2300,
      contestId: contestPast.id,
      isWinner: true,
    },
  ];

  for (const item of samplePhotos) {
    const photo = await prisma.photo.create({
      data: {
        userId: item.userId,
        title: item.title,
        category: item.category,
        aspectRatio: item.aspectRatio,
        isFree: true,
        status: PhotoStatus.APPROVED,
        isAiGenerated: item.isAi,
        aiModelUsed: item.aiModel || null,
        voteCount: item.votes,
        viewCount: item.views,
        nsfwScore: 0.02,
      },
    });

    // Variants (720p, 1080p, 2K)
    await prisma.photoVariant.createMany({
      data: [
        {
          photoId: photo.id,
          tier: ResolutionTier.RES_720P,
          storageKey: `photos/${photo.id}/720p.webp`,
          fileSizeKb: 280,
          width: item.aspectRatio === AspectRatio.RATIO_9_16 ? 720 : 1280,
          height: item.aspectRatio === AspectRatio.RATIO_9_16 ? 1280 : 720,
          isWatermarked: true,
          price: 0.0,
        },
        {
          photoId: photo.id,
          tier: ResolutionTier.RES_1080P,
          storageKey: `photos/${photo.id}/1080p.webp`,
          fileSizeKb: 850,
          width: item.aspectRatio === AspectRatio.RATIO_9_16 ? 1080 : 1920,
          height: item.aspectRatio === AspectRatio.RATIO_9_16 ? 1920 : 1080,
          isWatermarked: false,
          price: 1.5,
        },
        {
          photoId: photo.id,
          tier: ResolutionTier.RES_2K,
          storageKey: `photos/${photo.id}/2k.webp`,
          fileSizeKb: 1800,
          width: item.aspectRatio === AspectRatio.RATIO_9_16 ? 1440 : 2560,
          height: item.aspectRatio === AspectRatio.RATIO_9_16 ? 2560 : 1440,
          isWatermarked: false,
          price: 3.5,
        },
      ],
    });

    // Contest Entry
    await prisma.contestEntry.create({
      data: {
        contestId: item.contestId,
        photoId: photo.id,
        userId: item.userId,
        votesReceived: item.votes,
        isWinner: item.isWinner || false,
        rankPosition: item.isWinner ? 1 : null,
      },
    });
  }

  console.log("✅ Photos and Contest Entries created.");

  // 5. Sidebar Notices
  await prisma.announcement.createMany({
    data: [
      {
        title: "bKash, Nagad ও Skrill উইথড্র সফলভাবে সম্পন্ন করা হয়েছে।",
        content: "All pending payout requests have been disbursed.",
        badgeTag: "PAYOUT",
        priority: 10,
        isActive: true,
      },
      {
        title: "৫০ ভোট পেলেই ব্লু ভেরিফায়েড টিক (Blue Tick) এবং ১০০ ভোটে ফায়ার ব্যাজ 🔥",
        content: "Earn badges automatically as your votes increase.",
        badgeTag: "RULES",
        priority: 9,
        isActive: true,
      },
      {
        title: "AI দিয়ে তৈরি ছবিতে অবশ্যই AI Art ট্যাগ সিলেক্ট করতে হবে।",
        content: "Disclose your AI model on upload.",
        badgeTag: "UPDATE",
        priority: 8,
        isActive: true,
      },
    ],
  });

  console.log("🚀 PicEarnHub Seeding Finished Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });