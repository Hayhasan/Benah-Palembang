import { runHealthCheck } from "@/modules/health/data/run-health-check"

export const dynamic = "force-dynamic"
export const maxDuration = 30

const NO_STORE_HEADERS = { "Cache-Control": "no-store" }

/**
 * Endpoint publik read-only: hanya membaca status service dan tidak pernah
 * mengubah data, sehingga tidak memerlukan secret maupun session.
 */
export async function GET() {
  const report = await runHealthCheck()

  return Response.json(report, {
    status: report.status === "unhealthy" ? 503 : 200,
    headers: NO_STORE_HEADERS,
  })
}
