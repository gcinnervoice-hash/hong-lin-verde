export default function WhyUs() {
  return (
    <section
      id="por-que-elegirnos"
      aria-labelledby="titulo-por-que-elegirnos"
      className="border-t border-foreground/15 py-14 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            Confianza y cercanía
          </p>
          <h2 id="titulo-por-que-elegirnos" className="font-display mt-2 text-2xl font-medium sm:text-4xl">
            ¿Por qué elegirnos?
          </h2>
        </div>
        <ul className="mt-8 grid gap-6 text-sm leading-relaxed text-muted-foreground sm:grid-cols-3 sm:gap-8">
          <li className="border-t border-foreground/20 pt-4">
            <strong className="block font-medium text-foreground text-base mb-1">
              Hasta un 20% más barato
            </strong>
            que las floristerías locales, seleccionando plantas directamente de cultivadores de confianza.
          </li>
          <li className="border-t border-foreground/20 pt-4">
            <strong className="block font-medium text-foreground text-base mb-1">
              Envío gratis
            </strong>
            para pedidos superiores a <strong className="font-medium text-foreground">30 € en Toledo</strong> y{' '}
            <strong className="font-medium text-foreground">50 € en Madrid</strong>.
          </li>
          <li className="border-t border-foreground/20 pt-4">
            <strong className="block font-medium text-foreground text-base mb-1">
              Consejos de cuidado
            </strong>
            asesoramiento cercano para que tus plantas crezcan sanas y llenas de vida.
          </li>
        </ul>
      </div>
    </section>
  )
}
