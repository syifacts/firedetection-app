// app/api/fire/[id]/tes/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Sensor id is required" }, { status: 400 });
  }

  const nodeRedBaseUrl = "http://127.0.0.1:1880";
  const nodeRedUrl = `${nodeRedBaseUrl}/smoke-${id}-test`;

  try {
    const fetchRes = await fetch(nodeRedUrl, { method: "POST" });
    const data = await fetchRes.text();
    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to trigger device", details: error },
      { status: 500 }
    );
  }
}
