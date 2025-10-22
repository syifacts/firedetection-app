interface Props {
  title: string;
  value: string;
  status?: "Normal" | "Warning" | "Danger"; // sekarang optional
}

export default function StatusCard({ title, value, status }: Props) {
  // Warna stack bar
  const colors = {
    Normal: ["bg-green-500", 33],
    Warning: ["bg-yellow-300", 66],
    Danger: ["bg-red-500", 100],
  };

  const [color, width] = status ? colors[status] : ["", 0];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-between">
      {/* Judul */}
      <h2 className="font-semibold text-lg mb-2 text-center">{title}</h2>

      {/* Value */}
      <p className="text-4xl font-extrabold text-gray-800">{value}</p>

      {/* Status teks */}
      {status && <p className="text-sm text-gray-500 mb-4">{status}</p>}

      {/* Status Bar */}
      {status && (
        <>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative">
            {/* Background hijau tetap */}
            <div className="absolute left-0 top-0 h-4 w-1/3 bg-green-500" />
            {/* Tambahan bar kuning/merah sesuai status */}
            <div
              className={`${color} h-4`}
              style={{ width: `${width}%` }}
            />
          </div>

          {/* Label bawah bar */}
          <div className="flex justify-between text-xs text-gray-500 w-full mt-1">
            <span>Normal</span>
            <span>Warning</span>
            <span>Danger</span>
          </div>
        </>
      )}
    </div>
  );
}
