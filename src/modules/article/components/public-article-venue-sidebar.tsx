import type { PublicArticleDetailData } from "../types/public-article"

interface VenueInfo {
  name: string
  addressLines: string[]
  priceLevel: number // 1 to 5
  openDays: string
  openHours: string
  features: string[]
  contact: string
}

function resolveVenueInfo(article: PublicArticleDetailData): VenueInfo | null {
  if (article.venueName?.trim()) {
    const rawAddress = article.venueAddress?.trim() || ""
    const addressLines = rawAddress
      ? rawAddress
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)
      : []

    return {
      name: article.venueName.trim().toUpperCase(),
      addressLines: addressLines.length > 0 ? addressLines : [rawAddress || "Palembang"],
      priceLevel: Math.max(1, Math.min(5, article.venuePriceLevel ?? 1)),
      openDays: article.venueOpenDays?.trim() || "-",
      openHours: article.venueOpenHours?.trim() || "-",
      features: article.venueFeatures && article.venueFeatures.length > 0 ? article.venueFeatures : [],
      contact: article.venueContact?.trim() || "-",
    }
  }

  const lowerTitle = article.title.toLowerCase()

  // Specific mapping for known culinary / spot articles if title matches
  if (lowerTitle.includes("ayam goreng buni") || lowerTitle.includes("buni")) {
    return {
      name: "AYAM GORENG BUNI",
      addressLines: ["Jl. Sayangan No. 41,", "Ilir Timur I", "Kota Palembang"],
      priceLevel: 2,
      openDays: "Sen - Min",
      openHours: "09:00 - 21:00",
      features: ["Ayam Goreng", "Sambal Terasi", "Dine-in"],
      contact: "t. (+62) 8117892024",
    }
  }

  if (lowerTitle.includes("ayam tauco") || lowerTitle.includes("dian jaya")) {
    return {
      name: "AYAM TAUCO DIAN JAYA",
      addressLines: ["Jl. Dempo Luar No. 18,", "15 Ilir", "Kota Palembang"],
      priceLevel: 2,
      openDays: "Sel - Min",
      openHours: "10:00 - 20:30",
      features: ["Ayam Tauco", "Masakan Tradisional"],
      contact: "t. (+62) 8127384910",
    }
  }

  if (lowerTitle.includes("sate putri hanjawar") || lowerTitle.includes("hanjawar")) {
    return {
      name: "SATE PUTRI HANJAWAR",
      addressLines: ["Jl. Mayor Ruslan No. 25,", "Duku, Ilir Timur II", "Kota Palembang"],
      priceLevel: 3,
      openDays: "Sen - Min",
      openHours: "11:00 - 22:00",
      features: ["Sate Kambing", "Sop Kambing", "Area Parkir"],
      contact: "t. (+62) 8136920182",
    }
  }

  if (lowerTitle.includes("al-munawwar") || lowerTitle.includes("kampung arab")) {
    return {
      name: "KAMPUNG ARAB AL-MUNAWWAR",
      addressLines: ["Lorong Al-Haddad,", "13 Ulu, Seberang Ulu II", "Kota Palembang"],
      priceLevel: 1,
      openDays: "Sen - Min",
      openHours: "08:00 - 17:30",
      features: ["Heritage Walk", "Nasi Kebuli", "Wisata Sungai"],
      contact: "t. (+62) 8127110992",
    }
  }

  return null
}

export function PublicArticleVenueSidebar({
  article,
  className = "",
}: {
  article: PublicArticleDetailData
  className?: string
}) {
  const venue = resolveVenueInfo(article)

  if (!venue) return null

  return (
    <div
      aria-label="Spot / Establishment Information"
      className={`w-full max-w-[280px] sm:max-w-[300px] text-zinc-900 select-none ${className}`}
    >
      {/* 1. Establishment / Venue Title */}
      <div>
        <h3 className="font-sans text-base sm:text-lg font-bold tracking-tight text-black uppercase leading-snug">
          {venue.name}
        </h3>
        <div className="mt-2 mb-3 border-b border-dotted border-zinc-300 w-full" />
      </div>

      {/* 2. Address */}
      {venue.addressLines.length > 0 && (
        <div>
          <div className="font-serif text-xs sm:text-[13px] leading-relaxed text-black/85">
            {venue.addressLines.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
          <div className="mt-3 mb-3 border-b border-dotted border-zinc-300 w-full" />
        </div>
      )}

      {/* 3. PRICE */}
      <div>
        <div className="flex items-center justify-between">
          <span className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase text-black">
            PRICE
          </span>
          {/* 5 Dots Indicator */}
          <div className="flex items-center gap-1.5" aria-label={`Price level ${venue.priceLevel} of 5`}>
            {Array.from({ length: 5 }).map((_, i) => {
              const isFilled = i < venue.priceLevel
              return (
                <span
                  key={i}
                  className={`size-2.5 rounded-full transition-colors ${
                    isFilled ? "bg-black" : "bg-zinc-200"
                  }`}
                />
              )
            })}
          </div>
        </div>
        <div className="mt-3 mb-3 border-b border-dotted border-zinc-300 w-full" />
      </div>

      {/* 4. OPEN */}
      {(venue.openDays !== "-" || venue.openHours !== "-") && (
        <div>
          <span className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase text-black">
            OPEN
          </span>
          <div className="mt-1.5 mb-2 border-b border-dotted border-zinc-300 w-full" />
          <div className="flex items-center justify-between font-serif text-xs sm:text-[13px] text-black/85">
            <span>{venue.openDays}</span>
            <span>{venue.openHours}</span>
          </div>
          <div className="mt-3 mb-3 border-b border-dotted border-zinc-300 w-full" />
        </div>
      )}

      {/* 5. FEATURES */}
      {venue.features.length > 0 && (
        <div>
          <span className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase text-black">
            FEATURES
          </span>
          <div className="mt-1.5 mb-2 border-b border-dotted border-zinc-300 w-full" />
          <div className="font-serif text-xs sm:text-[13px] text-black/85 leading-relaxed space-y-0.5">
            {venue.features.map((feature, idx) => (
              <p key={idx}>{feature}</p>
            ))}
          </div>
          <div className="mt-3 mb-3 border-b border-dotted border-zinc-300 w-full" />
        </div>
      )}

      {/* 6. CONTACT */}
      {venue.contact && venue.contact !== "-" && (
        <div>
          <span className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase text-black">
            CONTACT
          </span>
          <div className="mt-1.5 mb-2 border-b border-dotted border-zinc-300 w-full" />
          <p className="font-serif text-xs sm:text-[13px] text-black/85">
            {venue.contact}
          </p>
        </div>
      )}
    </div>
  )
}
