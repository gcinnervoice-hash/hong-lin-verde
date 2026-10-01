import { Link } from 'react-router'
import { slugPlanta, type Planta } from '../data/plants'

export default function PlantCard({ planta }: { planta: Planta }) {
  const estaVendida = planta.estado === 'vendido'
  return (
    <article>
      <Link to={`/plantas/${slugPlanta(planta)}`} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">
        <div className="relative overflow-hidden rounded-sm bg-secondary/50">
          <img src={planta.imagenes[0]} alt={planta.nombre} loading="lazy" className={`aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${estaVendida ? 'grayscale-[35%] opacity-70' : ''}`} />
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.6875rem] font-medium ${estaVendida ? 'bg-background/90 text-muted-foreground' : 'bg-foreground text-primary-foreground'}`}>{estaVendida ? 'Vendida' : 'Disponible'}</span>
        </div>
        <div className="mt-3 flex items-start justify-between gap-2">
          <h2 className="font-display text-base font-medium leading-snug sm:text-lg">{planta.nombre}</h2>
          <p className="shrink-0 text-sm font-semibold">{planta.precio} €</p>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{planta.ambiente}</p>
      </Link>
    </article>
  )
}
