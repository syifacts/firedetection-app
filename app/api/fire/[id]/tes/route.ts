// app/api/fire/[id]/tes/route.ts

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: "Sensor id is required" }), { status: 400 });
  }

  const nodeRedBaseUrl = "http://127.0.0.1:1880";
  const nodeRedUrl = `${nodeRedBaseUrl}/smoke-${id}-test`;

  try {
    const fetchRes = await fetch(nodeRedUrl, { method: "POST" });
    const data = await fetchRes.text();
    return new Response(JSON.stringify({ ok: true, data }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to trigger device", details: error }), {
      status: 500,
    });
  }
}
