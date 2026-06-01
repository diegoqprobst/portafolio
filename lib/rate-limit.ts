import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Rate limiting distribuido para el login admin, respaldado por Upstash Redis
// (provisto vía la integración Upstash de Vercel, o Vercel KV).
//
// Diseño "degrade gracefully": si las env vars del store NO están configuradas,
// getLimiter() devuelve null y NO limitamos (fail-open). Esto permite que el
// deploy funcione antes de conectar el store; en cuanto se agregan las vars en
// Vercel, el rate-limit se activa solo. Se loggea una advertencia para no
// dejarlo desactivado por accidente en producción.
//
// Acepta tanto los nombres de Vercel KV (KV_REST_API_*) como los de Upstash
// directo (UPSTASH_REDIS_REST_*), según cómo quede la integración.

let cached: Ratelimit | null | undefined;

function getLimiter(): Ratelimit | null {
  if (cached !== undefined) return cached;

  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[rate-limit] Upstash/KV no configurado — el login NO está rate-limited. " +
          "Configura KV_REST_API_URL y KV_REST_API_TOKEN en Vercel."
      );
    }
    cached = null;
    return cached;
  }

  const redis = new Redis({ url, token });
  cached = new Ratelimit({
    redis,
    // 5 intentos por ventana deslizante de 15 minutos, por IP.
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    prefix: "rl:login",
    analytics: false,
  });
  return cached;
}

export type RateLimitResult = { ok: boolean; retryAfter?: number };

export async function checkLoginRateLimit(identifier: string): Promise<RateLimitResult> {
  const limiter = getLimiter();
  if (!limiter) return { ok: true }; // no configurado → permitir

  try {
    const { success, reset } = await limiter.limit(identifier);
    if (success) return { ok: true };
    const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
    return { ok: false, retryAfter };
  } catch (e) {
    // Si Redis falla, no bloqueamos el login (fail-open) pero lo registramos.
    console.error("[rate-limit] error consultando el store:", e);
    return { ok: true };
  }
}
