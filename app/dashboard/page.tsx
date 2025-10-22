"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import FireAlert from "@/components/dashboard/FireAlert";
import MonitoringTable from "@/components/dashboard/MonitoringTable";
import SensorChart from "@/components/dashboard/SensorChart";
import StatusCard from "@/components/dashboard/StatusCard";
import { Search } from "lucide-react";
import HeatDetectorTable from "@/components/dashboard/HeatDetectorTable"; 


interface FireSensor {
  id: number;
  room: string;
  floor: string;
  type: "smoke" | "heat" | "bell" | "breaking";
  status: "offline" | "online" | "fire";
  value?: number;
  lastUpdate: string;
}

export default function DashboardPage() {
  const [sensors, setSensors] = useState<FireSensor[]>([]);
  const [filters, setFilters] = useState({ floor: "all", status: "all" });
  const [searchQuery, setSearchQuery] = useState("");

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

  // Hitung summary
  const smokeCount = sensors.filter((s) => s.type === "smoke").length;
  const heatCount = sensors.filter((s) => s.type === "heat").length;
  const bellCount = sensors.filter((s) => s.type === "bell").length;
  const roomsCount = Array.from(new Set(sensors.map((s) => s.room))).length;

  // Filtering + search
  const filteredSensors = sensors.filter((s) => {
    const matchFloor = filters.floor === "all" || s.floor === filters.floor;
    const matchStatus = filters.status === "all" || s.status === filters.status;
    const matchSearch = s.room.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFloor && matchStatus && matchSearch;
  });

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6 space-y-8">
          {/* System Status + Fire Alert */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* System Status */}
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
                      <h3 className="font-extrabold text-3xl text-gray-800">
                        {item.count}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Fire Alert */}
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
     {/* 🔍 Search Input - Full Width */}
    <div className="relative flex-1 min-w-[200px]">
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={18}
      />
      <input
        type="text"
        placeholder="Search Rooms..."
        className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
              <div className="flex gap-2">
                <select
                  value={filters.floor}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, floor: e.target.value }))
                  }
                  className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                  <option value="all">All Floors</option>
                  <option value="floor 1">Floor 1</option>
                  <option value="floor 2">Floor 2</option>
                  <option value="floor 3">Floor 3</option>
                </select>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, status: e.target.value }))
                  }
                  className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
{/* 🌡️ Heat Detector Table */}
<div className="mt-6">
  <HeatDetectorTable
    data={filteredSensors
      .filter((s) => s.type === "heat")
      .map((s) => ({
        id: s.id,
        room: s.room,
        temperature: s.value ?? 0, // pakai value sebagai suhu
        test:
          s.status === "fire"
            ? "hot"
            : s.status === "offline"
            ? "offline"
            : "normal", // konversi status FireSensor → HeatSensor
      }))}
  />
</div>


          {/* Sensor Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SensorChart sensors={sensors} />
            <StatusCard title="Heat Sensor Overall" value="50°C" status="Temperature" />
            <StatusCard title="Bell & Sirene" value="ON" status="Status" />
          </div>
        </main>
      </div>
    </div>
  );
}
