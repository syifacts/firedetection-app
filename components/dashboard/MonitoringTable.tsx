"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  value?: number;
}

const statusOptions = ["offline", "online", "fire", "hot"];

export default function MonitoringTable({
  data,
  onUpdate,
}: {
  data: FireSensor[];
  onUpdate?: () => void;
}) {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [editSensor, setEditSensor] = useState<FireSensor | null>(null);
  const [editValues, setEditValues] = useState<Partial<FireSensor>>({});

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(startIdx, startIdx + rowsPerPage);

  const handleChange = (field: keyof FireSensor, value: string) => {
    setEditValues((vals) => ({ ...vals, [field]: value }));
  };

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  const openEdit = (sensor: FireSensor) => {
    setEditSensor(sensor);
    setEditValues({
      room: sensor.room,
      floor: sensor.floor,
      status: sensor.status,
    });
  };

  const closeEdit = () => {
    setEditSensor(null);
    setEditValues({});
  };

  const saveEdit = async () => {
    if (!editSensor) return;

    await fetch(`/api/fire/${editSensor.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room: editValues.room ?? editSensor.room,
        floor: editValues.floor ?? editSensor.floor,
        status: editValues.status ?? editSensor.status,
        type: editSensor.type,
        temperature: editSensor.temperature,
        lastUpdate: new Date().toISOString(),
      }),
    });

    closeEdit();
    if (onUpdate) onUpdate();
  };

  const testSensor = async (sensorId: number) => {
    await fetch(`/api/fire/${sensorId}/test`, {
      method: "POST",
    });
    if (onUpdate) onUpdate();
  };

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-red-50 rounded-2xl shadow-lg p-6 border border-gray-100 relative">
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
              <th className="p-3 border-b border-white/30">Actions</th>
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
                  className={
                    i % 2 === 0
                      ? "bg-white hover:bg-red-100"
                      : "bg-red-50 hover:bg-white/50"
                  }
                >
                  <td className="border-b border-white/30 p-3 text-gray-900 font-medium">
                    {startIdx + i + 1}
                  </td>
                  <td className="border-b border-white/30 p-3 font-semibold text-gray-900">
                    {sensor.room}
                  </td>
                  <td className="border-b border-white/30 p-3 text-gray-900">
                    {sensor.floor}
                  </td>
                  <td className="border-b border-white/30 p-3">
                    <StatusBadge status={sensor.status} />
                  </td>
                  <td className="border-b border-white/30 p-3 flex justify-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.96 }}
                      className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => openEdit(sensor)}
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.96 }}
                      className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600"
                      onClick={() => testSensor(sensor.id)}
                    >
                      Test
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
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Popup Edit */}
      <AnimatePresence>
        {editSensor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Edit Sensor #{editSensor.id}
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Room
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={editValues.room ?? ""}
                    onChange={(e) => handleChange("room", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Floor
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={editValues.floor ?? ""}
                    onChange={(e) => handleChange("floor", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    className="w-full border rounded p-2"
                    value={editValues.status ?? ""}
                    onChange={(e) => handleChange("status", e.target.value)}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={closeEdit}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
