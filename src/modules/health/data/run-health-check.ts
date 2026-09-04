import "server-only"

import { checkCloudinary } from "@/modules/health/data/check-cloudinary"
import { checkDatabase } from "@/modules/health/data/check-database"
import { checkRedis } from "@/modules/health/data/check-redis"
import { checkSmtp } from "@/modules/health/data/check-smtp"
import {
  toHealthErrorMessage,
  toHealthReport,
} from "@/modules/health/data/health.mapper"
import { withTimeout } from "@/modules/health/data/with-timeout"
import {
  CRITICAL_HEALTH_SERVICES,
  HEALTH_CHECK_TIMEOUT_MS,
  HEALTH_SERVICE_NAMES,
} from "@/modules/health/constants/health"
import type {
  HealthCheckOutcome,
  HealthReportDto,
  HealthServiceName,
} from "@/modules/health/types/health"

const HEALTH_CHECKERS: Record<HealthServiceName, () => Promise<string>> = {
  database: checkDatabase,
  redis: checkRedis,
  cloudinary: checkCloudinary,
  smtp: checkSmtp,
}

async function runServiceCheck(
  service: HealthServiceName,
): Promise<HealthCheckOutcome> {
  const critical = CRITICAL_HEALTH_SERVICES.includes(service)
  const startedAt = Date.now()

  try {
    const detail = await withTimeout(
      HEALTH_CHECKERS[service](),
      HEALTH_CHECK_TIMEOUT_MS[service],
      service,
    )

    return {
      service,
      status: "healthy",
      critical,
      latencyMs: Date.now() - startedAt,
      detail,
      error: null,
    }
  } catch (error) {
    console.error(`Health check ${service} gagal:`, error)

    return {
      service,
      status: "unhealthy",
      critical,
      latencyMs: Date.now() - startedAt,
      detail: null,
      error: toHealthErrorMessage(error),
    }
  }
}

/**
 * Menjalankan seluruh pemeriksaan service secara paralel. Setiap checker sudah
 * menangkap error sendiri sehingga satu service yang mati tidak membatalkan
 * pemeriksaan service lainnya.
 */
export async function runHealthCheck(): Promise<HealthReportDto> {
  const startedAt = Date.now()
  const outcomes = await Promise.all(HEALTH_SERVICE_NAMES.map(runServiceCheck))

  return toHealthReport(outcomes, Date.now() - startedAt)
}
