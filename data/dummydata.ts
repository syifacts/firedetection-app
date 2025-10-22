import { FireSensor } from "@/components/dashboard/MonitoringTable";

export const fireSensors: FireSensor[] = [
  { id: 1, room: "Server Room", floor: "floor 1", type: "smoke", status: "online", value: 25, lastUpdate: "2025-10-20 16:30" },
  { id: 2, room: "Kitchen", floor: "floor 1", type: "heat", status: "online", value: 45, lastUpdate: "2025-10-20 16:31" },
  { id: 3, room: "Office 1", floor: "floor 2", type: "smoke", status: "fire", value: 70, lastUpdate: "2025-10-20 16:32" },
  { id: 4, room: "Lobby", floor: "floor 2", type: "heat", status: "offline", value: undefined, lastUpdate: "2025-10-20 16:33" },
  { id: 5, room: "Storage", floor: "floor 3", type: "smoke", status: "fire", value: 27, lastUpdate: "2025-10-20 16:34" },
];
