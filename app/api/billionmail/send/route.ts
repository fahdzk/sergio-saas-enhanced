import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const apiUrl = process.env.BILLIONMAIL_API_URL;
    const apiKey = process.env.BILLIONMAIL_API_KEY;
    const sendEndpoint = process.env.BILLIONMAIL_SEND_ENDPOINT ?? "/api/batch_mail/api/send";

    if (!apiUrl || !apiKey) {
      return NextResponse.json({ error: "BillionMail is not configured." }, { status: 400 });
    }

    const payload = (await request.json()) as {
      recipient: string;
      addresser?: string;
      subject?: string;
      body?: string;
      attribs?: Record<string, string>;
      attachments?: Array<{
        filename: string;
        contentType: string;
        data: string;
      }>;
    };

    const response = await fetch(new URL(sendEndpoint, apiUrl).toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send with BillionMail.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
