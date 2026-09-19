import { Mail, MessageCircle } from "lucide-react"

export interface CollaborationCtaProps {
  contact: {
    email: string
    emailUrl: string
    whatsappUrl: string
  }
}

export function CollaborationCta({ contact }: CollaborationCtaProps) {
  return (
    <section aria-label="Contact for Collaboration">
      <div className="border border-black bg-white p-8 sm:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="rounded-[3px] bg-black text-white border border-black px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]">
              HUBUNGI KAMI
            </span>
            <h3 className="mt-3 font-sans text-xl sm:text-2xl font-bold tracking-tight text-black">
              Tertarik untuk bekerja sama dengan Benah Palembang?
            </h3>
            <p className="mt-2 font-serif text-sm leading-relaxed text-black/80">
              Kirimkan proposal, ide peliputan, atau penawaran kemitraan ke tim kami.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 shrink-0 sm:min-w-[240px]">
            <a
              href={contact.emailUrl}
              className="flex items-center justify-center gap-2 rounded-[3px] bg-black px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white hover:bg-zinc-800 transition-colors text-center"
            >
              <Mail className="size-3.5" />
              <span>{contact.email}</span>
            </a>
            <a
              href={contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-[3px] border border-black bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-black hover:bg-black hover:text-white transition-colors text-center"
            >
              <MessageCircle className="size-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
