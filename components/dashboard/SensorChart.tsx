"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";


interface FireSensor {
  id: number;
  room: string;
  floor: string;
  type: "smoke" | "heat" | "bell" | "breaking";
  status: "offline" | "online" | "fire" | "hot";
  value?: number;
  lastUpdate: string;
}


interface SensorChartProps {
  sensors: FireSensor[];
}


export default function SensorChart({ sensors }: SensorChartProps) {
  const smokeSensors = sensors.filter(s => s.type === "smoke");

  const data = smokeSensors.map((s) => ({
    time: s.lastUpdate.slice(11,16),
    value: s.value ?? 0,
  }));

  const latestValue = data.length ? data[data.length-1].value : 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 h-full">
      <h2 className="font-semibold text-lg mb-3">Smoke Sensor Overall</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-3 font-semibold text-xl text-red-600">{latestValue} ppm</p>
      <p className="text-sm text-gray-600">Smoke Level</p>
    </div>
  );
}
