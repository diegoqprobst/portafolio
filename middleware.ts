import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

export const runtime = "nodejs";

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-change-me");

const PUBLIC = ["/admin/login", "/api/auth/login"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (!isAdminRoute) return NextResponse.next();
  if (PUBLIC.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const token = req.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.redirect(new URL("/admin/login", req.url));

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
