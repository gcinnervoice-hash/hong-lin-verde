const STEPS = [
  {
    n: '01',
    title: 'Elige tu planta',
    text: 'Mira el catálogo y escríbenos por WhatsApp con la planta que te interesa.',
  },
  {
    n: '02',
    title: 'Confirmamos la reserva',
    text: 'Te confirmamos disponibilidad, punto de recogida exacto y horario.',
  },
  {
    n: '03',
    title: 'Recoge en  Seseña',
    text: 'Preparamos tu planta con cuidado para que la recojas cuando te venga bien.',
  },
]


export default function PickupInfo() {
  return (
    <section id="recogida" className="scroll-mt-20 border-y border-foreground/15 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <h2 className="font-display text-3xl font-light sm:text-5xl">Cómo funciona</h2>

        <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {STEPS.map((step) => (
            <div key={step.n} className="border-t border-foreground/25 pt-5">
              <p className="font-display text-sm text-muted-foreground">{step.n}</p>
              <h3 className="font-display mt-3 text-xl font-medium">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          La dirección exacta del punto de recogida se comparte por WhatsApp al confirmar
          la reserva. Si necesitas otro día u hora, pregúntanos — solemos poder adaptarnos.
        </p>
      </div>
    </section>
  )
}
