import { PrismaClient, Role, BadgeType, AspectRatio, PhotoStatus, ResolutionTier, ContestTier, ContestStatus } from "@prisma/client";

const prisma = new PrismaClient();

function createProofSvg(userName: string, amount: string, trxId: string, gateway: string = "bKash"): string {
  const isBkash = gateway === "bKash";
  const headerColor = isBkash ? "#E2136E" : "#F7941D";

  const svg = `
<svg width="400" height="520" viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#ECEFF1" />
  <rect x="20" y="20" width="360" height="480" rx="20" fill="#FFFFFF" />
  <path d="M 20 40 Q 20 20 40 20 L 360 20 Q 380 20 380 40 L 380 120 L 20 120 Z" fill="${headerColor}" />
  <text x="200" y="60" font-family="Arial, sans-serif" font-size="20" font-weight="900" fill="#FFFFFF" text-anchor="middle">${gateway}</text>
  <circle cx="200" cy="120" r="30" fill="#FFFFFF" />
  <circle cx="200" cy="120" r="24" fill="#10B981" />
  <path d="M 190 120 L 197 127 L 211 113" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
  <text x="200" y="180" font-family="'Segoe UI', Arial" font-size="15" font-weight="700" fill="#1E293B" text-anchor="middle">Payment Successful</text>
  <text x="200" y="225" font-family="'Segoe UI', Arial" font-size="32" font-weight="900" fill="${headerColor}" text-anchor="middle">${amount}</text>
  <line x1="40" y1="260" x2="360" y2="260" stroke="#E2E8F0" stroke-width="1.5" stroke-dasharray="6,6" />
  <g font-family="'Segoe UI', Arial" font-size="12">
    <text x="45" y="295" fill="#64748B" font-weight="600">Recipient</text>
    <text x="355" y="295" fill="#0F172A" font-weight="700" text-anchor="end">${userName}</text>
    <text x="45" y="340" fill="#64748B" font-weight="600">TrxID</text>
    <text x="355" y="340" fill="${headerColor}" font-weight="800" font-family="monospace" text-anchor="end">${trxId}</text>
    <text x="45" y="385" fill="#64748B" font-weight="600">Reference</text>
    <text x="355" y="385" fill="#0F172A" font-weight="700" text-anchor="end">PicEarnHub Prize</text>
    <text x="45" y="430" fill="#64748B" font-weight="600">Time</text>
    <text x="355" y="430" fill="#0F172A" font-weight="700" text-anchor="end">Completed Just Now</text>
  </g>
  <rect x="60" y="455" width="280" height="28" rx="14" fill="#F1F5F9" />
  <text x="200" y="473" font-family="'Segoe UI', Arial" font-size="11" font-weight="700" fill="#059669" text-anchor="middle">✔ Verified by PicEarnHub Payment Gateway</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

async function main() {
  console.log("🚀 Seeding with exact 16:9 Landscape and 9:16 Portrait Ratios...");

  await prisma.vote.deleteMany();
  await prisma.contestEntry.deleteMany();
  await prisma.contest.deleteMany();
  await prisma.unlockedPhoto.deleteMany();
  await prisma.photoVariant.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.pointTransaction.deleteMany();
  await prisma.payoutProof.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      email: "picearnhub@gmail.com",
      name: "Md. Baha Uddin",
      password: "123456", // Password is set to 123456
      phone: "01712345678",
      role: Role.ADMIN,
      badge: BadgeType.LEGENDARY,
      walletBalance: 250.0,
      pointsBalance: 1500,
      location: "ঢাকা, বাংলাদেশ",
      bio: "পিকআর্নহাবের প্রতিষ্ঠাতা ও প্রধান অ্যাডমিনিস্ট্রেটর।",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
    },
  });

  const creatorTanvir = await prisma.user.create({
    data: {
      email: "tanvir.lens@gmail.com",
      name: "তানভীর হাসান",
      password: "123456",
      phone: "01811223344",
      role: Role.CREATOR,
      badge: BadgeType.FIRE_CREATOR,
      walletBalance: 85.0,
      pointsBalance: 340,
      location: "সিলেট, বাংলাদেশ",
      bio: "প্রকৃতি ও ল্যান্ডস্কেপ ফটোগ্রাফার।",
      avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200",
    },
  });

  const creatorSadia = await prisma.user.create({
    data: {
      email: "sadia.nature@gmail.com",
      name: "সাদিয়া আফরিন",
      password: "123456",
      phone: "01755667788",
      role: Role.CREATOR,
      badge: BadgeType.BLUE_VERIFIED,
      walletBalance: 45.0,
      pointsBalance: 180,
      location: "চট্টগ্রাম, বাংলাদেশ",
      bio: "ওয়াইল্ডলাইফ ও প্রকৃতি ফটোগ্রাফার।",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    },
  });

  const creatorArif = await prisma.user.create({
    data: {
      email: "arif.ai.art@gmail.com",
      name: "আরিফুল ইসলাম",
      password: "123456",
      phone: "01999887766",
      role: Role.CREATOR,
      badge: BadgeType.BLUE_VERIFIED,
      walletBalance: 30.0,
      pointsBalance: 95,
      location: "ঢাকা, বাংলাদেশ",
      bio: "এআই ডিজিটাল আর্টিস্ট ও ফটোগ্রাফার।",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    },
  });

  const now = new Date();

  const contest24h = await prisma.contest.create({
    data: {
      title: "২৪ ঘণ্টার ফ্ল্যাশ কনটেস্ট (কুয়াশা ও শিশির)",
      tier: ContestTier.HOURLY_24,
      prizePool: 5.0,
      startTime: now,
      endTime: new Date(now.getTime() + 18 * 60 * 60 * 1000),
      status: ContestStatus.ACTIVE,
      allowAi: true,
    },
  });

  const contest7d = await prisma.contest.create({
    data: {
      title: "৭ দিনের সাপ্তাহিক কনটেস্ট (গ্রামবাংলার রূপ)",
      tier: ContestTier.WEEKLY_7D,
      prizePool: 25.0,
      startTime: now,
      endTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      status: ContestStatus.ACTIVE,
      allowAi: false,
    },
  });

  const contest30d = await prisma.contest.create({
    data: {
      title: "৩০ দিনের মেগা গ্র্যান্ড প্রাইজ (ল্যান্ডস্কেপ চ্যাম্পিয়নশিপ)",
      tier: ContestTier.MONTHLY_30D,
      prizePool: 100.0,
      startTime: now,
      endTime: new Date(now.getTime() + 24 * 24 * 60 * 60 * 1000),
      status: ContestStatus.ACTIVE,
      allowAi: true,
    },
  });

  const contestPast = await prisma.contest.create({
    data: {
      title: "মুনসুন রিফ্লেকশন চ্যালেঞ্জ (বিগত বিজয়ী)",
      tier: ContestTier.WEEKLY_7D,
      prizePool: 50.0,
      startTime: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      status: ContestStatus.COMPLETED,
      allowAi: true,
    },
  });

  // Balanced Dataset: Real 16:9 Landscape + Real 9:16 Portrait Wallpapers
  const photoDataset = [
    // --- ১৬:৯ ল্যান্ডস্কেপ ছবিসমূহ (Landscape 16:9) ---
    {
      title: "সুন্দরবনের রয়েল বেঙ্গল টাইগারের গভীর চাহনি",
      category: "Nature",
      aspectRatio: AspectRatio.RATIO_16_9,
      userId: creatorTanvir.id,
      votes: 285,
      views: 2420,
      imageUrl: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1200&h=675&fit=crop",
      contestId: contestPast.id,
      isWinner: true,
    },
    {
      title: "গোধূলি লগ্নে পদ্মার শান্ত বুকে জেলে নৌকা",
      category: "Nature",
      aspectRatio: AspectRatio.RATIO_16_9,
      userId: creatorTanvir.id,
      votes: 220,
      views: 2100,
      imageUrl: "https://images.unsplash.com/photo-1593351415075-3bac9f45c877?w=1200&h=675&fit=crop",
      contestId: contest30d.id,
    },
    {
      title: "ঐতিহাসিক লালবাগ কেল্লার প্রাচীন রূপ",
      category: "Street",
      aspectRatio: AspectRatio.RATIO_16_9,
      userId: admin.id,
      votes: 190,
      views: 1850,
      imageUrl: "https://images.unsplash.com/photo-1564034503-e7c9edcb420c?w=1200&h=675&fit=crop",
      contestId: contest30d.id,
    },
    {
      title: "জাফলংয়ের স্বচ্ছ নদী ও পাহাড়ি সৌন্দর্য",
      category: "Nature",
      aspectRatio: AspectRatio.RATIO_16_9,
      userId: creatorSadia.id,
      votes: 164,
      views: 1600,
      imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=675&fit=crop",
      contestId: contest30d.id,
    },
    {
      title: "পাহাড়ের চূড়ায় সোনালী সূর্যাস্ত",
      category: "Nature",
      aspectRatio: AspectRatio.RATIO_16_9,
      userId: admin.id,
      votes: 142,
      views: 1250,
      imageUrl: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1200&h=675&fit=crop",
      contestId: contest24h.id,
    },
    {
      title: "জলের বুকে প্রস্ফুটিত গোলাপি পদ্ম ও শাপলা",
      category: "Nature",
      aspectRatio: AspectRatio.RATIO_16_9,
      userId: creatorSadia.id,
      votes: 125,
      views: 1150,
      imageUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1200&h=675&fit=crop",
      contestId: contest24h.id,
    },
    {
      title: "নিয়ন আলোকিত সাইবারপাঙ্ক ঢাকা ২০৮৮",
      category: "Abstract",
      aspectRatio: AspectRatio.RATIO_16_9,
      userId: creatorArif.id,
      votes: 134,
      views: 1450,
      isAi: true,
      aiModel: "Midjourney v6.0",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=675&fit=crop",
      contestId: contest30d.id,
    },

    // --- ৯:১৬ খাড়া পোর্ট্রেট ছবিসমূহ (Portrait 9:16 - Real Vertical) ---
    {
      title: "মেঘে ঢাকা নীলগিরির পাহাড়ি উপত্যকা",
      category: "Wallpaper",
      aspectRatio: AspectRatio.RATIO_9_16,
      userId: creatorSadia.id,
      votes: 140,
      views: 1320,
      imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&h=1600&fit=crop",
      contestId: contest7d.id,
    },
    {
      title: "পুরান ঢাকার ঐতিহ্যবাহী রঙিন রিকশা",
      category: "Street",
      aspectRatio: AspectRatio.RATIO_9_16,
      userId: creatorTanvir.id,
      votes: 98,
      views: 980,
      imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=900&h=1600&fit=crop",
      contestId: contest7d.id,
    },
    {
      title: "গভীর রাতে আকাশভরা তারার মেলা",
      category: "Wallpaper",
      aspectRatio: AspectRatio.RATIO_9_16,
      userId: creatorSadia.id,
      votes: 110,
      views: 1040,
      imageUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=900&h=1600&fit=crop",
      contestId: contest7d.id,
    },
  ];

  for (const item of photoDataset) {
    const photo = await prisma.photo.create({
      data: {
        userId: item.userId,
        title: item.title,
        category: item.category,
        aspectRatio: item.aspectRatio,
        imageUrl: item.imageUrl,
        isFree: true,
        status: PhotoStatus.APPROVED,
        isAiGenerated: item.isAi || false,
        aiModelUsed: item.aiModel || null,
        voteCount: item.votes,
        viewCount: item.views,
        nsfwScore: 0.01,
      },
    });

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

  // ৩টি পেমেন্ট প্রুফ
  await prisma.payoutProof.createMany({
    data: [
      {
        userName: "তানভীর হাসান",
        amount: "৳৫০০",
        gateway: "bKash",
        trxId: "BL84K9XZ10",
        proofImage: createProofSvg("Tanvir Hasan (01811***344)", "৳ 500.00", "BL84K9XZ10", "bKash"),
      },
      {
        userName: "সাদিয়া আফরিন",
        amount: "৳১,০০০",
        gateway: "bKash",
        trxId: "BK92M4PL80",
        proofImage: createProofSvg("Sadia Afrin (01755***788)", "৳ 1,000.00", "BK92M4PL80", "bKash"),
      },
      {
        userName: "আরিফুল ইসলাম",
        amount: "৳২,৫০০",
        gateway: "Nagad",
        trxId: "NG71X5TR22",
        proofImage: createProofSvg("Ariful Islam (01999***766)", "৳ 2,500.00", "NG71X5TR22", "Nagad"),
      },
    ],
  });

  // ৩টি নোটিশ
  await prisma.announcement.createMany({
    data: [
      {
        title: "বিকাশ ও নগদে এই সপ্তাহের সকল উইথড্র সফলভাবে পরিশোধ করা হয়েছে।",
        content: "All pending withdrawals have been disbursed.",
        badgeTag: "PAYOUT",
        priority: 10,
        isActive: true,
      },
      {
        title: "৫০ ভোট পেলেই ব্লু ভেরিফায়েড টিক (Blue Tick) এবং ১০০ ভোটে ফায়ার ব্যাজ 🔥",
        content: "Milestone badges unlock automatically at 50 and 100 votes.",
        badgeTag: "RULES",
        priority: 9,
        isActive: true,
      },
      {
        title: "এআই দিয়ে তৈরি ছবিতে অবশ্যই AI Art ট্যাগ সিলেক্ট করতে হবে।",
        content: "Disclose your AI model upon submission.",
        badgeTag: "UPDATE",
        priority: 8,
        isActive: true,
      },
    ],
  });

  console.log("🎉 Seeding complete with both 16:9 Landscape and 9:16 Portrait photos!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });