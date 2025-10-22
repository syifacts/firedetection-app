import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-[#E53935] shadow-sm px-6 py-3 flex justify-between items-center h-25">
      <h1 className="text-xl font-bold text-white">Fire Detection System</h1>
      <div className="flex items-center gap-4">
        <Bell className="text-white" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
          <span className="font-semibold text-white">SuperAdmin</span>
        </div>
      </div>
    </header>
  );
}
