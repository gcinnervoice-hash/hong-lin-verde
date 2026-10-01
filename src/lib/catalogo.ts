import { useSyncExternalStore } from 'react'
import { PLANTAS_INICIALES, type Planta } from '../data/plants'

const CLAVE_PLANTAS = 'estudio-verde-hong-plantas'
const EVENTO_CATALOGO = 'catalogo-actualizado'
let valorGuardado: string | null | undefined
let plantasEnMemoria = PLANTAS_INICIALES

export function leerPlantas(): Planta[] {
  const guardadas = localStorage.getItem(CLAVE_PLANTAS)
  if (guardadas === valorGuardado) return plantasEnMemoria

  valorGuardado = guardadas
  plantasEnMemoria = guardadas ? JSON.parse(guardadas) as Planta[] : PLANTAS_INICIALES
  return plantasEnMemoria
}

export function guardarPlantas(plantas: Planta[]) {
  valorGuardado = JSON.stringify(plantas)
  plantasEnMemoria = plantas
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
