import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dataDir = path.join(root, "data");
const env = await readEnv(path.join(root, ".env"));

const rosterUrl =
  env.SERGIO_ROSTER_URL || "https://www.utahrealestate.com/roster/agent.listings.report/agentid/1319245";
const crawl4aiBaseUrl = env.CRAWL4AI_BASE_URL || "http://localhost:11235";

await fs.mkdir(dataDir, { recursive: true });

const response = await fetch(new URL("/crawl", crawl4aiBaseUrl).toString(), {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    urls: [rosterUrl],
    browser_config: {
      type: "BrowserConfig",
      params: { headless: true }
    },
    crawler_config: {
      type: "CrawlerRunConfig",
      params: { stream: false, cache_mode: "bypass" }
    }
  })
});

if (!response.ok) {
  throw new Error(`Crawl4AI returned ${response.status}. Make sure Docker Desktop and Crawl4AI are running.`);
}

const payload = await response.json();
const result = Array.isArray(payload.results)
  ? payload.results[0]
  : Array.isArray(payload.result)
    ? payload.result[0]
    : payload.result ?? payload;

await fs.writeFile(
  path.join(dataDir, "sergio-profile-scrape.json"),
  JSON.stringify(
    {
      sourceUrl: rosterUrl,
      scrapedAt: new Date().toISOString(),
      title: result.metadata?.title ?? "",
      description: result.metadata?.description ?? "",
      markdown: result.markdown ?? "",
      media: result.media ?? {}
    },
    null,
    2
  )
);

console.log("Saved data/sergio-profile-scrape.json");

async function readEnv(filePath) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return Object.fromEntries(
      raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#") && line.includes("="))
        .map((line) => {
          const [key, ...value] = line.split("=");
          return [key, value.join("=").replace(/^"|"$/g, "")];
        })
    );
  } catch {
    return {};
  }
}
