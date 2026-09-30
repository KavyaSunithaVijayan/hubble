import * as cheerio from "cheerio";
import { db } from "./prisma";
import type { ProductDetails } from "@/lib/productDetails";

const BASE = "https://www.cavliwireless.com";

export const CAVLI_TARGETS = [
    { slug: "cqm220", name: "CQM220", path: "/iot-modules/c-series/cqm220" },
    { slug: "cqm211", name: "CQM211", path: "/iot-modules/c-series/cqm211" },
    { slug: "cq20", name: "CQ20", path: "/iot-modules/c-series/cq20" },
    { slug: "c20qm", name: "C20QM", path: "/iot-modules/c-series/c20qm" },
    { slug: "c10qm", name: "C10QM", path: "/iot-modules/c-series/c10qm" },
    { slug: "cq16", name: "CQ16", path: "/iot-modules/c-series/cq16" },
    { slug: "c16qs", name: "C16QS", path: "/iot-modules/c-series/c16qs" },
    { slug: "c41qs", name: "C41QS", path: "/iot-modules/c-series/c41qs" },
    { slug: "aq62", name: "AQ62", path: "/iot-modules/a-series/aq62" },
] as const;

type Target = (typeof CAVLI_TARGETS)[number];

type ParsedProduct = {
    tagline: string | null;
    description: string;
    category: string | null;
    image: string | null;
    details: ProductDetails;
};

type Block = { text: string; tag: "h1" | "h2" | "h3" | "" };
type Section = { title: string; lines: string[] };

const BLOCK_SELECTOR =
    "div, p, li, h1, h2, h3, h4, h5, h6, td, th, section, article, header, footer, main, nav, ul, ol, table, tr, figure, figcaption";
const STOP_SECTION = /^(go beyond|featured videos|meet our)/i;
const NON_ABOUT = /key highlights|form-?factor|technical data|use cases|variants|downloadable|order your/i;

const SPEC_KEYS: { match: (lower: string) => boolean; label: string }[] = [
    { match: (l) => l.startsWith("cellular bands"), label: "Cellular bands" },
    { match: (l) => l.startsWith("supported location"), label: "Location services" },
    { match: (l) => l === "os", label: "OS" },
    { match: (l) => l.startsWith("cellular connectivity"), label: "Peak speed" },
    { match: (l) => l === "packaging", label: "Packaging" },
    { match: (l) => l === "interfaces", label: "Interfaces" },
];

const clean = (s: string) => s.replace(/\s+/g, " ").trim();
const unique = (items: string[]) => [...new Set(items)];
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchHtml(url: string): Promise<string> {
    const res = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (compatible; HubbleDemoBot/1.0)",
            "Accept-Language": "en",
        },
        signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) throw new Error(`${url} returned ${res.status}`);
    return res.text();
}

// Every "leaf" block element (one that contains no other block) becomes one line of text.
function extractBlocks($: cheerio.CheerioAPI): Block[] {
    $("script, style, noscript, svg").remove();
    const blocks: Block[] = [];

    $("body *").each((_, el) => {
        const $el = $(el);
        if (!$el.is(BLOCK_SELECTOR) || $el.find(BLOCK_SELECTOR).length > 0) return;
        const text = clean($el.text());
        if (!text) return;

        const heading = $el.closest("h1, h2, h3");
        const tagName = heading.length ? String(heading.prop("tagName")).toLowerCase() : "";
        const tag = tagName === "h1" || tagName === "h2" || tagName === "h3" ? tagName : "";
        blocks.push({ text, tag });
    });

    return blocks;
}

function buildSections(blocks: Block[]) {
    const start = blocks.findIndex((b) => b.tag === "h1");
    if (start === -1) return null;

    const intro: string[] = [];
    const sections: Section[] = [];
    let current: Section | null = null;

    for (const block of blocks.slice(start + 1)) {
        if (block.tag === "h1") continue;
        if (block.tag === "h2" || block.tag === "h3") {
            if (STOP_SECTION.test(block.text)) break;
            current = { title: block.text, lines: [] };
            sections.push(current);
            continue;
        }
        (current ? current.lines : intro).push(block.text);
    }

    return { intro, sections };
}

function parseSpecs(lines: string[]) {
    const groups: { label: string; parts: string[] }[] = [];
    let pending = "";

    for (const raw of lines) {
        // footnote line: "* Optional feature | ** Requires SDK"
        if (/optional feature/i.test(raw) && /requires sdk/i.test(raw)) continue;

        const key = SPEC_KEYS.find((k) => k.match(raw.toLowerCase()));
        if (key) {
            groups.push({ label: key.label, parts: [] });
            pending = "";
            continue;
        }

        const group = groups[groups.length - 1];
        if (!group) continue;

        // "Global :" on its own line belongs together with the line after it
        const line = pending ? `${pending} ${raw}` : raw;
        if (line.endsWith(":")) {
            pending = line;
            continue;
        }
        group.parts.push(line);
        pending = "";
    }

    return groups
        .filter((g) => g.parts.length > 0)
        .map((g) => ({ label: g.label, value: unique(g.parts).join("\n") }));
}

function parseVariants($: cheerio.CheerioAPI): ProductDetails["variants"] {
    const table = $("table").first();
    if (!table.length) return undefined;

    const columns = table
        .find("th")
        .map((_, th) => clean($(th).text()))
        .get();
    if (columns.length === 0) return undefined;

    const rows: string[][] = [];
    table.find("tr").each((_, tr) => {
        const cells = $(tr)
            .find("td")
            .map((__, td) => clean($(td).text()))
            .get();
        if (cells.length === 0) return;

        // cells look like "GNSSYes": remove the column name prefix
        rows.push(
            cells.map((cell, i) => {
                const col = columns[i] ?? "";
                return col && cell.toLowerCase().startsWith(col.toLowerCase()) ? cell.slice(col.length).trim() : cell;
            }),
        );
    });

    return rows.length > 0 ? { columns, rows } : undefined;
}

function pickImage($: cheerio.CheerioAPI, name: string): string | null {
    const candidates: string[] = [];

    $("img").each((_, img) => {
        const alt = (($(img).attr("alt") as string | undefined) ?? "").toLowerCase();
        const src = ($(img).attr("src") as string | undefined) ?? "";
        if (!alt.includes(name.toLowerCase()) || !src) return;

        try {
            const url = new URL(src, BASE);
            // next/image URLs wrap the real file in ?url=...
            const real = url.searchParams.get("url") ?? url.toString();
            if (/\.(webp|png|jpe?g)(\?|$)/i.test(real)) candidates.push(real);
        } catch {
            /* ignore bad URLs */
        }
    });

    return candidates[0] ?? ($('meta[property="og:image"]').attr("content") as string | undefined) ?? null;
}

export function parseProductPage(html: string, name: string): ParsedProduct {
    const $ = cheerio.load(html);

    const meta = clean(($('meta[name="description"]').attr("content") as string | undefined) ?? "");
    const tagline = meta ? meta.split(/(?<=[.!?])\s/)[0].slice(0, 120) : null;
    const image = pickImage($, name);

    const resources: { label: string; url: string }[] = [];
    $('a[href*="product-brochure"]').each((_, a) => {
        const href = $(a).attr("href");
        if (!href) return;
        const url = new URL(href, BASE).toString();
        if (!resources.some((r) => r.url === url)) resources.push({ label: "Product Brochure", url });
    });

    const variants = parseVariants($);

    const built = buildSections(extractBlocks($));
    if (!built) throw new Error("No <h1> found: page layout changed");
    const { intro, sections } = built;

    const findSection = (re: RegExp) => sections.find((s) => re.test(s.title));

    // badges are the short lines right under the title, before "Available form-factor"
    const formFactorAt = intro.findIndex((l) => /^available form-?factors?/i.test(l));
    const badges = unique(formFactorAt === -1 ? intro.slice(0, 3) : intro.slice(0, formFactorAt)).slice(0, 4);
    const about = sections.find((s) => !NON_ABOUT.test(s.title));
    const description = about ? about.lines.join("\n\n") : "";
    const specs = parseSpecs(findSection(/technical data/i)?.lines ?? []);

    if (!description || specs.length === 0) {
        throw new Error("Could not find description/specs: page layout changed");
    }

    const details: ProductDetails = {
        badges,
        formFactors: unique(findSection(/form-?factor/i)?.lines ?? []),
        highlights: unique(findSection(/key highlights/i)?.lines ?? []),
        specs,
        useCases: unique(findSection(/use cases|applicable industries/i)?.lines ?? []),
        ...(variants ? { variants } : {}),
        ...(resources.length > 0 ? { resources } : {}),
    };

    return { tagline, description, category: badges[0] ?? null, image, details };
}

async function saveProduct(target: Target, parsed: ParsedProduct) {
    const update = {
        description: parsed.description,
        category: parsed.category,
        image: parsed.image,
        details: JSON.parse(JSON.stringify(parsed.details)), // plain JSON for Prisma's Json column
    };

    // tagline is only set on create so a hand-written one from the seed is kept
    await db.product.upsert({
        where: { slug: target.slug },
        update,
        create: {
            name: target.name,
            slug: target.slug,
            tagline: parsed.tagline,
            ...update,
        },
    });
}

export async function scrapeCavliProducts() {
    const results: { slug: string; ok: boolean; error?: string }[] = [];

    for (const target of CAVLI_TARGETS) {
        try {
            const html = await fetchHtml(`${BASE}${target.path}`);
            const parsed = parseProductPage(html, target.name);
            await saveProduct(target, parsed);
            results.push({ slug: target.slug, ok: true });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error(`scrape failed for ${target.slug}:`, message);
            results.push({ slug: target.slug, ok: false, error: message });
        }
        await sleep(600); // be polite: one request at a time
    }

    return {
        total: results.length,
        saved: results.filter((r) => r.ok).length,
        failed: results.filter((r) => !r.ok).length,
        results,
    };
}