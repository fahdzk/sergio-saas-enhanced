import { NextRequest, NextResponse } from "next/server";
import { deleteVendor, updateVendor } from "@/lib/platform-repository";
import { VendorPayload } from "@/lib/types";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const payload = (await request.json()) as Partial<VendorPayload>;
    const vendor = await updateVendor(id, payload);
    return NextResponse.json({ data: vendor });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update vendor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await deleteVendor(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete vendor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
