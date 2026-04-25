import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dataDir = path.join(root, "data");
const scrapePath = path.join(dataDir, "sergio-profile-scrape.json");
const scrape = JSON.parse(await fs.readFile(scrapePath, "utf8"));
const markdown = scrape.markdown || "";
const lines = markdown
  .split(/\r?\n/)
  .map((line) => line.replace(/\s+/g, " ").trim())
  .filter(Boolean);

const profile = {
  name: inferName(lines),
  sourceUrl: scrape.sourceUrl,
  title: scrape.title,
  description: scrape.description,
  photoCandidates: extractImages(scrape.media),
  importedAt: new Date().toISOString()
};

const sales = extractSales(lines);

await fs.writeFile(path.join(dataDir, "sergio-admin-profile.json"), JSON.stringify(profile, null, 2));
await fs.writeFile(path.join(dataDir, "sergio-sales.csv"), toCsv(sales));

console.log(`Saved data/sergio-admin-profile.json`);
console.log(`Saved data/sergio-sales.csv with ${sales.length} extracted sale rows`);

function inferName(lines) {
  const candidate = lines.find((line) => /sergio/i.test(line) && line.length < 80);
  return candidate || "Sergio";
}

function extractImages(media) {
  const images = media?.images || [];
  return images
    .map((image) => (typeof image === "string" ? image : image.src || image.url || ""))
    .filter(Boolean)
    .slice(0, 12);
}

function extractSales(sourceLines) {
  const rows = [];
  let currentYear = "";

  for (let index = 0; index < sourceLines.length; index += 1) {
    const line = sourceLines[index];
    const yearMatch = line.match(/^(20\d{2})\s*\((\d+)\s+Sales?\)/i);
    if (yearMatch) {
      currentYear = yearMatch[1];
      continue;
    }

    if (!/\bSOLD\b/i.test(line)) {
      continue;
    }

    const window = sourceLines.slice(Math.max(0, index - 5), Math.min(sourceLines.length, index + 5));
    const role = window.find((item) => /Listing Agent|Buyer'?s Agent/i.test(item)) || "";
    const soldDate = window.find((item) => /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i.test(item)) || "";
    const address =
      window.find((item) => /\bUT\b|\bUtah\b|\d{5}/i.test(item) && !/SOLD/i.test(item) && item !== soldDate) || "";
    const street =
      [...window]
        .reverse()
        .find((item) => /\d+\s+\w+/i.test(item) && !/\d{5}/.test(item) && !/SOLD/i.test(item)) || "";

    rows.push({
      year: currentYear,
      role,
      street,
      location: address,
      soldDate,
      source: "UtahRealEstate public roster"
    });
  }

  return rows;
}

function toCsv(rows) {
  const headers = ["year", "role", "street", "location", "soldDate", "source"];
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvCell(row[header] || "")).join(","))
  ].join("\n");
}

function csvCell(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}
