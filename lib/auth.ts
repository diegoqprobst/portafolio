import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-change-me");
const COOKIE = "admin_token";
const TTL = 60 * 60 * 24 * 7; // 7 days

export async function signToken(email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(secret);
}

export async function verifyToken(token: string): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return { email: payload.email as string };
  } catch {
    return null;
  }
}

export async function checkPassword(plain: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH ?? "";
  return bcrypt.compare(plain, hash);
}

export { COOKIE, TTL };
