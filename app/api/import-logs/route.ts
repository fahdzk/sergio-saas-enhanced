import { NextResponse } from "next/server";
import { readImportLogs } from "@/lib/import-store";

export async function GET() {
  return NextResponse.json({ logs: await readImportLogs() });
}
