const INSTAGRAM_SHORTCODE_PATTERN = /^[A-Za-z0-9_-]{1,64}$/

export async function GET(
  _request: Request,
  context: { params: Promise<{ shortcode: string }> },
) {
  const { shortcode } = await context.params

  if (!INSTAGRAM_SHORTCODE_PATTERN.test(shortcode)) {
    return new Response(null, { status: 404 })
  }

  try {
    const response = await fetch(
      `https://www.instagram.com/p/${shortcode}/media/?size=l`,
      {
        headers: {
          Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
          "User-Agent":
            "Mozilla/5.0 (compatible; BenahPalembangPreview/1.0)",
        },
        next: { revalidate: 21_600 },
        redirect: "follow",
        signal: AbortSignal.timeout(5_000),
      },
    )
    const contentType = response.headers
      .get("content-type")
      ?.split(";", 1)[0]
      .trim()
      .toLowerCase()

    if (!response.ok || !contentType?.startsWith("image/") || !response.body) {
      return new Response(null, { status: 404 })
    }

    return new Response(response.body, {
      headers: {
        "Cache-Control":
          "public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400",
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch {
    return new Response(null, { status: 404 })
  }
}
