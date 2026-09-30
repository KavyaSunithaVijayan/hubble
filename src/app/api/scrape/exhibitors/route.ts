import { NextResponse } from "next/server";
import { scrapeMmiExhibitors } from "@/lib/scrapeExhibitors";

export async function POST() {
    try {
        const result = await scrapeMmiExhibitors();

        return NextResponse.json(result);
    } catch (error) {
        console.error("MMI exhibitor scraper failed:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Unknown scraper error",
            },
            {
                status: 500,
            },
        );
    }
}