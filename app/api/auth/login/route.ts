import { NextRequest, NextResponse } from "next/server";
import { checkPassword, signToken, COOKIE, TTL } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const adminEmail = process.env.ADMIN_EMAIL ?? "";
  if (email !== adminEmail || !(await checkPassword(password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signToken(email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: TTL,
    path: "/",
  });
  return res;
}
