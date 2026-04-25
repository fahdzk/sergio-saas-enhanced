import fs from "node:fs/promises";
import path from "node:path";

export type ImportLog = {
  id: string;
  url: string;
  type: "Property" | "Lead";
  status: "previewed" | "saved" | "failed";
  source: string;
  message: string;
  createdAt: string;
};

const dataDir =
  process.env.VERCEL === "1" ? "/tmp/sergio-saas-data" : path.join(process.cwd(), "data");
const logPath = path.join(dataDir, "scraping-logs.json");

export async function appendImportLog(log: ImportLog) {
  await fs.mkdir(dataDir, { recursive: true });
  const existing = await readImportLogs();
  existing.unshift(log);
  await fs.writeFile(logPath, JSON.stringify(existing.slice(0, 100), null, 2));
}

export async function readImportLogs(): Promise<ImportLog[]> {
  try {
    return JSON.parse(await fs.readFile(logPath, "utf8")) as ImportLog[];
  } catch {
    return [];
  }
}
