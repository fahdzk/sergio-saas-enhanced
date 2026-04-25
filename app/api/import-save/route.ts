import { NextRequest, NextResponse } from "next/server";
import { appendImportLog } from "@/lib/import-store";
import { saveToTwenty } from "@/lib/twenty";

export async function POST(request: NextRequest) {
  const payload = (await request.json().catch(() => ({}))) as {
    type?: "Property" | "Lead";
    data?: {
      title?: string;
      description?: string;
      price?: string | null;
      images?: string[];
      url?: string;
      source?: string;
    };
  };

  if (!payload.type || !payload.data?.title || !payload.data.url) {
    return NextResponse.json({ error: "A preview result and type are required before saving." }, { status: 400 });
  }

  const normalized = {
    title: payload.data.title,
    description: payload.data.description ?? "",
    price: payload.data.price ?? null,
    images: payload.data.images ?? [],
    url: payload.data.url
  };
  const result = await saveToTwenty({ type: payload.type, data: normalized });

  await appendImportLog({
    id: crypto.randomUUID(),
    url: normalized.url,
    type: payload.type,
    status: result.saved ? "saved" : "previewed",
    source: payload.data.source ?? "unknown",
    message: result.reason,
    createdAt: new Date().toISOString()
  });

  return NextResponse.json(result);
}
