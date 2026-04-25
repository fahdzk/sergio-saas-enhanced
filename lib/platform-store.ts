import { promises as fs } from "fs";
import path from "path";
import { defaultCampaigns, defaultClients, defaultInvestors, defaultListings, defaultVendors } from "@/lib/platform-data";
import { CampaignTemplate, Client, Investor, Listing, Vendor } from "@/lib/types";

type PlatformStore = {
  listings: Listing[];
  clients: Client[];
  investors: Investor[];
  vendors: Vendor[];
  campaigns: CampaignTemplate[];
};

const runtimeDataDir =
  process.env.VERCEL === "1" ? "/tmp/sergio-saas-data" : path.join(process.cwd(), "data");
const storePath = path.join(runtimeDataDir, "platform-store.json");

const defaultStore: PlatformStore = {
  listings: defaultListings,
  clients: defaultClients,
  investors: defaultInvestors,
  vendors: defaultVendors,
  campaigns: defaultCampaigns
};

async function ensureStore() {
  try {
    await fs.access(storePath);
  } catch {
    await fs.mkdir(path.dirname(storePath), { recursive: true });
    await fs.writeFile(storePath, JSON.stringify(defaultStore, null, 2), "utf8");
  }
}

export async function readPlatformStore() {
  await ensureStore();
  const raw = await fs.readFile(storePath, "utf8");
  return JSON.parse(raw) as PlatformStore;
}

export async function writePlatformStore(store: PlatformStore) {
  await ensureStore();
  await fs.writeFile(storePath, JSON.stringify(store, null, 2), "utf8");
}

export function createRecordId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
