'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

// 👇 Definisikan interface untuk FireSensor
interface FireSensor {
  id: number;
  room: string;
  floor: number;
  type: "smoke" | "bell" | "heat" | string;
  status: "online" | "fire" | "offline" | "hot" | "normal" | string;
  temperature: number;
  lastUpdate: string;
}

export default function FireAlert() {
  const [fireDetected, setFireDetected] = useState(false);
  const [alarmOn, setAlarmOn] = useState(false);

  // Ambil status alarm dari API /api/fire (filter type: "bell")
  useEffect(() => {
    const fetchAlarmStatus = async () => {
      try {
        const res = await fetch('/api/fire', { cache: 'no-store' });
        const data: FireSensor[] = await res.json();  // 👈 gunakan tipe FireSensor[]
        
        // Filter sensor tipe bell untuk room tertentu
        const bellSensor = data.find(
          (s) => s.type === "bell" && s.room === "Ruang Basa"  // 👈 tidak pakai any lagi
        );
        
        if (bellSensor) {
          const isActive = bellSensor.status === "fire";
          setAlarmOn(isActive);
          setFireDetected(isActive);
        }
      } catch (err) {
        console.error("Error fetching alarm status:", err);
      }
    };

    fetchAlarmStatus();
    
    // Polling setiap 5 detik untuk update real-time
    const interval = setInterval(fetchAlarmStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleAlarm = async () => {
    const newStatus = !alarmOn;
    setAlarmOn(newStatus);
    setFireDetected(newStatus);

    // Kirim payload yang benar ke /api/fire
    await fetch('/api/fire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room: "Ruang Basa",
        floor: 1,
        type: "bell",
        status: newStatus ? "fire" : "online",
        temperature: 0
      }),
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
