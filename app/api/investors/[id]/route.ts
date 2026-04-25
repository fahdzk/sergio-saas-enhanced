import { NextRequest, NextResponse } from "next/server";
import { deleteInvestor, updateInvestor } from "@/lib/platform-repository";
import { InvestorPayload } from "@/lib/types";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const payload = (await request.json()) as Partial<InvestorPayload>;
    const investor = await updateInvestor(id, payload);
    return NextResponse.json({ data: investor });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update investor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await deleteInvestor(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete investor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
