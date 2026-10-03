import { Clock3 } from 'lucide-react'
import { useMemo, useState } from 'react'
import PlantCard from '../components/PlantCard'
import type { AmbientePlanta, EstadoPlanta } from '../data/plants'
import { usePlantas } from '../lib/catalogo'
import { Footer, WhatsAppFloat } from '../sections/Contact'
import Header from '../sections/Header'

type Filtro = 'Todo' | AmbientePlanta | EstadoPlanta
const filtros: Filtro[] = ['Todo', 'Interior', 'Exterior', 'disponible', 'vendido']
const SEMANA_EN_MS = 7 * 24 * 60 * 60 * 1000

function seVendioEstaSemana(fechaVenta?: string): boolean {
  if (!fechaVenta) return false
  const fecha = new Date(fechaVenta).getTime()
  return !Number.isNaN(fecha) && Date.now() - fecha < SEMANA_EN_MS
}

export default function Plantas() {
  const [filtro, establecerFiltro] = useState<Filtro>('Todo')
  const plantas = usePlantas()
  const plantasFiltradas = useMemo(
    () => plantas.filter((planta) => filtro === 'Todo' || planta.ambiente === filtro || planta.estado === filtro),
    [filtro, plantas],
  )
  const disponibles = useMemo(() => plantas.filter((planta) => planta.estado === 'disponible'), [plantas])
  const vendidasEstaSemana = useMemo(
    () => plantas.filter((planta) => planta.estado === 'vendido' && seVendioEstaSemana(planta.vendidaEn)),
    [plantas],
  )
  const mostrarResumen = filtro === 'Todo'

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Estudio Verde Hong</p>
              <h1 className="font-display mt-4 text-4xl font-light sm:text-6xl">Plantas</h1>
            </div>
            <div className="flex flex-wrap rounded-sm border border-foreground/20 p-1" aria-label="Filtrar plantas">
              {filtros.map((opcion) => (
                <button key={opcion} type="button" onClick={() => establecerFiltro(opcion)} aria-pressed={filtro === opcion} className={`min-h-9 px-3 text-sm transition-colors sm:px-4 ${filtro === opcion ? 'bg-foreground text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                  {opcion === 'Todo' ? 'Todas' : opcion === 'disponible' ? 'Disponible' : opcion === 'vendido' ? 'Vendida' : opcion}
                </button>
              ))}
            </div>
          </div>

          {mostrarResumen ? (
            <>
              <div className="mt-12 flex items-baseline justify-between gap-4">
                <h2 className="font-display text-2xl font-medium sm:text-3xl">Disponibles</h2>
                <p className="text-sm text-muted-foreground">{disponibles.length} plantas</p>
              </div>
              <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
                {disponibles.map((planta) => <PlantCard key={planta.id} planta={planta} />)}
              </div>
            </>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
              {plantasFiltradas.map((planta) => <PlantCard key={planta.id} planta={planta} />)}
            </div>
          )}
        </section>

        {mostrarResumen && vendidasEstaSemana.length > 0 && (
          <section className="border-y border-foreground/15 bg-secondary/35">
            <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-muted-foreground"><Clock3 className="size-4" aria-hidden="true" /> Últimos 7 días</p>
                  <h2 className="font-display mt-3 text-3xl font-light sm:text-5xl">Vendidas esta semana</h2>
                </div>
                <p className="text-sm text-muted-foreground">Una pequeña celebración de nuestros nuevos hogares verdes.</p>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
                {vendidasEstaSemana.map((planta) => <PlantCard key={planta.id} planta={planta} />)}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
