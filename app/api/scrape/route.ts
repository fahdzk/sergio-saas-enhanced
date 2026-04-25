import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { crawlWithCrawl4Ai } from "@/lib/crawl4ai";

const blockedHosts = ["facebook.com", "instagram.com", "linkedin.com", "zillow.com", "redfin.com", "realtor.com"];

export async function POST(request: NextRequest) {
  const { url } = (await request.json().catch(() => ({}))) as { url?: string };

  if (!url) {
    return NextResponse.json({ error: "A public webpage URL is required." }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return NextResponse.json({ error: "Enter a valid URL." }, { status: 400 });
  }

  if (!["http:", "https:"].includes(target.protocol)) {
    return NextResponse.json({ error: "Only HTTP and HTTPS pages are supported." }, { status: 400 });
  }

  if (blockedHosts.some((host) => target.hostname.includes(host))) {
    return NextResponse.json({ error: "This platform is restricted. Use public, permitted pages only." }, { status: 403 });
  }

  const allowed = await isRobotsAllowed(target);
  if (!allowed) {
    return NextResponse.json({ error: "robots.txt does not allow this page to be inspected." }, { status: 403 });
  }

  try {
    const crawl4AiResult = await crawlWithCrawl4Ai(target.toString());
    if (crawl4AiResult) {
      return NextResponse.json(crawl4AiResult);
    }
  } catch (error) {
    console.error("Crawl4AI failed, falling back to basic extractor", error);
  }

  const response = await fetch(target.toString(), {
    headers: {
      "User-Agent": "SergiosRealEstateBot/0.1 (+public lead research; respects robots.txt)"
    },
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    return NextResponse.json({ error: "The public page could not be fetched." }, { status: 502 });
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const title = $("meta[property='og:title']").attr("content") || $("title").first().text().trim();
  const description =
    $("meta[name='description']").attr("content") ||
    $("meta[property='og:description']").attr("content") ||
    $("p").first().text().trim();
  const priceMatch = html.match(/\$[\d,]+(?:\.\d{2})?/);
  const images = new Set<string>();

  $("meta[property='og:image'], img").each((_, element) => {
    const raw = $(element).attr("content") || $(element).attr("src");
    if (!raw) return;
    try {
      images.add(new URL(raw, target).toString());
    } catch {
      // Ignore malformed image references.
    }
  });

  return NextResponse.json({
    title,
    description,
    price: priceMatch?.[0] ?? null,
    images: Array.from(images).slice(0, 8),
    source: "basic"
  });
}

async function isRobotsAllowed(target: URL) {
  const robotsUrl = new URL("/robots.txt", target.origin);

  try {
    const response = await fetch(robotsUrl, { next: { revalidate: 3600 } });
    if (!response.ok) return true;

    const robots = await response.text();
    const path = target.pathname || "/";
    const lines = robots.split(/\r?\n/).map((line) => line.trim());
    let appliesToAll = false;

    for (const line of lines) {
      const normalized = line.toLowerCase();
      if (normalized.startsWith("user-agent:")) {
        appliesToAll = normalized.replace("user-agent:", "").trim() === "*";
      }
      if (appliesToAll && normalized.startsWith("disallow:")) {
        const rule = line.replace(/disallow:/i, "").trim();
        if (rule && path.startsWith(rule)) return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}
