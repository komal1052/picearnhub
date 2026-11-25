import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("url");
    const filename = searchParams.get("filename") || `picearnhub_${Date.now()}.jpg`;

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is missing" }, { status: 400 });
    }

    // ১. যদি ছবিটি Base64 ডাটা হয়
    if (imageUrl.startsWith("data:")) {
      const base64Data = imageUrl.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");
      return new NextResponse(buffer, {
        headers: {
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Type": "image/jpeg",
        },
      });
    }

    // ২. যদি এক্সটার্নাল ইউআরএল হয় (সার্ভার দিয়ে ফেচ করে ব্রাউজারে এটাচমেন্ট হিসেবে পুশ করা)
    const res = await fetch(imageUrl);
    const arrayBuffer = await res.arrayBuffer();

    return new NextResponse(Buffer.from(arrayBuffer), {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": res.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Download proxy error:", error);
    return NextResponse.json({ error: "Failed to download image file" }, { status: 500 });
  }
}