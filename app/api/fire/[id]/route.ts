import { NextRequest, NextResponse } from "next/server";
import { sensors } from "@/lib/fireStore";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const sensor = sensors.find((s) => s.id === Number(params.id));
  if (!sensor) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(sensor);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const index = sensors.findIndex((s) => s.id === Number(params.id));
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  sensors[index] = { ...sensors[index], ...body, lastUpdate: new Date().toISOString() };
  return NextResponse.json({ message: "Updated", data: sensors[index] });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const index = sensors.findIndex((s) => s.id === Number(params.id));
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const deleted = sensors.splice(index, 1);
  return NextResponse.json({ message: "Deleted", data: deleted[0] });
}
