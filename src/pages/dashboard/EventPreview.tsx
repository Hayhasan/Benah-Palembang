import { useState } from "react"
import { useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom"
import { agendaItems, type AgendaItem } from "@/data/mockData"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, CalendarDays, Clock3, MapPin, 
  Sparkles, Share2, Ticket, Eye, Check, MessageCircle
} from "lucide-react"
import { toast } from "sonner"

const fallbackEvents: Record<string, AgendaItem> = {
  "1": {
    id: "1",
    title: "Pameran Fotografi: Warna Palembang",
    date: "15 September 2026",
    time: "10:00 - 17:00 WIB",
    location: "Gedung Kesenian Palembang, Jl. Merdeka",
    category: "Pameran",
    description: "Melihat sudut kota melalui lensa fotografer lokal Palembang dalam mengekspresikan dinamika kehidupan kota.",
    image: "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    organizer: "Komunitas Lensa Wong Kito",
  },
  "2": {
    id: "2",
    title: "Festival Kuliner Malam Ampera",
    date: "10 September 2026",
    time: "18:30 - 23:00 WIB",
    location: "Plaza Benteng Kuto Besak (BKB), Palembang",
    category: "Festival",
    description: "Nikmati lebih dari 50 jenis makanan tradisional dan fusion khas Sumatera Selatan di pinggir Sungai Musi.",
    image: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    organizer: "Dinas Pariwisata & Ekonomi Kreatif Palembang",
  },
  "3": {
    id: "3",
    title: "Workshop Menulis Cerita Kota",
    date: "28 September 2026",
    time: "09:00 - 15:00 WIB",
    location: "Ruang Kreatif Kuto Besak, Lantai 2",
    category: "Workshop",
    description: "Belajar merangkai narasi kota melalui jurnalisme warga, penulisan kreatif, dan riset lapangan.",
    image: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    organizer: "Redaksi Benah Palembang",
  },
}

export function EventPreview() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const eventId = id || searchParams.get("id") || "1"

  const customEvent = location.state?.event as AgendaItem | undefined
  const returnUrl = location.state?.returnUrl as string | undefined

  const item: AgendaItem = 
    customEvent ||
    fallbackEvents[eventId] ||
    agendaItems.find(a => a.id === eventId) ||
    agendaItems[0] ||
    fallbackEvents["1"]

  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${item.title} - Benah Palembang`,
          text: `Ikuti agenda "${item.title}" di Palembang!`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard?.writeText(window.location.href)
        setCopied(true)
        toast.success("Tautan acara berhasil disalin!")
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      await navigator.clipboard?.writeText(window.location.href)
      setCopied(true)
      toast.success("Tautan acara berhasil disalin!")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleBack = () => {
    if (returnUrl) {
      navigate(returnUrl)
    } else if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/dashboard/create-event')
    }
  }

  const waMessage = `Halo Panitia, saya ingin mendaftar untuk acara:\n*${item.title}*\nTanggal: ${item.date}\nLokasi: ${item.location}`
  const waContactMessage = `Halo Panitia, saya ingin bertanya dan mendapatkan info lebih lanjut seputar acara:\n*${item.title}*\nTanggal: ${item.date}\nLokasi: ${item.location}`

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* ── Top Action & Control Header ── */}
      <div className="flex flex-row items-center justify-between gap-4 sticky top-0 bg-background/90 backdrop-blur-md z-20 py-3.5 px-4 -mx-4 md:-mx-8 border-b shadow-sm">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleBack} 
          className="gap-2 font-medium"
        >
          <ArrowLeft className="size-4" /> Kembali
        </Button>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 shadow-xs">
          <Eye className="size-3.5" /> Pratinjau Event (Tampilan Publik)
        </span>
      </div>

      {/* ── Main Event Layout (Public Website Style) ── */}
      <div className="rounded-2xl border bg-background overflow-hidden shadow-sm">
        {/* Event Hero Header */}
        <header className="relative overflow-hidden bg-palembang-charcoal px-6 pb-16 pt-16 text-white sm:px-10 lg:px-16">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-full sm:w-2/3 lg:w-1/2 overflow-hidden opacity-30 lg:opacity-45">
            <img 
              src={item.image} 
              alt={item.title} 
              className="size-full object-cover object-right" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-palembang-charcoal via-palembang-charcoal/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-palembang-charcoal/40 via-transparent to-palembang-charcoal" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1240px]">
            <div className="mb-4">
              <span className="inline-block rounded-full border border-palembang-red/40 bg-palembang-red/15 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-palembang-red">
                {item.category}
              </span>
            </div>
            <h1 className="mt-2 max-w-4xl font-display text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              {item.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              {item.description}
            </p>
          </div>
        </header>

        {/* Event Content & Sidebar Details Area */}
        <main className="px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <div className="mx-auto max-w-[1240px]">
            <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
              {/* Left Column: Cover & Description */}
              <div>
                <div className="overflow-hidden rounded-[1.5rem] shadow-sm border">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="aspect-[16/9] w-full object-cover" 
                  />
                </div>

                <div className="mt-10">
                  <h2 className="font-display text-2xl font-bold tracking-[-0.03em]">Tentang Acara</h2>
                  <p className="mt-4 text-base leading-8 text-muted-foreground">{item.description}</p>
                  <p className="mt-4 text-base leading-8 text-muted-foreground">
                    Acara ini terbuka untuk umum dan dirancang untuk mempertemukan berbagai elemen masyarakat Palembang — dari akademisi, pelaku kreatif, hingga warga biasa yang peduli dengan kemajuan kota. Hadir dan rasakan energi kolaboratif yang mendorong dampak nyata.
                  </p>
                  <p className="mt-4 text-base leading-8 text-muted-foreground">
                    Peserta diharapkan hadir tepat waktu. Registrasi atau check-in dibuka 30 menit sebelum acara dimulai.
                  </p>
                </div>

                <div className="mt-10">
                  <h2 className="font-display text-2xl font-bold tracking-[-0.03em]">Yang Akan Kamu Dapatkan</h2>
                  <ul className="mt-4 space-y-3">
                    {[
                      "Insight dan perspektif baru dari para narasumber berpengalaman",
                      "Networking dengan komunitas dan pelaku kreatif Palembang",
                      "Sertifikat kehadiran resmi dari penyelenggara",
                      "Konsumsi dan kit peserta terdaftar",
                    ].map(benefit => (
                      <li key={benefit} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                        <Check className="mt-0.5 size-4 flex-shrink-0 text-palembang-red" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: Event Meta & CTA Card */}
              <div>
                <div className="sticky top-24 space-y-6">
                  <div className="rounded-[1.5rem] border border-border bg-card p-6 shadow-sm">
                    <h3 className="font-display text-lg font-bold">Detail Acara</h3>
                    
                    <div className="mt-6 space-y-5">
                      <div className="flex items-start gap-3">
                        <CalendarDays className="mt-0.5 size-5 text-palembang-red shrink-0" />
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Tanggal</p>
                          <p className="mt-1 text-sm font-semibold">{item.date}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock3 className="mt-0.5 size-5 text-palembang-red shrink-0" />
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Waktu</p>
                          <p className="mt-1 text-sm font-semibold">{item.time}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 size-5 text-palembang-red shrink-0" />
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Lokasi</p>
                          <p className="mt-1 text-sm font-semibold">{item.location}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Sparkles className="mt-0.5 size-5 text-palembang-red shrink-0" />
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Penyelenggara</p>
                          <p className="mt-1 text-sm font-semibold">{item.organizer}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 space-y-3">
                      <a 
                        href={`https://wa.me/628551241878?text=${encodeURIComponent(waMessage)}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-palembang-red text-sm font-bold text-white transition-colors hover:bg-palembang-red/90 shadow-sm"
                      >
                        <Ticket className="size-4" /> Daftar Sekarang
                      </a>

                      <div className="grid grid-cols-2 gap-2.5">
                        <a 
                          href={`https://wa.me/628551241878?text=${encodeURIComponent(waContactMessage)}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-emerald-600/30 bg-emerald-600/10 text-xs sm:text-sm font-bold text-emerald-600 hover:bg-emerald-600 hover:text-white dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-400 dark:hover:bg-emerald-600 dark:hover:text-white transition-all duration-200"
                        >
                          <MessageCircle className="size-4 shrink-0" /> Hubungi Kami
                        </a>
                        
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleShare} 
                          className="h-11 w-full text-xs sm:text-sm font-semibold gap-2"
                        >
                          {copied ? (
                            <>
                              <Check className="size-4 text-emerald-600 shrink-0" />
                              <span className="text-emerald-600 truncate">Disalin!</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="size-4 shrink-0" />
                              <span>Bagikan</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-border bg-muted/40 p-6">
                    <div className="inline-flex items-center gap-2 rounded-full bg-palembang-charcoal px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-palembang-red">
                      <Sparkles className="size-3" /> {item.category}
                    </div>
                    <h4 className="mt-3 font-display text-base font-bold text-foreground">
                      Kategori: {item.category}
                    </h4>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      Acara ini juga terbuka untuk kolaborasi komunitas dan publik. Hubungi penyelenggara untuk informasi lebih lanjut.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
