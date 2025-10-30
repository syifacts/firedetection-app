"use client";

import Image from "next/image";
import {ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [username, setUsername] = useState("AdminFire");
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const nama = localStorage.getItem("username");
    if (nama) setUsername(nama);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Ambil inisial dari username
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word: string) => word[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 2);
};

  return (
    <header className="bg-[#E53935] shadow-sm px-6 py-3 flex justify-between items-center h-25 relative">
      {/* Logo + Title */}
      <div className="flex items-center gap-3 ml-10">
        <Image
          src="/logokampus.png"
          alt="Logo Kampus"
          width={60}
          height={60}
          className="object-contain"
          priority
        />
        <h1 className="ml-5 text-xl font-bold text-white">Fire Detection System</h1>
      </div>

      {/* Notification + User */}
      <div className="flex items-center gap-4 relative mr-10">
        {/* <Bell className="text-white" /> */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => setShowMenu(!showMenu)}
        >
          {/* Profile avatar dengan inisial */}
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-800">
            {getInitials(username)}
          </div>
          <span className="font-semibold text-white">{username}</span>
          <ChevronDown className="text-white w-4 h-4" />
        </div>

        {/* Dropdown menu */}
        {showMenu && (
          <div className="absolute right-0 top-12 bg-white shadow-md rounded-md py-2 w-32 text-sm z-50">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
