import { whatsappLink, DEFAULT_MESSAGE } from '../config'
import { Link } from 'react-router'

export default function Hero() {
  return (
    <section id="inicio" className="pt-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="py-14 sm:py-20 md:py-24">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Plantas de interior y exterior · Recogida local : Madrid y Toledo
          </p>
          <h1 className="font-display mt-5 max-w-3xl text-4xl font-light leading-[1.1] sm:text-6xl md:text-7xl">
            Verde para tu casa,
            <br />
            cerca de ti.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Seleccionamos plantas sanas y las preparamos con cuidado.
            Reserva por WhatsApp y recógela en Madrid o Toledo.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/plantas"
              className="flex min-h-[48px] items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-primary-foreground hover:opacity-85 transition-opacity"
            >
              Ver plantas
            </Link>
            <a
              href={whatsappLink(DEFAULT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[48px] items-center justify-center rounded-full border border-foreground/40 px-8 text-sm font-medium hover:bg-foreground hover:text-primary-foreground transition-colors"
            >
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
  
        <section
          aria-labelledby="por-que-elegirnos"
          className="mt-12 border-t border-foreground/15 py-10 sm:mt-16 sm:py-12"
        >
          <h2 id="por-que-elegirnos" className="font-display text-2xl font-medium sm:text-3xl">
            ¿Por qué elegirnos?
          </h2>
          <ul className="mt-6 grid gap-4 text-sm leading-relaxed text-muted-foreground sm:grid-cols-3 sm:gap-8">
            <li>
              <strong className="font-medium text-foreground">Hasta un 20% más barato</strong> que las
              floristerías locales.
            </li>
            <li>
              <strong className="font-medium text-foreground">Envío gratis</strong> para pedidos
              superiores a <strong className="font-medium text-foreground">30 € en Toledo</strong> y{' '}
              <strong className="font-medium text-foreground">50 € en Madrid</strong>.
            </li>
            <li>
              <strong className="font-medium text-foreground">Consejos de cuidado</strong> para que tus
              plantas crezcan sanas y bonitas.
            </li>
          </ul>
        </section>
      </div>
    </section>
  )
}
