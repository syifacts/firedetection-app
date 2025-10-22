import { NextRequest, NextResponse } from "next/server";
import { sensors, FireSensor } from "@/lib/fireStore";

// GET semua sensor
export async function GET() {
  return NextResponse.json(sensors);
}

// POST tambah sensor baru
export async function POST(req: NextRequest) {
  const body = await req.json();
  const newSensor: FireSensor = {
    id: Date.now(),
    room: body.room || "Unknown",
    type: body.type || "smoke",
    status: body.status || "normal",
    temperature: body.temperature || 0,
    lastUpdate: new Date().toISOString(),
  };
  sensors.push(newSensor);
  return NextResponse.json({ message: "Sensor added", data: newSensor }, { status: 201 });
}
