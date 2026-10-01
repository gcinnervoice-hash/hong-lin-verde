import { useState } from 'react'
import type { Planta } from '../data/plants'

export default function PlantGallery({ planta }: { planta: Planta }) {
  const [imagenSeleccionada, establecerImagenSeleccionada] = useState(planta.imagenes[0])
  return (
    <div>
      <div className="overflow-hidden rounded-sm bg-secondary/50">
        <img src={imagenSeleccionada} alt={planta.nombre} className="aspect-[4/5] w-full object-cover sm:aspect-square" />
      </div>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
        {planta.imagenes.map((imagen, indice) => (
          <button key={imagen} type="button" onClick={() => establecerImagenSeleccionada(imagen)} aria-label={`Ver foto ${indice + 1} de ${planta.nombre}`} aria-pressed={imagenSeleccionada === imagen} className={`shrink-0 overflow-hidden rounded-sm border-2 transition-colors ${imagenSeleccionada === imagen ? 'border-foreground' : 'border-transparent'}`}>
            <img src={imagen} alt="" className="h-20 w-16 object-cover sm:h-24 sm:w-20" />
          </button>
        ))}
      </div>
    </div>
  )
}
