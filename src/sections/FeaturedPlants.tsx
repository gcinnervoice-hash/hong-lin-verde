import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import PlantCard from '../components/PlantCard'
import { usePlantas } from '../lib/catalogo'

export default function FeaturedPlants() {
  const todasLasPlantas = usePlantas()
  const plantasDestacadas = todasLasPlantas.filter((planta) => planta.destacado)
  if (plantasDestacadas.length === 0) return null

  return (
    <section id="seleccion" className="relative overflow-hidden py-16 sm:py-24">
      {/* Ambient botanical mist glow ("若隐若现") */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 h-[380px] w-[800px] max-w-full rounded-full bg-emerald-700/[0.04] blur-3xl" />
        <div className="absolute -bottom-16 right-1/4 h-56 w-56 rounded-full bg-amber-500/[0.03] blur-2xl" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
              </span>
              <span>Selección viva</span>
            </div>
            <h2 className="font-display mt-3 text-3xl font-light sm:text-5xl">
              Plantas destacadas
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Una cuidada muestra de nuestras especies más sanas y especiales. Haz clic en cualquiera para explorarla de cerca.
            </p>
          </div>

          <Link
            to="/plantas"
            className="group hidden sm:inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            <span>Ver catálogo completo ({todasLasPlantas.length})</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Plant Cards Grid */}
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
          {plantasDestacadas.slice(0, 4).map((planta) => (
            <PlantCard key={planta.id} planta={planta} />
          ))}
        </div>

        {/* Enticing Teaser Portal ("若隐若现，邀请用户点进去") */}
        <div className="relative mt-12 sm:mt-16 overflow-hidden rounded-2xl border border-foreground/15 bg-gradient-to-r from-secondary/40 via-background/80 to-secondary/30 p-6 sm:p-8 backdrop-blur-sm transition-all duration-500 hover:border-foreground/30 hover:shadow-md group">
          <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-emerald-500/10 blur-xl group-hover:bg-emerald-500/20 transition-all duration-700" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 relative z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground font-medium">
                <Sparkles className="size-3.5 text-emerald-700" />
                Catálogo en sala
              </span>
              <h3 className="font-display mt-1 text-xl font-medium sm:text-2xl text-foreground">
                ¿Buscas la planta ideal para tu rincón?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Descubre todas nuestras variedades de interior y exterior listas para recoger.
              </p>
            </div>
            <Link
              to="/plantas"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-foreground px-7 text-sm font-medium text-primary-foreground transition-all duration-300 hover:opacity-90 group-hover:scale-[1.02] shadow-sm shrink-0"
            >
              <span>Entrar al catálogo completo</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
