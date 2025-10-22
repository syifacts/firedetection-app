"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface FireSensor {
  id: number;
  room: string;
  floor: string;
  type: "smoke" | "heat" | "bell" | "breaking";
  status: "offline" | "online" | "fire" | "hot";
  temperature?: number;
  lastUpdate: string;
}

export default function MonitoringTable({ data }: { data: FireSensor[] }) {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(startIdx, startIdx + rowsPerPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-red-50 rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-2xl text-gray-800 flex items-center gap-2">
          🚨 Smoke Detector
        </h2>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Rows per page:</label>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="p-1.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            {[10, 20, 30].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
  <table className="w-full text-center text-sm border-collapse">
<thead className="bg-red-500/40 text-black uppercase text-xs tracking-wider backdrop-blur-sm">
  <tr>
    <th className="p-3 border-b border-white/30">No.</th>
    <th className="p-3 border-b border-white/30">Room</th>
    <th className="p-3 border-b border-white/30">Floor</th>
    <th className="p-3 border-b border-white/30">Status</th>
    <th className="p-3 border-b border-white/30">Action</th>
  </tr>
</thead>


    <tbody>
      {paginatedData.length === 0 ? (
        <tr>
          <td colSpan={5} className="py-6 text-gray-500 italic">
            No smoke detector data found.
          </td>
        </tr>
      ) : (
        paginatedData.map((sensor, i) => (
          <motion.tr
            key={sensor.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className={`transition-all duration-300 rounded-lg ${
              // sensor.status === "fire"
              //   ? "bg-red-300/50 hover:bg-red-200/50"
              //    : sensor.status === "hot"
              //   ?"bg-yellow-300/50 hover:bg-yellow-200/50"
              //   : sensor.status === "offline"
              //   ? "bg-gray-300/50 hover:bg-gray-200/50"
              //   : sensor.status === "online"
              //   ? "bg-green-300/50 hover:bg-green-400/50"
              //   : i % 2 === 0
              //   ? "bg-white/30 hover:bg-white/50"
              //   : "bg-white/20 hover:bg-white/40"
                i % 2 === 0
    ? "bg-white hover:bg-red-100"
    : "bg-red-50 hover:bg-white/50"
            }`}
          >
            <td className="border-b border-white/30 p-3 text-gray-900 font-medium">
              {startIdx + i + 1}
            </td>
            <td className="border-b border-white/30 p-3 font-semibold text-gray-900">{sensor.room}</td>
            <td className="border-b border-white/30 p-3 text-gray-900">{sensor.floor}</td>
            <td className="border-b border-white/30 p-3">
              <StatusBadge status={sensor.status} />
            </td>
            <td className="border-b border-white/30 p-3">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                className="px-4 py-1.5 rounded-md bg-red-500 text-white shadow hover:shadow-md hover:bg-red-600 transition"
              >
                Adjust
              </motion.button>
            </td>
          </motion.tr>
        ))
      )}
    </tbody>
  </table>
      </div>

      {/* Pagination Controls */}
      {data.length > 0 && (
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <p>
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {startIdx + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-800">
              {Math.min(startIdx + rowsPerPage, data.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">{data.length}</span>{" "}
            entries
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md border text-gray-700 hover:bg-gray-100 transition ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md border text-gray-700 hover:bg-gray-100 transition ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
