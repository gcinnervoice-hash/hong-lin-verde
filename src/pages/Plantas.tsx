import { useMemo, useState } from 'react'
import PlantCard from '../components/PlantCard'
import type { AmbientePlanta, EstadoPlanta } from '../data/plants'
import { usePlantas } from '../lib/catalogo'
import { Footer, WhatsAppFloat } from '../sections/Contact'
import Header from '../sections/Header'

type Filtro = 'Todo' | AmbientePlanta | EstadoPlanta
const filtros: Filtro[] = ['Todo', 'Interior', 'Exterior', 'disponible', 'vendido']

export default function Plantas() {
  const [filtro, establecerFiltro] = useState<Filtro>('Todo')
  const plantas = usePlantas()
  const plantasFiltradas = useMemo(() => plantas.filter((planta) => filtro === 'Todo' || planta.ambiente === filtro || planta.estado === filtro), [filtro, plantas])
  return (
    <div className="min-h-screen"><Header /><main className="pt-16"><section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6"><div><p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Estudio Verde Hong</p><h1 className="font-display mt-4 text-4xl font-light sm:text-6xl">Plantas</h1></div>
        <div className="flex flex-wrap rounded-sm border border-foreground/20 p-1" aria-label="Filtrar plantas">{filtros.map((opcion) => <button key={opcion} type="button" onClick={() => establecerFiltro(opcion)} aria-pressed={filtro === opcion} className={`min-h-9 px-3 text-sm transition-colors sm:px-4 ${filtro === opcion ? 'bg-foreground text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>{opcion === 'Todo' ? 'Todo' : opcion === 'disponible' ? 'Disponible' : opcion === 'vendido' ? 'Vendida' : opcion}</button>)}</div>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">{plantasFiltradas.map((planta) => <PlantCard key={planta.id} planta={planta} />)}</div>
    </section></main><Footer /><WhatsAppFloat /></div>
  )
}
