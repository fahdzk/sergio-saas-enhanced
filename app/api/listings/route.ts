import { NextRequest, NextResponse } from "next/server";
import { createListing, getListings } from "@/lib/platform-repository";
import { ListingPayload } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get("type");
    const listings = await getListings(type === "sale" || type === "rent" ? type : undefined);
    return NextResponse.json({ data: listings });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load listings.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as ListingPayload;
    const listing = await createListing(payload);
    return NextResponse.json({ data: listing }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create listing.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
