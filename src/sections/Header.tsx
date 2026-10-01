import { Link } from 'react-router'
import { STUDIO_NAME } from '../config'

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-foreground/15">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="font-display text-lg font-medium tracking-tight">
          {STUDIO_NAME}
        </Link>
        <nav className="flex items-center gap-5 text-sm sm:gap-8">
          <Link to="/plantas" className="hidden min-h-[44px] items-center sm:flex hover:opacity-60 transition-opacity">
            Plantas
          </Link>
          <a href="/#recogida" className="hidden min-h-[44px] items-center sm:flex hover:opacity-60 transition-opacity">
            Recogida
          </a>
          <a
            href="/#contacto"
            className="flex min-h-[44px] items-center rounded-full border border-foreground/40 px-5 hover:bg-foreground hover:text-primary-foreground transition-colors"
          >
            Contacto
          </a>
        </nav>
      </div>
    </header>
  )
}
