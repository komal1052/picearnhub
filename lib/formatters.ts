// ইংরেজি সংখ্যাকে বাংলায় রূপান্তর
export function toBengaliNumber(num: number | string | undefined | null): string {
  if (num === undefined || num === null) return "০";
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}

// টাকার ফরম্যাটার (৳)
export function formatTaka(amount: number | string | undefined | null): string {
  if (!amount) return "৳০";
  return `৳${toBengaliNumber(amount)}`;
}

// তারিখকে বাংলায় রূপান্তর (যেমন: ১২ নভেম্বর, ২০২৬)
export function toBengaliDate(dateInput: Date | string | undefined | null): string {
  if (!dateInput) return "চলমান";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "চলমান";

  const months = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];

  const day = toBengaliNumber(date.getDate());
  const month = months[date.getMonth()];
  const year = toBengaliNumber(date.getFullYear());

  return `${day} ${month}, ${year}`;
}