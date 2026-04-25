import { NextResponse } from "next/server";
import { getCampaigns } from "@/lib/platform-repository";

export async function GET() {
  try {
    const campaigns = await getCampaigns();
    return NextResponse.json({ data: campaigns });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load campaigns.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
