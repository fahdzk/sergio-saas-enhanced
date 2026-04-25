import { NextRequest, NextResponse } from "next/server";
import { deleteListing, updateListing } from "@/lib/platform-repository";
import { ListingPayload } from "@/lib/types";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const payload = (await request.json()) as Partial<ListingPayload>;
    const listing = await updateListing(id, payload);
    return NextResponse.json({ data: listing });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update listing.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await deleteListing(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete listing.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
