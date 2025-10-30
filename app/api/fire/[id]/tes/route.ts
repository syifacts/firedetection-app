// pages/api/fire/[id]/tes.ts

import type { NextApiRequest, NextApiResponse } from "next";

// ganti baseUrl dan path sesuai endpoint HTTP-in Node-RED kamu
const nodeRedBaseUrl = "http://127.0.0.1:1880"; // atau IP Node-RED server-mu

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "Sensor id is required" });
  }

  // Endpoint di Node-RED di mana uji smoke (test) diproses:
  const nodeRedUrl = `${nodeRedBaseUrl}/smoke-${id}-test`;

  try {
    const fetchRes = await fetch(nodeRedUrl, { method: "POST" });
    const data = await fetchRes.text();
    return res.status(200).json({ ok: true, data });
  } catch (error) {
    return res.status(500).json({ error: "Failed to trigger device", details: error });
  }
}
