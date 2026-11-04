const sharp = require("sharp");

// সম্পূর্ণ ভ্যালিড XML ফরম্যাটে বিকাশ সেন্ড মানি রসিদের ডিজাইন
const svgReceipt = `
<svg width="420" height="580" viewBox="0 0 420 580" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- ব্যাকগ্রাউন্ড -->
  <rect width="100%" height="100%" fill="#ECEFF1" />

  <!-- কার্ড -->
  <rect x="25" y="25" width="370" height="530" rx="24" fill="#FFFFFF" filter="url(#shadow)" />

  <!-- বিকাশ পিঙ্ক হেডার ব্যানার -->
  <path d="M 25 49 Q 25 25 49 25 L 371 25 Q 395 25 395 49 L 395 140 L 25 140 Z" fill="#E2136E" />

  <!-- বিকাশ লোগো টেক্সট -->
  <text x="210" y="65" font-family="Arial, sans-serif" font-size="20" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">bKash</text>

  <!-- সাদা টিক সার্কেল -->
  <circle cx="210" cy="140" r="34" fill="#FFFFFF" filter="url(#shadow)" />
  <circle cx="210" cy="140" r="28" fill="#10B981" />
  <path d="M 198 140 L 206 148 L 223 131" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />

  <!-- স্ট্যাটাস টেক্সট -->
  <text x="210" y="205" font-family="'Segoe UI', Arial, sans-serif" font-size="16" font-weight="700" fill="#1E293B" text-anchor="middle">
    Send Money সফল হয়েছে
  </text>

  <!-- টাকার পরিমাণ -->
  <text x="210" y="252" font-family="'Segoe UI', Arial, sans-serif" font-size="34" font-weight="900" fill="#E2136E" text-anchor="middle">
    ৳ 500.00
  </text>
  <text x="210" y="274" font-family="'Segoe UI', Arial, sans-serif" font-size="12" font-weight="600" fill="#64748B" text-anchor="middle">
    চার্জ: ৳ 0.00 - মোট: ৳ 500.00
  </text>

  <!-- ডিভাইডার ড্যাশ লাইন -->
  <line x1="45" y1="295" x2="375" y2="295" stroke="#E2E8F0" stroke-width="1.5" stroke-dasharray="6,6" />

  <!-- ট্রানজেকশন তথ্য -->
  <g font-family="'Segoe UI', Arial, sans-serif" font-size="12">
    <!-- প্রাপক -->
    <text x="50" y="330" fill="#64748B" font-weight="600">প্রাপক</text>
    <text x="370" y="330" fill="#0F172A" font-weight="700" text-anchor="end">Tanvir Hasan (01711***344)</text>

    <!-- ট্রানজেকশন আইডি -->
    <text x="50" y="375" fill="#64748B" font-weight="600">TrxID</text>
    <text x="370" y="375" fill="#E2136E" font-weight="800" font-family="Courier, monospace" font-size="14" text-anchor="end">BL83K9XZ10</text>

    <!-- রেফারেন্স -->
    <text x="50" y="420" fill="#64748B" font-weight="600">রেফারেন্স</text>
    <text x="370" y="420" fill="#0F172A" font-weight="700" text-anchor="end">PicEarnHub Contest Prize</text>

    <!-- সময় ও তারিখ -->
    <text x="50" y="465" fill="#64748B" font-weight="600">সময় ও তারিখ</text>
    <text x="370" y="465" fill="#0F172A" font-weight="700" text-anchor="end">Today, 12:45 PM</text>
  </g>

  <!-- ফুটার ভেরিফায়েড ট্যাগ -->
  <rect x="70" y="495" width="280" height="32" rx="16" fill="#F1F5F9" />
  <text x="210" y="515" font-family="'Segoe UI', Arial, sans-serif" font-size="11" font-weight="700" fill="#059669" text-anchor="middle">
    ভেরিফায়েড বিকাশ পেমেন্ট সম্পন্ন
  </text>
</svg>
`;

sharp(Buffer.from(svgReceipt))
  .png()
  .toFile("proof.png")
  .then(() => {
    console.log("==================================================");
    console.log("🎉 প্রমাণ স্ক্রিনশট তৈরি সম্পন্ন: proof.png");
    console.log("📂 লোকেশন: C:\\Users\\baha4\\picearnhub\\proof.png");
    console.log("==================================================");
  })
  .catch((err) => {
    console.error("Error creating image:", err);
  });