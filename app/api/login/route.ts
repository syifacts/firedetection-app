import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // login statis
  const validEmail = "admin@firedetec.com";
  const validPassword = "12345";

  if (email === validEmail && password === validPassword) {
    // bisa kembalikan token dummy
    return NextResponse.json({ success: true, token: "dummy-token" });
  } else {
    return NextResponse.json(
      { success: false, message: "Email atau password salah" },
      { status: 401 }
    );
  }
}
