export default function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    offline: "bg-gray-400",
    online: "bg-green-500",
    fire: "bg-red-600",
    normal: "bg-blue-500",  // 🔵 baru
    hot: "bg-yellow-500",   // 🟡 baru
  };

  return (
    <span
      className={`text-white text-xs font-semibold px-3 py-1 rounded-full ${
        colorMap[status] || "bg-gray-400"
      }`}
    >
      {status.toUpperCase()}
    </span>
  );
}
