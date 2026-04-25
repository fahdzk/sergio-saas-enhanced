import { NextRequest, NextResponse } from "next/server";
import { createVendor, getVendors } from "@/lib/platform-repository";
import { VendorPayload } from "@/lib/types";

export async function GET() {
  try {
    const vendors = await getVendors();
    return NextResponse.json({ data: vendors });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load vendors.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as VendorPayload;
    const vendor = await createVendor(payload);
    return NextResponse.json({ data: vendor }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create vendor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
