import { useState } from 'react'
import { Menu, MessageCircle, X } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { DEFAULT_MESSAGE, STUDIO_NAME, facebookLink, whatsappLink } from '../config'
import { FacebookIcon } from './Contact'

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const ubicacion = useLocation()
  const [prevPath, setPrevPath] = useState(ubicacion.pathname)

  // Cerrar el menú si cambia la ruta
  if (ubicacion.pathname !== prevPath) {
    setPrevPath(ubicacion.pathname)
    setMenuAbierto(false)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-foreground/15 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          to="/"
          onClick={() => setMenuAbierto(false)}
          className="flex items-center gap-2.5 font-display text-lg font-medium tracking-tight group"
        >
          <img
            src="/logo.svg"
            alt={STUDIO_NAME}
            className="size-8 rounded-full border border-foreground/20 object-cover shadow-xs transition-transform group-hover:scale-105"
          />
          <span>{STUDIO_NAME}</span>
        </Link>

        {/* Navegación Desktop */}
        <nav className="flex items-center gap-3 text-sm sm:gap-6">
          <Link
            to="/"
            className="hidden min-h-[44px] items-center hover:opacity-60 transition-opacity sm:flex"
          >
            Plantas
          </Link>
          <Link
            to="/como-funciona"
            className="hidden min-h-[44px] items-center hover:opacity-60 transition-opacity sm:flex"
          >
            Cómo funciona
          </Link>
          <a
            href={facebookLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-[44px] items-center gap-2 hover:opacity-60 transition-opacity sm:flex"
          >
            <FacebookIcon className="size-4" aria-hidden="true" />
            Facebook
          </a>
          <a
            href={whatsappLink(DEFAULT_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"
            className="hidden min-h-[44px] items-center gap-2 rounded-full border border-foreground/40 px-4 sm:flex sm:px-5 hover:bg-foreground hover:text-primary-foreground transition-colors"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            <span>WhatsApp</span>
          </a>

          {/* Botón hamburguesa móvil */}
          <button
            type="button"
            onClick={() => setMenuAbierto((prev) => !prev)}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuAbierto}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-sm border border-foreground/20 bg-background/80 hover:bg-secondary sm:hidden transition-colors"
          >
            {menuAbierto ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </div>

      {/* Menú desplegable móvil expandible, compacto y con fondo cálido */}
      {menuAbierto && (
        <>
          {/* Fondo oscuro al tocar fuera para cerrar */}
          <div
            className="fixed inset-0 top-16 z-40 bg-foreground/20 backdrop-blur-xs sm:hidden"
            onClick={() => setMenuAbierto(false)}
            aria-hidden="true"
          />

          {/* Panel desplegable con flex */}
          <div className="relative z-50 border-t border-foreground/15 bg-[#F5EEE3] px-5 py-4 shadow-xl sm:hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <nav className="flex flex-col gap-2.5">
              <Link
                to="/"
                onClick={() => setMenuAbierto(false)}
                className={`flex h-11 w-full items-center justify-between rounded-md border px-4 text-sm font-medium transition-colors ${
                  ubicacion.pathname === '/' || ubicacion.pathname === '/plantas'
                    ? 'border-foreground/40 bg-white font-semibold text-foreground shadow-xs'
                    : 'border-foreground/15 bg-white/85 text-foreground hover:bg-white'
                }`}
              >
                <span>Ver plantas</span>
                <span className="text-xs text-muted-foreground">Catálogo</span>
              </Link>

              <Link
                to="/como-funciona"
                onClick={() => setMenuAbierto(false)}
                className={`flex h-11 w-full items-center justify-between rounded-md border px-4 text-sm font-medium transition-colors ${
                  ubicacion.pathname === '/como-funciona'
                    ? 'border-foreground/40 bg-white font-semibold text-foreground shadow-xs'
                    : 'border-foreground/15 bg-white/85 text-foreground hover:bg-white'
                }`}
              >
                <span>Cómo funciona</span>
                <span className="text-xs text-muted-foreground">Guía</span>
              </Link>

              <a
                href={whatsappLink(DEFAULT_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuAbierto(false)}
                className="flex h-11 w-full items-center justify-between rounded-md border border-[#25D366]/40 bg-white/90 px-4 text-sm font-medium text-foreground hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="size-4 text-[#25D366]" />
                  <span>WhatsApp</span>
                </div>
                <span className="text-xs font-semibold text-emerald-700">Chat ↗</span>
              </a>

              <a
                href={facebookLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuAbierto(false)}
                className="flex h-11 w-full items-center justify-between rounded-md border border-[#1877F2]/30 bg-white/90 px-4 text-sm font-medium text-foreground hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FacebookIcon className="size-4 text-[#1877F2]" />
                  <span>Facebook</span>
                </div>
                <span className="text-xs font-semibold text-blue-700">Visitar ↗</span>
              </a>
            </nav>
          </div>
        </>
      )}
    </header>
  )
}
