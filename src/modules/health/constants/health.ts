import type { HealthServiceName } from "@/modules/health/types/health"

export const HEALTH_SERVICE_NAMES = [
  "database",
  "redis",
  "cloudinary",
  "smtp",
] as const satisfies readonly HealthServiceName[]

/**
 * Service kritikal membuat aplikasi tidak dapat melayani request sama sekali,
 * sedangkan service non-kritikal hanya melumpuhkan sebagian fitur.
 */
export const CRITICAL_HEALTH_SERVICES: readonly HealthServiceName[] = [
  "database",
  "redis",
]

export const HEALTH_CHECK_TIMEOUT_MS: Record<HealthServiceName, number> = {
  database: 5_000,
  redis: 5_000,
  cloudinary: 8_000,
  smtp: 8_000,
}

export const HEALTH_ERROR_MESSAGE_MAX_LENGTH = 200
