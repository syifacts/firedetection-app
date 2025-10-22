export interface FireSensor {
  id: number;
  room: string;
  type: "smoke" | "heat";
  status: "offline" | "online" | "fire";
  temperature?: number;
  lastUpdate: string;
}

export const sensors: FireSensor[] = [
  { id: 1, room: "Front Office", type: "heat", status: "online", temperature: 30, lastUpdate: new Date().toISOString() },
  { id: 2, room: "Back Office", type: "smoke", status: "offline", lastUpdate: new Date().toISOString() },
];
