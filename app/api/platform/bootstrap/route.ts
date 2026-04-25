import { NextResponse } from "next/server";
import { seedPlatformData } from "@/lib/platform-repository";

export async function POST() {
  try {
    await seedPlatformData();
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to seed platform data.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
