import StatusBadge from "./StatusBadge";

export interface FireSensor {
  id: number;
  room: string;
  floor: string;        // tambahkan jika ingin filter floor
  type: "smoke" | "heat" | "bell" | "breaking";  // tambahkan bell & breaking
  status: "offline" | "online" | "fire";
  temperature?: number;
  lastUpdate: string;
}

export default function MonitoringTable({ data }: { data: FireSensor[] }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="font-semibold text-lg mb-3">Smoke Detector</h2>
      <table className="w-full text-sm text-center border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">No.</th>
            <th className="p-2 border">Room</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((sensor, i) => (
            <tr key={sensor.id}>
              <td className="border p-2">{i + 1}</td>
              <td className="border p-2">{sensor.room}</td>
              <td className="border p-2">
                <StatusBadge status={sensor.status} />
              </td>
              <td className="border p-2">
                <button className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition">
                  Adjust
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
