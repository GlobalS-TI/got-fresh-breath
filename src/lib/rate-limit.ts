import { headers } from 'next/headers'

// Rate limiting en memoria, por proceso — suficiente para un solo servidor (como corre GFB hoy
// vía Docker Compose). Se resetea si el proceso reinicia; si en el futuro se corre en múltiples
// instancias, migrar a un backend compartido (Redis/Upstash) sin cambiar la interfaz de `checkRateLimit`.
const buckets = new Map<string, { count: number; resetAt: number }>()

// Limpieza periódica para no acumular entradas viejas indefinidamente en memoria.
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key)
  }
}

export async function getClientIp(): Promise<string> {
  const headersList = await headers()
  const forwardedFor = headersList.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  return headersList.get('x-real-ip') || 'unknown'
}

type RateLimitResult = { allowed: true } | { allowed: false; error: string }

// `action` namespacea el bucket (ej. "login", "leads") para que límites de una acción no
// consuman el cupo de otra, aunque vengan de la misma IP.
export async function checkRateLimit(
  action: string,
  maxRequests: number,
  windowMs: number,
): Promise<RateLimitResult> {
  cleanup()

  const ip = await getClientIp()
  const key = `${action}:${ip}`
  const now = Date.now()

  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true }
  }

  if (bucket.count >= maxRequests) {
    const waitSeconds = Math.ceil((bucket.resetAt - now) / 1000)
    return { allowed: false, error: `Demasiados intentos. Intenta de nuevo en ${waitSeconds} segundos.` }
  }

  bucket.count += 1
  return { allowed: true }
}
