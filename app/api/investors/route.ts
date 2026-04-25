import { NextRequest, NextResponse } from "next/server";
import { createInvestor, getInvestors } from "@/lib/platform-repository";
import { InvestorPayload } from "@/lib/types";

export async function GET() {
  try {
    const investors = await getInvestors();
    return NextResponse.json({ data: investors });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load investors.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as InvestorPayload;
    const investor = await createInvestor(payload);
    return NextResponse.json({ data: investor }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create investor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
