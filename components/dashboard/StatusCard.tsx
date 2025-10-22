interface Props {
  title: string;
  value: string;
  status: string;
}

export default function StatusCard({ title, value, status }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between">
      <h2 className="font-semibold text-lg mb-2">{title}</h2>
      <p className="text-3xl font-bold text-green-700">{value}</p>
      <p className="text-sm text-gray-500">{status}</p>
    </div>
  );
}
