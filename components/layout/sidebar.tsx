"use client";

import { Home, Settings, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";


export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true); // toggle sidebar di mobile

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: <Home size={18} /> },
   // { label: "Log & History", href: "/logs", icon: <Clock size={18} /> },
  ];

  const bottomItems = [
    { label: "Settings", href: "/settings", icon: <Settings size={18} /> },
  ];
const router = useRouter();

const handleLogout = () => {
  localStorage.removeItem("token"); // hapus token login
  router.push("/login"); // redirect ke halaman login
};
  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md"
        onClick={() => setOpen(!open)}
      >
        <Menu size={24} />
      </button>

      <aside
        className={`fixed md:relative z-40 h-100% w-64 bg-white text-gray-600 flex flex-col p-4 transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full"} 
        shadow-lg border-r border-gray-200`}
      >
 {/* Logo */}
<div className="flex flex-col items-center mb-8">
  <div className="relative w-24 h-24"> {/* atur ukuran sesuai kebutuhan */}
    <Image
      src="/logokampus.png"
      alt="Logo"
      fill // agar mengisi parent container
      className="rounded-full object-cover" // agar bulat dan proporsional
      priority // optional: supaya cepat di-load
    />
  </div>
  {/* <h1 className="mt-2 font-semibold text-gray-800 text-center">Fire Detection</h1> */}
</div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-red-600 text-white" // tab aktif
                    : "hover:bg-red-100 text-gray-600" // tab biasa
                }`}
              >
                {item.icon} {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="mt-auto space-y-2">
          {bottomItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                  isActive ? "bg-red-600 text-white" : "hover:bg-red-100 text-gray-600"
                }`}
              >
                {item.icon} {item.label}
              </Link>
            );
          })}

         <button
  onClick={handleLogout}
  className="flex items-center gap-3 p-2 hover:bg-red-100 rounded-md w-full text-gray-600 transition-colors"
>
  <LogOut size={18} /> Log Out
</button>

        </div>
      </aside>
    </>
  );
}
