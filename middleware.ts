import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Blokir akses ke root path "/"
  if (request.nextUrl.pathname === "/") {
    // Cek jika sudah login (misal pakai cookie/token)
    const token = request.cookies.get("token")?.value;

    // Jika belum login, redirect ke halaman login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Jika sudah login, redirect ke dashboard atau halaman lain
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow request (lewati saja) selain "/"  
  return NextResponse.next();
}

// Jalankan middleware hanya di root path
export const config = {
  matcher: ["/"], // hanya aktif untuk root ("/")
};
