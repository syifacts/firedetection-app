'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function FireAlert() {
  const [fireDetected, setFireDetected] = useState(false);
  const [alarmOn, setAlarmOn] = useState(false);

  const toggleAlarm = () => {
    const newStatus = !alarmOn;
    setAlarmOn(newStatus);
    setFireDetected(newStatus); // 🔥 nyalakan api kalau alarm aktif
  };

  return (
<div
  className={`w-full rounded-2xl shadow-md p-10 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
    fireDetected ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
  }`}
>

  {/* Status Icon dan Text */}
  <div className="flex flex-col items-center">
    {fireDetected ? (
      <>
        <AlertTriangle size={48} className="mb-2" />
        <h2 className="text-2xl font-bold">🔥 Fire Detected!</h2>
      </>
    ) : (
      <>
        <CheckCircle size={48} className="mb-2" />
        <h2 className="text-2xl font-bold">✅ Safe</h2>
      </>
    )}
  </div>

  {/* Tombol Alarm */}
  <button
    onClick={toggleAlarm}
    className={`px-5 py-2 rounded-md font-semibold transition-all ${
      alarmOn
        ? 'bg-white text-red-600 hover:bg-gray-200'
        : 'bg-white text-green-700 hover:bg-gray-200'
    }`}
  >
    {alarmOn ? 'Matikan Alarm' : 'Nyalakan Alarm'}
  </button>

  {/* Keterangan status */}
  <p className="text-sm mt-1">
    Status Alarm: <span className="font-semibold">{alarmOn ? 'Nyala' : 'Mati'}</span>
  </p>
</div>

  );
}
