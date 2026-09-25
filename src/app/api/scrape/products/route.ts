import { NextResponse } from "next/server";
import { scrapeExhibitorProducts } from "../../../../lib/scrapeExhibitors";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST() {
    try {
        const result = await scrapeExhibitorProducts();
        return NextResponse.json({ ok: true, ...result });
    } catch (err) {
        return NextResponse.json(
            { ok: false, error: err instanceof Error ? err.message : String(err) },
            { status: 500 },
        );
    }
}