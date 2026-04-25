import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

const blockedHosts = ["facebook.com", "instagram.com", "linkedin.com", "zillow.com", "redfin.com", "realtor.com"];

type ScrapedContact = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  sourceUrl: string;
};

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
  const contacts = extractContacts(html, target.toString());

  return NextResponse.json({
    source: target.toString(),
    count: contacts.length,
    data: contacts
  });
}

function extractContacts(html: string, sourceUrl: string): ScrapedContact[] {
  const $ = cheerio.load(html);
  const text = $("body").text().replace(/\s+/g, " ").trim();
  const emailMatches = [...new Set(text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [])];
  const phoneMatches = [...new Set(text.match(/(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}/g) ?? [])];

  const personNames = [
    ...new Set(
      text.match(/\b([A-Z][a-z]+)\s+([A-Z][a-z]+)\b/g)?.filter((full) => {
        const lowered = full.toLowerCase();
        return !["real estate", "for sale", "for rent", "utah realestate", "listing agent"].includes(lowered);
      }) ?? []
    )
  ].slice(0, 30);

  const addresses = [
    ...new Set(
      text.match(/\d{1,6}\s+[A-Za-z0-9.#\s-]{3,},\s*[A-Za-z.\s-]+,\s*[A-Z]{2}\s*\d{5}(?:-\d{4})?/g) ?? []
    )
  ];

  const maxRows = Math.max(emailMatches.length, phoneMatches.length, personNames.length, 1);
  const rows: ScrapedContact[] = [];

  for (let index = 0; index < maxRows; index += 1) {
    const name = personNames[index] ?? "";
    const [firstName = "", lastName = ""] = name.split(/\s+/, 2);
    rows.push({
      firstName,
      lastName,
      email: emailMatches[index] ?? "",
      phone: phoneMatches[index] ?? "",
      address: addresses[index] ?? "",
      sourceUrl
    });
  }

  return rows.filter((item) => item.email || item.phone || item.firstName || item.address).slice(0, 500);
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
