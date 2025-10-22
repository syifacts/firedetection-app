interface Props {
  icon: string;
  label: string;
  value: number;
}

export default function SummaryCard({ icon, label, value }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
      <div className="text-3xl">{icon}</div>
      <p className="font-semibold">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
