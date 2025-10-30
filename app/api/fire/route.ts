// import { NextRequest, NextResponse } from "next/server";
// import { sensors, FireSensor } from "@/lib/fireStore";

// // GET semua sensor
// export async function GET() {
//   return NextResponse.json(sensors);
// }

// // POST tambah sensor baru
// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const newSensor: FireSensor = {
//     id: Date.now(),
//     room: body.room || "Unknown",
//     floor: body.floor,
//     type: body.type || "smoke",
//     status: body.status || "normal",
//     temperature: body.temperature || 0,
//     lastUpdate: new Date().toISOString(),
//   };
//   sensors.push(newSensor);
//   return NextResponse.json({ message: "Sensor added", data: newSensor }, { status: 201 });
// }


// import { NextRequest, NextResponse } from "next/server";

// // Definisi tipe data sensor
// interface FireSensor {
//   id: number;
//   room: string;
//   floor: number;
//   type: "smoke" | "bell" | "heat" | string;
//   status: "online" | "fire" | "offline" | "hot" | "normal" | string;
//   temperature: number;
//   lastUpdate: string;
// }

// // Simpan data sensor sementara di memory
// const sensors: FireSensor[] = [];

// // GET semua sensor
// export async function GET() {
//   return NextResponse.json(sensors);
// }

// // POST tambah atau update sensor
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
    

//     // Cek apakah sensor sudah ada
//     const existingSensor = sensors.find(
//       (s) => s.room === body.room && s.floor === body.floor && s.type === body.type
//     );

//     if (existingSensor) {
//       // Update data
// // Update data sensor
// if ('status' in body) existingSensor.status = body.status;
// if ('temperature' in body) existingSensor.temperature = body.temperature;
// existingSensor.lastUpdate = new Date().toISOString();

//       existingSensor.lastUpdate = new Date().toISOString();

//       return NextResponse.json(
//         { message: "Sensor updated", data: existingSensor },
//         { status: 200 }
//       );
//     }

//     // Tambah sensor baru
//     const newSensor: FireSensor = {
//       id: Date.now(),
//       room: body.room || "Unknown",
//       floor: body.floor || 0,
//       type: body.type || "smoke",
//       status: body.status || "online",
//       temperature: body.temperature || 0,
//       lastUpdate: new Date().toISOString(),
//     };

//     sensors.push(newSensor);

//     return NextResponse.json(
//       { message: "Sensor added", data: newSensor },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json({ error: "Invalid request" }, { status: 400 });
//   }
// }
// export async function DELETE(req: NextRequest) {
//   try {
//     const removed: FireSensor[] = [];

//     // Hapus semua sensor dengan room "Unknown"
//     for (let i = sensors.length - 1; i >= 0; i--) {
//       if (sensors[i].room === "Unknown") {
//         removed.push(sensors[i]);
//         sensors.splice(i, 1); // hapus dari array
//       }
//     }

//     return NextResponse.json({
//       message: "Deleted Unknown sensors",
//       deleted: removed.length,
//       data: removed
//     }, { status: 200 });

//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Failed to delete Unknown sensors" }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
const DATA_PATH = './sensors.json';

// Definisi tipe data sensor
interface FireSensor {
  id: number;
  room: string;
  floor: number;
  type: "smoke" | "bell" | "heat" | string;
  status: "online" | "fire" | "offline" | "hot" | "normal" | string;
  temperature: number;
  lastUpdate: string;
}

// Load data dari file saat server start
let sensors: FireSensor[] = [];
try {
  sensors = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
} catch (_err) {
  sensors = [];
}

// Helper untuk update ke file jika sensors berubah
function saveSensorsToFile() {
  fs.writeFileSync(DATA_PATH, JSON.stringify(sensors, null, 2));
}

// GET semua sensor
export async function GET() {
//  return NextResponse.json(sensors);
 try {
    const sensors = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
    return NextResponse.json(sensors);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

// POST tambah atau update sensor
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Cek apakah sensor sudah ada
    const existingSensor = sensors.find(
      (s) => s.room === body.room && s.floor === body.floor && s.type === body.type
    );

    if (existingSensor) {
      if ('status' in body) existingSensor.status = body.status;
      if ('temperature' in body) existingSensor.temperature = body.temperature;
      existingSensor.lastUpdate = new Date().toISOString();
      saveSensorsToFile();
      return NextResponse.json(
        { message: "Sensor updated", data: existingSensor },
        { status: 200 }
      );
    }

    // Tambah sensor baru
    const newSensor: FireSensor = {
      id: Date.now(),
      room: body.room || "Unknown",
      floor: body.floor || 0,
      type: body.type || "smoke",
      status: body.status || "online",
      temperature: body.temperature || 0,
      lastUpdate: new Date().toISOString(),
    };

    sensors.push(newSensor);
    saveSensorsToFile();

    return NextResponse.json(
      { message: "Sensor added", data: newSensor },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest) {
  try {
    const removed: FireSensor[] = [];

    // Hapus semua sensor dengan room "Unknown"
    for (let i = sensors.length - 1; i >= 0; i--) {
      if (sensors[i].room === "Unknown") {
        removed.push(sensors[i]);
        sensors.splice(i, 1);
      }
    }

    saveSensorsToFile();

    return NextResponse.json({
      message: "Deleted Unknown sensors",
      deleted: removed.length,
      data: removed
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete Unknown sensors" }, { status: 500 });
  }
}
