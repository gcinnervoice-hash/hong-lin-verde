import { MessageCircle } from 'lucide-react'
import { Link } from 'react-router'
import { DEFAULT_MESSAGE, STUDIO_NAME, facebookLink, whatsappLink } from '../config'
import { FacebookIcon } from './Contact'

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-foreground/15 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="font-display text-lg font-medium tracking-tight">{STUDIO_NAME}</Link>
        <nav className="flex items-center gap-3 text-sm sm:gap-6">
          <Link to="/" className="hidden min-h-[44px] items-center sm:flex hover:opacity-60 transition-opacity">Plantas</Link>
          <Link to="/como-funciona" className="hidden min-h-[44px] items-center sm:flex hover:opacity-60 transition-opacity">Cómo funciona</Link>
          <a href={facebookLink()} target="_blank" rel="noopener noreferrer" className="hidden min-h-[44px] items-center gap-2 hover:opacity-60 transition-opacity sm:flex">
            <FacebookIcon className="size-4" aria-hidden="true" />
            Facebook
          </a>
          <a href={whatsappLink(DEFAULT_MESSAGE)} target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp" className="flex min-h-[44px] items-center gap-2 rounded-full border border-foreground/40 px-4 sm:px-5 hover:bg-foreground hover:text-primary-foreground transition-colors">
            <MessageCircle className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </nav>
      </div>
    </header>
  )
}
