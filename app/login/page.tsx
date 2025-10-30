"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Image from "next/image";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      toast("Anda sudah login, redirect ke dashboard...", { duration: 3000 });
      setTimeout(() => router.replace("/dashboard"), 1000);
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("token", data.token);
        toast.success("Login berhasil!");
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        setError(data.message || "Login gagal");
      }
    } catch (_err) {
      setError("Terjadi kesalahan server");
    }
  };

  if (loading) return null;

  return (
    <>
      <Toaster position="top-center" />

      <div className="relative flex min-h-screen bg-gray-50 overflow-hidden">
        {/* Blob Animasi */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 rounded-full filter blur-3xl opacity-60"
          style={{ background: "linear-gradient(135deg, #FF5F6D, #FFD54F)" }}
          animate={{ x: [0, 40, -20, 0], y: [0, 20, -10, 0], scale: [1, 1.2, 0.9, 1] }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full filter blur-3xl opacity-50"
          style={{ background: "linear-gradient(135deg, #4CAF50, #FFFFFF)" }}
          animate={{ x: [0, -30, 15, 0], y: [0, -20, 10, 0], scale: [1, 1.1, 0.9, 1] }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />

        <div className="relative z-10 flex flex-1">
       {/* Kiri: Form Login */}
<motion.div
  className="flex-1 flex items-center justify-center p-8"
  initial={{ opacity: 0, x: -50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8 }}
>
  <motion.form
    onSubmit={handleLogin}
    className="w-full max-w-xl p-10 bg-gradient-to-br from-red-50 via-white/80 to-yellow-50
 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200 flex flex-col items-center"
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.2 }}
  >
    {/* Selamat Datang */}
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Selamat Datang!</h1>
      <p className="text-gray-600 text-lg">Silakan login untuk mengakses Fire Monitoring Dashboard 🔥</p>
    </div>

    <div className="flex items-center gap-2 mb-6">
      <Zap className="text-red-500 w-8 h-8" />
      <h2 className="text-2xl font-bold text-gray-800">Fire Monitoring Login</h2>
    </div>

    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full px-5 py-3 mb-5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 text-lg"
      required
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full px-5 py-3 mb-5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 text-lg"
      required
    />

    <button
      type="submit"
      className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-400
 text-white font-semibold rounded-xl hover:bg-red-600 transition text-lg"
    >
      Login
      
    </button>

    {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}

    <p className="mt-6 text-gray-500 text-base text-center">
      🔥 Real-time fire & smoke monitoring system
    </p>
  </motion.form>
</motion.div>


          {/* Kanan: Ilustrasi / Gambar Fire */}
<motion.div
  animate={{ y: [0, -10, 0] }}
  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
>
    <div className="w-full h-full flex items-center justify-end relative">
   <Image
  src="/fire2.png"
  alt="Fire Illustration"
fill
  style={{ objectFit: "contain" }}
  priority
/>

  </div>
</motion.div>
          
          
        </div>
      </div>
    </>
  );
}
