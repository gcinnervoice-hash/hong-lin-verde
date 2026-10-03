import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { slugPlanta, type Planta } from '../data/plants'

export default function PlantCard({ planta }: { planta: Planta }) {
  const estaVendida = planta.estado === 'vendido'
  return (
    <article className="group relative">
      <Link
        to={`/plantas/${slugPlanta(planta)}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
      >
        <div className="relative overflow-hidden rounded-lg bg-secondary/50 border border-foreground/10 transition-all duration-500 group-hover:border-foreground/25 group-hover:shadow-[0_12px_28px_-8px_rgba(6,64,19,0.16)] group-hover:-translate-y-1">
          {/* Subtle misty veil overlay that clears on hover */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-background/40 via-transparent to-black/5 opacity-70 group-hover:opacity-10 transition-opacity duration-500" />

          <img
            src={planta.imagenes[0]}
            alt={planta.nombre}
            loading="lazy"
            className={`aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
              estaVendida ? 'grayscale-[35%] opacity-70' : ''
            }`}
          />

          <span
            className={`absolute left-3 top-3 z-20 rounded-full px-2.5 py-1 text-[0.6875rem] font-medium backdrop-blur-xs ${
              estaVendida
                ? 'bg-background/90 text-muted-foreground'
                : 'bg-foreground/90 text-primary-foreground'
            }`}
          >
            {estaVendida ? 'Vendida' : 'Disponible'}
          </span>

          {/* Inviting peek chip that appears smoothly on hover */}
          <div className="pointer-events-none absolute inset-x-0 bottom-3.5 z-20 flex justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/95 px-3.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-md border border-foreground/15">
              <span>Ver planta</span>
              <ArrowUpRight className="size-3.5 opacity-80" />
            </span>
          </div>
        </div>

        <div className="mt-3.5 flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-base font-medium leading-snug sm:text-lg group-hover:text-foreground transition-colors">
              {planta.nombre}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{planta.ambiente}</p>
          </div>
          <p className="shrink-0 text-sm font-semibold">{planta.precio} €</p>
        </div>
      </Link>
    </article>
  )
}
