import { NextRequest, NextResponse } from "next/server";
import { createClientRecord, getClients } from "@/lib/platform-repository";
import { ClientPayload } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get("type");
    const clients = await getClients(type === "buyer" || type === "renter" ? type : undefined);
    return NextResponse.json({ data: clients });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load clients.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as ClientPayload;
    const client = await createClientRecord(payload);
    return NextResponse.json({ data: client }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create client.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
