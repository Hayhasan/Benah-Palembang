export type HealthServiceName = "database" | "redis" | "cloudinary" | "smtp"

export type HealthServiceStatus = "healthy" | "unhealthy"

export type HealthOverallStatus = "healthy" | "degraded" | "unhealthy"

export interface HealthCheckOutcome {
  service: HealthServiceName
  status: HealthServiceStatus
  critical: boolean
  latencyMs: number
  detail: string | null
  error: string | null
}

export interface HealthServiceDto {
  status: HealthServiceStatus
  critical: boolean
  latencyMs: number
  detail: string | null
  error: string | null
}

export interface HealthSummaryDto {
  total: number
  healthy: number
  unhealthy: number
}

export interface HealthReportDto {
  status: HealthOverallStatus
  healthy: boolean
  timestamp: string
  durationMs: number
  summary: HealthSummaryDto
  services: Record<HealthServiceName, HealthServiceDto>
}
