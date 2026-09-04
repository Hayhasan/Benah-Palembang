import "server-only"

import { HEALTH_ERROR_MESSAGE_MAX_LENGTH } from "@/modules/health/constants/health"
import type {
  HealthCheckOutcome,
  HealthReportDto,
  HealthServiceDto,
  HealthServiceName,
} from "@/modules/health/types/health"

const SECRET_ENVIRONMENT_KEYS = [
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "DATABASE_URL",
  "DIRECT_URL",
  "SMTP_APP_PASSWORD",
  "UPSTASH_REDIS_REST_TOKEN",
] as const

function redactSecrets(message: string) {
  return SECRET_ENVIRONMENT_KEYS.reduce((current, key) => {
    const value = process.env[key]?.trim()
    if (!value || value.length < 8) return current
    return current.split(value).join("***")
  }, message)
}

export function toHealthErrorMessage(error: unknown) {
  const rawMessage =
    error instanceof Error ? error.message : "Pemeriksaan service gagal."
  const message = redactSecrets(rawMessage.replace(/\s+/g, " ").trim())

  return message.length > HEALTH_ERROR_MESSAGE_MAX_LENGTH
    ? `${message.slice(0, HEALTH_ERROR_MESSAGE_MAX_LENGTH)}…`
    : message
}

export function toHealthReport(
  outcomes: HealthCheckOutcome[],
  durationMs: number,
): HealthReportDto {
  const services = {} as Record<HealthServiceName, HealthServiceDto>

  for (const outcome of outcomes) {
    services[outcome.service] = {
      status: outcome.status,
      critical: outcome.critical,
      latencyMs: outcome.latencyMs,
      detail: outcome.detail,
      error: outcome.error,
    }
  }

  const unhealthy = outcomes.filter((outcome) => outcome.status === "unhealthy")
  const hasCriticalFailure = unhealthy.some((outcome) => outcome.critical)

  const status =
    unhealthy.length === 0
      ? "healthy"
      : hasCriticalFailure
        ? "unhealthy"
        : "degraded"

  return {
    status,
    healthy: status === "healthy",
    timestamp: new Date().toISOString(),
    durationMs,
    summary: {
      total: outcomes.length,
      healthy: outcomes.length - unhealthy.length,
      unhealthy: unhealthy.length,
    },
    services,
  }
}
