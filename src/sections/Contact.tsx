import { MessageCircle } from 'lucide-react'
import { DEFAULT_MESSAGE, STUDIO_NAME, WHATSAPP_NUMBER, facebookLink, whatsappLink } from '../config'

export const WhatsAppIcon = MessageCircle

export function FacebookIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export default function ContactCta() {
  return (
    <section id="contacto" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-light sm:text-5xl">¿Hablamos?</h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Escríbenos por WhatsApp o Facebook para reservar una planta, consultar disponibilidad o pedir consejo de cuidados.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={whatsappLink(DEFAULT_MESSAGE)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full bg-[#25D366] px-8 text-sm font-medium text-white transition-opacity hover:opacity-90">
              <WhatsAppIcon className="size-5" aria-hidden="true" />
              Contactar por WhatsApp
            </a>
            <a href={facebookLink()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full bg-[#1877F2] px-8 text-sm font-medium text-white transition-opacity hover:opacity-90">
              <FacebookIcon className="size-5" aria-hidden="true" />
              Contactar por Facebook
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-foreground/15">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:py-14">
        <div>
          <p className="font-display text-lg font-medium">{STUDIO_NAME}</p>
          <p className="mt-2 text-sm text-muted-foreground">Plantas de interior con recogida local en Madrid y Toledo.</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 transition-opacity hover:opacity-70">WhatsApp: {WHATSAPP_NUMBER}</a>
            <a href={facebookLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 underline underline-offset-4 transition-opacity hover:opacity-70"><FacebookIcon className="size-4" aria-hidden="true" />Facebook</a>
          </div>
        </div>
        <p className="text-xs text-muted-foreground/80">© {new Date().getFullYear()} {STUDIO_NAME}</p>
      </div>
    </footer>
  )
}

export function WhatsAppFloat() {
  return (
    <a href={whatsappLink(DEFAULT_MESSAGE)} target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp" className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/15 transition-transform hover:scale-105" style={{ bottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
      <WhatsAppIcon className="h-7 w-7" aria-hidden="true" />
    </a>
  )
}
