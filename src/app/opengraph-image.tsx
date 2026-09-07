import { ImageResponse } from "next/og"

export const runtime = "nodejs"

export const alt = "Benah Palembang - Info, Berita, Budaya & Cerita Kota Palembang"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#111215",
          backgroundImage:
            "radial-gradient(circle at 90% 15%, rgba(185, 28, 28, 0.28), transparent 45%), radial-gradient(circle at 10% 85%, rgba(185, 28, 28, 0.12), transparent 40%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#B91C1C",
              color: "#ffffff",
              padding: "8px 18px",
              borderRadius: "9999px",
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Editorial Platform
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#a1a1aa",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Palembang · Sumatera Selatan
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <h1
            style={{
              fontSize: 68,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              margin: 0,
              color: "#ffffff",
            }}
          >
            BENAH <span style={{ color: "#EF4444" }}>PALEMBANG</span>
          </h1>
          <p
            style={{
              fontSize: 24,
              lineHeight: 1.4,
              color: "#d4d4d8",
              maxWidth: "880px",
              margin: 0,
            }}
          >
            Portal Berita, Cerita Warga, Info Agenda & Kebudayaan Kota Palembang
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "24px", fontSize: 16, color: "#9ca3af" }}>
            <span>Cerita Warga</span>
            <span>·</span>
            <span>Gaya Hidup</span>
            <span>·</span>
            <span>Ruang Kota</span>
            <span>·</span>
            <span>Kebudayaan</span>
            <span>·</span>
            <span>Agenda</span>
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.05em",
            }}
          >
            benahpalembang.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
