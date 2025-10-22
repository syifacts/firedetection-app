"use client";

import StatusBadge from "./StatusBadge";

export interface HeatSensor {
  id: number;
  room: string;
  temperature: number;
  test: "offline" | "normal" | "hot" | "fire";
}

export default function HeatDetectorTable({ data }: { data: HeatSensor[] }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="font-semibold text-lg mb-3">Heat Detector</h2>

      <table className="w-full text-sm text-center border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">No.</th>
            <th className="p-2 border">Room</th>
            <th className="p-2 border">Temp (°C)</th>
            <th className="p-2 border">Test</th>
          </tr>
        </thead>
        <tbody>
          {data.map((sensor, i) => (
            <tr key={sensor.id}>
              <td className="border p-2">{i + 1}</td>
              <td className="border p-2">{sensor.room}</td>
              <td className="border p-2">{sensor.temperature}</td>
              <td className="border p-2">
                <StatusBadge status={sensor.test} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
