import { Link } from 'react-router'
import PlantCard from '../components/PlantCard'
import { usePlantas } from '../lib/catalogo'

export default function FeaturedPlants() {
  const plantasDestacadas = usePlantas().filter((planta) => planta.destacado)
  if (plantasDestacadas.length === 0) return null
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="flex items-end justify-between gap-4">
        <div><p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Selección</p><h2 className="font-display mt-3 text-3xl font-light sm:text-5xl">Plantas destacadas</h2></div>
        <Link to="/plantas" className="min-h-11 pt-3 text-sm underline underline-offset-4">Ver todas</Link>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">{plantasDestacadas.slice(0, 4).map((planta) => <PlantCard key={planta.id} planta={planta} />)}</div>
    </section>
  )
}
