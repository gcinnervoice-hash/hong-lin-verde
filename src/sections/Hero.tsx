import { Check, MessageCircle } from 'lucide-react'
import { Link } from 'react-router'
import { DEFAULT_MESSAGE, facebookLink, whatsappLink } from '../config'
import { FacebookIcon } from './Contact'

const steps = [
  ['01', 'Elige tu planta', 'Explora el catálogo y encuentra la que mejor encaja en tu espacio.'],
  ['02', 'Escríbenos', 'Confirma disponibilidad, precio y el mejor momento para recogerla por WhatsApp o Facebook.'],
  ['03', 'Disfruta de tu verde', 'Preparamos tu planta con cuidado para que llegue lista a su nuevo hogar.'],
]

export default function Hero() {
  return (
    <section id="como-funciona" className="pt-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="py-14 sm:py-20 md:py-24">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Estudio Verde Hong</p>
          <h1 className="font-display mt-5 max-w-3xl text-4xl font-light leading-[1.1] sm:text-6xl md:text-7xl">Cómo funciona</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Encontrar una planta para tu casa es sencillo: mira el catálogo, escríbenos y coordinamos contigo la recogida.
          </p>

          <ol className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {steps.map(([number, title, description]) => (
              <li key={number} className="border-t border-foreground/25 pt-5">
                <p className="font-display text-sm text-muted-foreground">{number}</p>
                <h2 className="font-display mt-3 text-xl font-medium">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </li>
            ))}
          </ol>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link to="/" className="flex min-h-[48px] items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85">Ver todas las plantas</Link>
            <a href={whatsappLink(DEFAULT_MESSAGE)} target="_blank" rel="noopener noreferrer" className="flex min-h-[48px] items-center justify-center gap-2.5 rounded-full border border-foreground/40 px-8 text-sm font-medium transition-all hover:border-[#25D366] hover:bg-[#25D366] hover:text-white"><MessageCircle className="size-4 shrink-0" aria-hidden="true" />Hablar por WhatsApp</a>
            <a href={facebookLink()} target="_blank" rel="noopener noreferrer" className="flex min-h-[48px] items-center justify-center gap-2.5 rounded-full border border-foreground/40 px-8 text-sm font-medium transition-all hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white"><FacebookIcon className="size-4 shrink-0" aria-hidden="true" />Contactar por Facebook</a>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><Check className="size-4" aria-hidden="true" /> WhatsApp: +34 643 42 49 77</p>
        </div>
      </div>
    </section>
  )
}
