interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  dark?: boolean
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
}: SectionHeadingProps) {
  const eyebrowColor = dark ? "text-palembang-gold" : "text-palembang-red"
  const lineBg = dark ? "bg-palembang-gold" : "bg-palembang-red"

  return (
    <div className={`flex flex-col gap-4 ${dark ? "text-white" : ""}`}>
      <p
        className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] ${eyebrowColor}`}
      >
        <span className={`h-px w-8 ${lineBg}`} />
        {eyebrow}
      </p>
      <h2 className="font-display text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description ? (
        <p
          className={`max-w-lg text-sm leading-7 ${dark ? "text-white/60" : "opacity-75"}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
