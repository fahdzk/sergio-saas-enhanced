import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { crawlWithCrawl4Ai } from "@/lib/crawl4ai";
import { appendImportLog } from "@/lib/import-store";

const blockedHosts = ["facebook.com", "instagram.com", "linkedin.com", "zillow.com", "redfin.com", "realtor.com"];
const rateLimit = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: NextRequest) {
  const clientKey = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const allowed = checkRateLimit(clientKey);

  if (!allowed) {
    return NextResponse.json({ error: "Rate limit reached. Try again in a minute." }, { status: 429 });
  }

  const { url, type } = (await request.json().catch(() => ({}))) as {
    url?: string;
    type?: "Property" | "Lead";
  };

  if (typeof url !== "string" || !url || (type !== "Property" && type !== "Lead")) {
    return NextResponse.json({ error: "A URL and import type are required." }, { status: 400 });
  }

  const importUrl = url;
  const importType: "Property" | "Lead" = type;

  const validation = await validateTarget(importUrl);
  if ("error" in validation) {
    await log(importUrl, importType, "failed", "none", validation.error);
    return NextResponse.json({ error: validation.error }, { status: validation.status });
  }

  try {
    const crawl4AiResult = await crawlWithCrawl4Ai(validation.target.toString());
    if (crawl4AiResult) {
      await log(importUrl, importType, "previewed", "crawl4ai", "Preview extracted with Crawl4AI.");
      return NextResponse.json({ ...crawl4AiResult, importType });
    }
  } catch (error) {
    console.error("Crawl4AI preview failed, falling back to basic extractor", error);
  }

  try {
    const basic = await basicExtract(validation.target);
    await log(importUrl, importType, "previewed", "basic", "Preview extracted with basic extractor.");
    return NextResponse.json({ ...basic, importType });
  } catch {
    await log(importUrl, importType, "failed", "basic", "The page could not be inspected.");
    return NextResponse.json({ error: "The page could not be inspected." }, { status: 502 });
  }
}

async function validateTarget(url: string): Promise<{ target: URL } | { error: string; status: number }> {
  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return { error: "Enter a valid URL.", status: 400 };
  }

  if (!["http:", "https:"].includes(target.protocol)) {
    return { error: "Only HTTP and HTTPS pages are supported.", status: 400 };
  }

  if (blockedHosts.some((host) => target.hostname.includes(host))) {
    return { error: "This platform is restricted. Use public, permitted pages only.", status: 403 };
  }

  const allowed = await isRobotsAllowed(target);
  if (!allowed) {
    return { error: "robots.txt does not allow this page to be inspected.", status: 403 };
  }

  return { target };
}

async function basicExtract(target: URL) {
  const response = await fetch(target.toString(), {
    headers: { "User-Agent": "SergiosRealEstateImporter/0.1 (+public data import; respects robots.txt)" },
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error("Fetch failed");
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const title = $("meta[property='og:title']").attr("content") || $("title").first().text().trim() || "Untitled page";
  const description =
    $("meta[name='description']").attr("content") ||
    $("meta[property='og:description']").attr("content") ||
    $("p").first().text().trim();
  const price = html.match(/\$[\d,]+(?:\.\d{2})?/)?.[0] ?? null;
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

  return {
    url: target.toString(),
    title,
    description,
    price,
    images: Array.from(images).slice(0, 8),
    markdown: "",
    source: "basic"
  };
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

function checkRateLimit(key: string) {
  const now = Date.now();
  const current = rateLimit.get(key);

  if (!current || current.resetAt < now) {
    rateLimit.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (current.count >= 10) {
    return false;
  }

  current.count += 1;
  return true;
}

async function log(url: string, type: "Property" | "Lead", status: "previewed" | "failed", source: string, message: string) {
  await appendImportLog({
    id: crypto.randomUUID(),
    url,
    type,
    status,
    source,
    message,
    createdAt: new Date().toISOString()
  });
}
