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
        <table className="w-full text-sm text-center border-collapse">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 uppercase text-xs tracking-wider">
            <tr>
              <th className="p-3 border">No.</th>
              <th className="p-3 border">Room</th>
              <th className="p-3 border">Floor</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Action</th>
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
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`transition-all duration-300 ${
                    sensor.status === "fire"
                      ? "bg-red-100 hover:bg-red-200"
                      : sensor.status === "offline"
                      ? "bg-gray-100 hover:bg-gray-200"
                      : sensor.status === "online"
                      ? "bg-green-50 hover:bg-green-100"
                      : i % 2 === 0
                      ? "bg-white hover:bg-gray-50"
                      : "bg-[#FEF6F6] hover:bg-red-50"
                  }`}
                >
                  <td className="border p-3 text-gray-700 font-medium">
                    {startIdx + i + 1}
                  </td>
                  <td className="border p-3 font-semibold text-gray-900">
                    {sensor.room}
                  </td>
                  <td className="border p-3 text-gray-700">{sensor.floor}</td>
                  <td className="border p-3">
                    <StatusBadge status={sensor.status} />
                  </td>
                  <td className="border p-3">
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.96 }}
                      className="px-4 py-1.5 rounded-md bg-blue-500 text-white shadow hover:shadow-md hover:bg-blue-600 transition"
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
