import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

// Required env vars. Lanzar al cargar el módulo en lugar de usar un fallback
// inseguro permite que un mal deploy falle ruidosamente en vez de aceptar
// tokens forjados con un secreto público.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 16) {
  throw new Error(
    "JWT_SECRET is required and must be at least 16 characters. " +
      "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\""
  );
}

const secret = new TextEncoder().encode(JWT_SECRET);
const COOKIE = "admin_token";
const TTL = 60 * 60 * 24; // 24 hours

export async function signToken(email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
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
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    // Si falta el hash, fallamos en vez de hacer compare contra "" silenciosamente.
    throw new Error("ADMIN_PASSWORD_HASH is not set");
  }
  return bcrypt.compare(plain, hash);
}

export { COOKIE, TTL };
