type Crawl4AiResponse = {
  results?: Crawl4AiResult[];
  result?: Crawl4AiResult | Crawl4AiResult[];
  markdown?: string;
  html?: string;
  cleaned_html?: string;
  metadata?: Record<string, unknown>;
  media?: {
    images?: Array<string | { src?: string; url?: string }>;
  };
};

type Crawl4AiResult = {
  url?: string;
  markdown?: string;
  html?: string;
  cleaned_html?: string;
  metadata?: Record<string, unknown>;
  media?: {
    images?: Array<string | { src?: string; url?: string }>;
  };
};

export type NormalizedCrawlResult = {
  url?: string;
  title: string;
  description: string;
  markdown: string;
  price: string | null;
  images: string[];
  source: "crawl4ai";
};

export async function crawlWithCrawl4Ai(url: string): Promise<NormalizedCrawlResult | null> {
  const baseUrl = process.env.CRAWL4AI_BASE_URL;

  if (!baseUrl) {
    return null;
  }

  const response = await fetch(new URL("/crawl", baseUrl).toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.CRAWL4AI_API_TOKEN ? { Authorization: `Bearer ${process.env.CRAWL4AI_API_TOKEN}` } : {})
    },
    body: JSON.stringify({
      urls: [url],
      browser_config: {
        type: "BrowserConfig",
        params: {
          headless: true
        }
      },
      crawler_config: {
        type: "CrawlerRunConfig",
        params: {
          stream: false,
          cache_mode: "bypass"
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Crawl4AI returned ${response.status}`);
  }

  const payload = (await response.json()) as Crawl4AiResponse;
  const rawResult = Array.isArray(payload.results)
    ? payload.results[0]
    : Array.isArray(payload.result)
      ? payload.result[0]
      : payload.result ?? payload;

  const markdown = rawResult.markdown ?? "";
  const html = rawResult.cleaned_html ?? rawResult.html ?? "";
  const metadata = rawResult.metadata ?? {};
  const title = stringFromMetadata(metadata, ["title", "og:title"]) || firstMarkdownHeading(markdown) || "Untitled page";
  const description =
    stringFromMetadata(metadata, ["description", "og:description"]) || markdown.replace(/\s+/g, " ").slice(0, 220);
  const price = `${markdown}\n${html}`.match(/\$[\d,]+(?:\.\d{2})?/)?.[0] ?? null;
  const images = normalizeImages(rawResult.media?.images).slice(0, 8);

  return {
    url,
    title,
    description,
    markdown,
    price,
    images,
    source: "crawl4ai"
  };
}

function stringFromMetadata(metadata: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = metadata[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function firstMarkdownHeading(markdown: string) {
  return markdown
    .split("\n")
    .find((line) => line.startsWith("# "))
    ?.replace(/^#\s+/, "")
    .trim();
}

function normalizeImages(images: Array<string | { src?: string; url?: string }> | undefined) {
  if (!images) return [];

  return images
    .map((image) => (typeof image === "string" ? image : image.src ?? image.url ?? ""))
    .filter(Boolean);
}
