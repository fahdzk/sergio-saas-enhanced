import { NextRequest, NextResponse } from "next/server";
import { deleteClientRecord, updateClientRecord } from "@/lib/platform-repository";
import { ClientPayload } from "@/lib/types";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const payload = (await request.json()) as Partial<ClientPayload>;
    const client = await updateClientRecord(id, payload);
    return NextResponse.json({ data: client });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update client.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await deleteClientRecord(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete client.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
