import { useSyncExternalStore } from 'react'
import { PLANTAS_INICIALES, type Planta } from '../data/plants'

const CLAVE_PLANTAS = 'estudio-verde-hong-plantas'
const EVENTO_CATALOGO = 'catalogo-actualizado'
const SIETE_DIAS_EN_MS = 7 * 24 * 60 * 60 * 1000
let valorGuardado: string | null | undefined
let plantasEnMemoria = PLANTAS_INICIALES

function normalizarPlantas(plantas: Planta[]): Planta[] {
  return plantas.map((planta) => {
    if (planta.estado === 'vendido') {
      return planta.vendidaEn ? planta : { ...planta, vendidaEn: new Date().toISOString() }
    }

    const plantaDisponible = { ...planta }
    delete plantaDisponible.vendidaEn
    return plantaDisponible
  })
}

function estaCaducada(planta: Planta, ahora: number): boolean {
  if (planta.estado !== 'vendido' || !planta.vendidaEn) return false
  const fechaVenta = new Date(planta.vendidaEn).getTime()
  return !Number.isNaN(fechaVenta) && ahora - fechaVenta >= SIETE_DIAS_EN_MS
}

function eliminarVendidasCaducadas(plantas: Planta[]): Planta[] {
  return plantas.filter((planta) => !estaCaducada(planta, Date.now()))
}

export function leerPlantas(): Planta[] {
  const guardadas = localStorage.getItem(CLAVE_PLANTAS)
  const plantas = guardadas === valorGuardado
    ? plantasEnMemoria
    : guardadas
      ? JSON.parse(guardadas) as Planta[]
      : PLANTAS_INICIALES
  const plantasActualizadas = eliminarVendidasCaducadas(plantas)
  const valorActualizado = JSON.stringify(plantasActualizadas)

  if (guardadas === valorGuardado && valorActualizado === valorGuardado) return plantasEnMemoria

  valorGuardado = valorActualizado
  plantasEnMemoria = plantasActualizadas

  if (guardadas !== valorActualizado) {
    localStorage.setItem(CLAVE_PLANTAS, valorActualizado)
  }

  return plantasEnMemoria
}

export function guardarPlantas(plantas: Planta[]) {
  const plantasActualizadas = eliminarVendidasCaducadas(normalizarPlantas(plantas))
  valorGuardado = JSON.stringify(plantasActualizadas)
  plantasEnMemoria = plantasActualizadas
  localStorage.setItem(CLAVE_PLANTAS, valorGuardado)
  window.dispatchEvent(new Event(EVENTO_CATALOGO))
}

function suscribirse(actualizar: () => void) {
  window.addEventListener(EVENTO_CATALOGO, actualizar)
  window.addEventListener('storage', actualizar)
  return () => {
    window.removeEventListener(EVENTO_CATALOGO, actualizar)
    window.removeEventListener('storage', actualizar)
  }
}

export function usePlantas() {
  return useSyncExternalStore(suscribirse, leerPlantas, () => PLANTAS_INICIALES)
}
