import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { facebookLink, whatsappLink } from '../config'
import PlantGallery from '../components/PlantGallery'
import { slugPlanta } from '../data/plants'
import { usePlantas } from '../lib/catalogo'
import { FacebookIcon, Footer, WhatsAppIcon } from '../sections/Contact'
import Header from '../sections/Header'

export default function PlantDetail() {
  const { slug } = useParams()
  const planta = usePlantas().find((elemento) => slugPlanta(elemento) === slug)

  if (!planta) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-6xl px-5 pb-20 pt-32 sm:px-8">
          <h1 className="font-display text-4xl font-light">Planta no encontrada</h1>
          <Link to="/" className="mt-8 inline-flex min-h-11 items-center underline underline-offset-4">Volver a plantas</Link>
        </main>
        <Footer />
      </div>
    )
  }

  const estaVendida = planta.estado === 'vendido'
  const mensaje = `Hola, estoy interesado/a en la ${planta.nombre} de ${planta.precio} €. ¿Sigue disponible?`

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-14">
          <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" />Volver a plantas</Link>
          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:gap-16">
            <PlantGallery key={planta.id} planta={planta} />
            <div className="lg:pt-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">{planta.ambiente}</p>
                  <h1 className="font-display mt-3 text-4xl font-light leading-tight sm:text-5xl">{planta.nombre}</h1>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${estaVendida ? 'bg-secondary text-muted-foreground' : 'bg-foreground text-primary-foreground'}`}>{estaVendida ? 'Vendida' : 'Disponible'}</span>
              </div>
              <p className="mt-6 text-2xl font-semibold">{planta.precio} €</p>
              <p className="mt-7 max-w-lg text-base leading-relaxed text-muted-foreground">{planta.descripcion}</p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a href={whatsappLink(mensaje)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 text-sm font-medium text-white transition-opacity hover:opacity-90"><WhatsAppIcon className="size-5" aria-hidden="true" />Consultar por WhatsApp</a>
                <a href={facebookLink()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#1877F2] px-6 text-sm font-medium text-white transition-opacity hover:opacity-90"><FacebookIcon className="size-5" aria-hidden="true" />Consultar por Facebook</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
