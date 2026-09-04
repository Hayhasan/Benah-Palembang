import { NextResponse, type NextRequest } from "next/server"

import { REQUEST_PATH_HEADER } from "@/lib/constants/request-headers"

const DEVICE_ID_COOKIE_NAME = "benah_device_id"

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)

  // Dipakai guard auth untuk menyusun `?from=` saat mengarahkan ke login.
  requestHeaders.set(
    REQUEST_PATH_HEADER,
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  )

  const existingDeviceId = request.cookies.get(DEVICE_ID_COOKIE_NAME)?.value

  if (existingDeviceId) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  const deviceId = crypto.randomUUID()
  requestHeaders.set("x-device-id", deviceId)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  response.cookies.set({
    name: DEVICE_ID_COOKIE_NAME,
    value: deviceId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 365 * 24 * 60 * 60, // 1 year
  })

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
}
