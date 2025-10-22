"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import FireAlert from "@/components/dashboard/FireAlert";
import MonitoringTable from "@/components/dashboard/MonitoringTable";
import SensorChart from "@/components/dashboard/SensorChart";
import StatusCard from "@/components/dashboard/StatusCard";
import HeatDetectorTable from "@/components/dashboard/HeatDetectorTable";
import { Search } from "lucide-react";

interface FireSensor {
  id: number;
  room: string;
  floor: string;
  type: "smoke" | "heat" | "bell" | "breaking";
  status: "offline" | "online" | "fire" | "hot";
  value?: number;
  lastUpdate: string;
  temperature?: number;
}

interface HeatSensorData {
  id: number;
  room: string;
  floor: string;
  type: "smoke" | "heat" | "bell" | "breaking";
  temperature: number;
  status: "fire" | "offline" | "hot" | "normal";
}

export default function DashboardPage() {
  const [sensors, setSensors] = useState<FireSensor[]>([]);

  // Filter MonitoringTable
  const [monitorSearch, setMonitorSearch] = useState("");
  const [monitorFilters, setMonitorFilters] = useState({ floor: "all", status: "all" });

  // Filter HeatDetectorTable
  const [heatSearch, setHeatSearch] = useState("");
  const [heatFilters, setHeatFilters] = useState({ floor: "all", status: "all" });

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const res = await fetch("/api/fire", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch sensors");
        const data = await res.json();
        setSensors(data);
      } catch (err) {
        console.error("Error fetching sensors:", err);
      }
    };

    fetchSensors();
  }, []);

  // Summary counts
  const smokeCount = sensors.filter((s) => s.type === "smoke").length;
  const heatCount = sensors.filter((s) => s.type === "heat").length;
  const bellCount = sensors.filter((s) => s.type === "bell").length;
  const roomsCount = Array.from(new Set(sensors.map((s) => s.room))).length;

  // Filtered data MonitoringTable
  const filteredSensors = sensors.filter((s) => {
    const matchFloor = monitorFilters.floor === "all" || s.floor === monitorFilters.floor;
    const matchStatus = monitorFilters.status === "all" || s.status === monitorFilters.status;
    const matchSearch = s.room.toLowerCase().includes(monitorSearch.toLowerCase());
    return matchFloor && matchStatus && matchSearch;
  });

  // Filtered data HeatDetectorTable
  const filteredHeat: HeatSensorData[] = sensors
    .filter((s) => s.type === "heat")
    .map((s): HeatSensorData => {
      const temp = s.temperature ?? 0;
      const derivedStatus =
        s.status === "fire"
          ? "fire"
          : s.status === "offline"
          ? "offline"
          : temp > 60
          ? "fire"
          : temp > 40
          ? "hot"
          : "normal";
      return {
        id: s.id,
        room: s.room,
        floor: s.floor,
        type: s.type,
        temperature: temp,
        status: derivedStatus,
      };
    })
    .filter((s) => {
      const matchFloor = heatFilters.floor === "all" || s.floor === heatFilters.floor;
      const matchStatus = heatFilters.status === "all" || s.status === heatFilters.status;
      const matchSearch = s.room.toLowerCase().includes(heatSearch.toLowerCase());
      return matchFloor && matchStatus && matchSearch;
    });
// Hitung rata-rata temperatur sensor heat
const getAverageHeatTemperature = () => {
  const temps = sensors
    .filter((s) => s.type === "heat" && s.temperature !== undefined)
    .map((s) => s.temperature!);
  if (temps.length === 0) return 0;
  const sum = temps.reduce((acc, t) => acc + t, 0);
  return sum / temps.length;
};

// Tentukan status berdasarkan rata-rata temperatur
const getHeatTemperatureStatus = (avgTemp: number): "Normal" | "Warning" | "Danger" => {
  if (avgTemp >= 55) return "Danger";
  if (avgTemp >= 40) return "Warning";
  return "Normal";
};

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6 space-y-8">
  {/* Hero / Dashboard Title + Blob */}
  <div className="relative flex flex-col items-center justify-center mb-6">
     {/* Blob 1 - kiri atas */}
  <motion.div
    className="absolute top-0 left-0 w-50 h-40 rounded-full filter blur-3xl opacity-60"
    style={{
      background: "linear-gradient(135deg, #FF5F6D, #FFC371)",
    }}
    animate={{
      x: [0, 40, -20, 0],
      y: [0, 20, -10, 0],
      scale: [1, 1.2, 0.9, 1],
      rotate: [0, 15, -10, 0],
      backgroundPosition: ["0% 0%", "50% 50%", "100% 100%", "0% 0%"], // untuk efek gradient bergerak
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    }}
  />

  {/* Blob 2 - kanan bawah */}
  <motion.div
    className="absolute bottom-0 right-0 w-45 h-50 rounded-full filter blur-3xl opacity-50"
    style={{
background: "linear-gradient(135deg, #FFD54F, #FFB300)"
    }}
    animate={{
      x: [0, -25, 15, 0],
      y: [0, -20, 10, 0],
      scale: [1, 1.15, 0.9, 1],
      rotate: [0, 25, -15, 0],
      backgroundPosition: ["0% 0%", "50% 50%", "100% 100%", "0% 0%"],
    }}
    transition={{
      duration: 12,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    }}
  />
   
    <motion.h1
      className="relative text-4xl font-bold text-gray-800 text-center z-10 mt-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      🏢 Fire Monitoring Dashboard
    </motion.h1>
    <motion.p
      className="relative mt-2 text-gray-600 z-10 text-center mb-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      Real-time monitoring for smoke, heat, and alert systems
    </motion.p>
  </div>
          {/* System Status + Fire Alert */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="md:col-span-3 bg-white rounded-2xl shadow-md p-6 ml-10 mt-8 border border-gray-100"
            >
              <h2 className="font-semibold text-xl mb-5 text-gray-800 flex items-center gap-2 mb-10">
                🔧 System Status
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Rooms", count: roomsCount, icon: "🏠", color: "blue" },
                  { label: "Smoke Detector", count: smokeCount, icon: "🔥", color: "red" },
                  { label: "Heat Detector", count: heatCount, icon: "🌡️", color: "yellow" },
                  { label: "Bell", count: bellCount, icon: "🔔", color: "green" },
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ scale: 1.05, y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-lg"
                  >
                    <div className="flex items-center mb-2">
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded-full mr-3 bg-${item.color}-100`}
                      >
                        <span className="text-2xl">{item.icon}</span>
                      </div>
                      <h3 className="font-extrabold text-3xl text-gray-800">{item.count}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-2 flex justify-center items-start ml-10 mt-8 mr-10"
            >
              <FireAlert />
            </motion.div>
          </div>

          {/* Monitoring Table */}
          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="mb-4 flex flex-wrap justify-between items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={monitorSearch}
                  onChange={(e) => setMonitorSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={monitorFilters.floor}
                  onChange={(e) => setMonitorFilters((f) => ({ ...f, floor: e.target.value }))}
                  className="p-2.5 border border-gray-200 rounded-lg bg-white hover:border-gray-300 text-gray-700 focus:ring-2 focus:ring-red-400 focus:outline-none"
                >
                  <option value="all">All Floors</option>
                  <option value="Floor 1">Floor 1</option>
                  <option value="Floor 2">Floor 2</option>
                  <option value="Floor 3">Floor 3</option>
                </select>
                <select
                  value={monitorFilters.status}
                  onChange={(e) => setMonitorFilters((f) => ({ ...f, status: e.target.value }))}
                  className="p-2.5 border border-gray-200 rounded-lg bg-white hover:border-gray-300 text-gray-700 focus:ring-2 focus:ring-red-400 focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="online">Online</option>
                  <option value="fire">Fire</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>
            <MonitoringTable data={filteredSensors} />
          </div>

          {/* Heat Detector Table */}
          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 mt-6">
            <div className="mb-4 flex flex-wrap justify-between items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={heatSearch}
                  onChange={(e) => setHeatSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={heatFilters.floor}
                  onChange={(e) => setHeatFilters((f) => ({ ...f, floor: e.target.value }))}
                  className="p-2.5 border border-gray-200 rounded-lg bg-white hover:border-gray-300 text-gray-700 focus:ring-2 focus:ring-red-400 focus:outline-none"
                >
                  <option value="all">All Floors</option>
                  <option value="Floor 1">Floor 1</option>
                  <option value="Floor 2">Floor 2</option>
                  <option value="Floor 3">Floor 3</option>
                </select>
                <select
                  value={heatFilters.status}
                  onChange={(e) => setHeatFilters((f) => ({ ...f, status: e.target.value }))}
                  className="p-2.5 border border-gray-200 rounded-lg bg-white hover:border-gray-300 text-gray-700 focus:ring-2 focus:ring-red-400 focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="normal">Normal</option>
                  <option value="hot">Hot</option>
                  <option value="fire">Fire</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>
            <HeatDetectorTable data={filteredHeat} />
          </div>

         {/* Sensor Overview */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-center">
  <SensorChart sensors={sensors} />

<StatusCard
  title="Heat Sensor Overall"
  value={`${getAverageHeatTemperature().toFixed(1)}°C`}
  status={getHeatTemperatureStatus(getAverageHeatTemperature())}
/>

<StatusCard title="Bell & Sirene" value="ON" />

</div>

        </main>
      </div>
    </div>
  );
}
