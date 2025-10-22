'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function FireAlert() {
  const [fireDetected, setFireDetected] = useState(false);
  const [alarmOn, setAlarmOn] = useState(false);

  // Ambil status alarm dari API saat mount
  useEffect(() => {
    fetch('/api/alarm')
      .then(res => res.json())
      .then(data => {
        setAlarmOn(data.alarm);
        setFireDetected(data.alarm);
      });
  }, []);

  const toggleAlarm = async () => {
    const newStatus = !alarmOn;
    setAlarmOn(newStatus);
    setFireDetected(newStatus);

    // Update status alarm di API
    await fetch('/api/alarm', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alarm: newStatus }),
    });
  };

  return (
    <div
      className={`w-full rounded-2xl shadow-md p-10 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
        fireDetected ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
      }`}
    >
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

      <p className="text-sm mt-1">
        Status Alarm: <span className="font-semibold">{alarmOn ? 'Nyala' : 'Mati'}</span>
      </p>
    </div>
  );
}
