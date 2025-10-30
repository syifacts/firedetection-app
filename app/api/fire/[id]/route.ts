import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
const DATA_PATH = './sensors.json';

interface FireSensor {
  id: number;
  room: string;
  floor: number;
  type: string;
  status: string;
  temperature: number;
  lastUpdate: string;
}

// Helper: load sensors from file (fresh each request, biar pasti up to date)
function loadSensors(): FireSensor[] {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  } catch {
    return [];
  }
}
// Helper: simpan sensors ke file
function saveSensors(sensors: FireSensor[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(sensors, null, 2));
}

// GET sensor by id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const sensors = loadSensors();
  const sensor = sensors.find((s) => s.id === Number(params.id));
  if (!sensor) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(sensor);
}

// PUT sensor by id (update by id)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const sensors = loadSensors();
  const index = sensors.findIndex((s) => s.id === Number(params.id));
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  sensors[index] = { ...sensors[index], ...body, lastUpdate: new Date().toISOString() };
  saveSensors(sensors);
  return NextResponse.json({ message: "Updated", data: sensors[index] });
}

// DELETE sensor by id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const sensors = loadSensors();
  const index = sensors.findIndex((s) => s.id === Number(params.id));
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const deleted = sensors.splice(index, 1);
  saveSensors(sensors);
  return NextResponse.json({ message: "Deleted", data: deleted[0] });
}
