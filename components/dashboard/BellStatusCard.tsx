'use client';
import { useEffect, useState } from 'react';

interface Props {
  title: string;
}

export default function BellStatusCard({ title }: Props) {
  const [alarmStatus, setAlarmStatus] = useState(false);

  // Ambil status alarm dari API
  useEffect(() => {
    const fetchStatus = async () => {
      const res = await fetch('/api/alarm');
      const data = await res.json();
      setAlarmStatus(data.alarm);
    };

    fetchStatus();

    // Optional: polling tiap 2 detik agar live update
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const value = alarmStatus ? 'ON' : 'OFF';
  const valueColor = alarmStatus ? 'text-green-600' : 'text-red-500';

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
      <h2 className="font-semibold text-lg mb-2 text-center">{title}</h2>
      <p className={`text-4xl font-extrabold ${valueColor}`}>{value}</p>
      <p className="text-sm text-gray-500 mt-1">Status</p>
    </div>
  );
}
