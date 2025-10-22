
import { NextRequest, NextResponse } from "next/server";

let alarmState = false;

export async function GET() {
  return NextResponse.json({ alarm: alarmState });
}

export async function PUT(req: NextRequest) {
  const { alarm } = await req.json();
  alarmState = alarm;
  return NextResponse.json({ message: "Alarm updated", alarm });
}
