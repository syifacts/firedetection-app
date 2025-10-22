export interface FireSensor {
  id: number;
  floor: string;
  room: string;
  type: "smoke" | "heat";
  status: "offline" | "online" | "fire" | "hot";
  temperature?: number;
  lastUpdate: string;
  value?: number;
}
export const sensors: FireSensor[] = [
  { id: 1, room: "Front Office", floor:"Floor 1", type: "heat", status: "online", temperature: 30, lastUpdate: new Date().toISOString() },
  { id: 2, room: "Back Office", floor:"Floor 2", type: "smoke", status: "online", value: 120, lastUpdate: new Date().toISOString() },
  { id: 3, room: "Warehouse", floor:"Floor 3", type: "heat", status: "fire", temperature: 60, lastUpdate: new Date().toISOString() },
  { id: 4, room: "R123", floor:"Floor 1", type: "heat", status: "hot", temperature: 45, lastUpdate: new Date().toISOString() },
  { id: 5, room: "R223", floor:"Floor 2", type: "heat", status: "offline", lastUpdate: new Date().toISOString() },
  { id: 6, room: "R221", floor:"Floor 2", type: "smoke", status: "online", value: 80, lastUpdate: new Date().toISOString() },

];
