import { NextResponse, type NextRequest } from "next/server"

const DEVICE_ID_COOKIE_NAME = "benah_device_id"

export function middleware(request: NextRequest) {
  const existingDeviceId = request.cookies.get(DEVICE_ID_COOKIE_NAME)?.value

  if (existingDeviceId) {
    return NextResponse.next()
  }

  const deviceId = crypto.randomUUID()
  const requestHeaders = new Headers(request.headers)
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
