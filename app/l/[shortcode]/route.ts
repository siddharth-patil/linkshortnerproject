import { getLinkByShortCode } from "@/lib/db/links";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ shortcode: string }> }
) {
  try {
    const { shortcode } = await params;

    if (!shortcode) {
      return NextResponse.json(
        { error: "Short code is required" },
        { status: 400 }
      );
    }

    const link = await getLinkByShortCode(shortcode);

    if (!link) {
      return NextResponse.json(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    return NextResponse.redirect(link.url, { status: 301 });
  } catch (error) {
    console.error("Redirect error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
