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

let redis: Redis | null | undefined;
const limiters = new Map<string, Ratelimit>();

function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[rate-limit] Upstash/KV no configurado — los límites están inactivos. " +
          "Configura KV_REST_API_URL y KV_REST_API_TOKEN en Vercel."
      );
    }
    redis = null;
    return redis;
  }
  redis = new Redis({ url, token });
  return redis;
}

// Limitador con ventana deslizante, cacheado por prefijo. `window` usa la
// sintaxis de @upstash/ratelimit, p.ej. "15 m", "1 h".
function getLimiter(prefix: string, max: number, window: `${number} ${"s" | "m" | "h" | "d"}`): Ratelimit | null {
  const cached = limiters.get(prefix);
  if (cached) return cached;
  const r = getRedis();
  if (!r) return null;
  const rl = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(max, window),
    prefix,
    analytics: false,
  });
  limiters.set(prefix, rl);
  return rl;
}

export type RateLimitResult = { ok: boolean; retryAfter?: number };

async function check(
  prefix: string,
  max: number,
  window: `${number} ${"s" | "m" | "h" | "d"}`,
  identifier: string
): Promise<RateLimitResult> {
  const limiter = getLimiter(prefix, max, window);
  if (!limiter) return { ok: true }; // no configurado → permitir (fail-open)
  try {
    const { success, reset } = await limiter.limit(identifier);
    if (success) return { ok: true };
    return { ok: false, retryAfter: Math.max(1, Math.ceil((reset - Date.now()) / 1000)) };
  } catch (e) {
    console.error(`[rate-limit:${prefix}] error consultando el store:`, e);
    return { ok: true }; // fail-open ante fallo de infra
  }
}

// Login admin: 5 intentos / 15 min por IP.
export function checkLoginRateLimit(identifier: string): Promise<RateLimitResult> {
  return check("rl:login", 5, "15 m", identifier);
}

// Formularios públicos (contacto / lead magnet): 8 envíos / hora por IP.
export function checkPublicFormRateLimit(identifier: string): Promise<RateLimitResult> {
  return check("rl:form", 8, "1 h", identifier);
}
