import { useSyncExternalStore } from 'react'
import { PLANTAS_INICIALES, type EstadoPlanta, type Planta } from '../data/plants'
import { supabase } from './supabase'

const EVENTO_CATALOGO = 'catalogo-actualizado'
const SIETE_DIAS_EN_MS = 7 * 24 * 60 * 60 * 1000
let plantasEnMemoria = PLANTAS_INICIALES
let iniciado = false

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
  return plantasEnMemoria
}

function notificarCambio() {
  window.dispatchEvent(new Event(EVENTO_CATALOGO))
}

function desdeBaseDeDatos(fila: {
  id: string
  nombre: string
  precio: number
  imagenes: string[]
  ambiente: Planta['ambiente']
  descripcion: string
  estado: Planta['estado']
  vendida_en: string | null
  destacado: boolean
}): Planta {
  return {
    id: fila.id,
    nombre: fila.nombre,
    precio: Number(fila.precio),
    imagenes: Array.isArray(fila.imagenes) ? fila.imagenes : [],
    ambiente: fila.ambiente,
    descripcion: fila.descripcion || '',
    estado: fila.estado,
    vendidaEn: fila.vendida_en ?? undefined,
    destacado: Boolean(fila.destacado),
  }
}

function aBaseDeDatos(planta: Planta) {
  return {
    id: planta.id,
    nombre: planta.nombre,
    precio: Number(planta.precio),
    imagenes: planta.imagenes,
    ambiente: planta.ambiente,
    descripcion: planta.descripcion || '',
    estado: planta.estado,
    vendida_en: planta.vendidaEn ?? null,
    destacado: Boolean(planta.destacado),
    updated_at: new Date().toISOString(),
  }
}

export async function cargarPlantas(): Promise<void> {
  const { data, error } = await supabase.from('plants').select('*').order('updated_at')
  if (error) {
    console.warn('No se pudo cargar el catálogo de Supabase:', error.message)
    return
  }

  if (data) {
    plantasEnMemoria = eliminarVendidasCaducadas(data.map(desdeBaseDeDatos))
    notificarCambio()
  }
}

function iniciarSincronizacion() {
  if (iniciado) return
  iniciado = true
  void cargarPlantas()
  supabase
    .channel('catalogo-de-plantas')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'plants' }, () => {
      void cargarPlantas()
    })
    .subscribe()
}

export async function guardarPlanta(planta: Planta): Promise<void> {
  const normalizada = normalizarPlantas([planta])[0]
  const fila = aBaseDeDatos(normalizada)
  const { error } = await supabase.from('plants').upsert(fila)
  if (error) {
    console.error('Error al guardar la planta en Supabase:', error)
    throw new Error(error.message)
  }
  await cargarPlantas()
}

export async function guardarPlantas(plantas: Planta[]): Promise<void> {
  const plantasActualizadas = eliminarVendidasCaducadas(normalizarPlantas(plantas))
  const filas = plantasActualizadas.map(aBaseDeDatos)
  const { error } = await supabase.from('plants').upsert(filas)
  if (error) {
    console.error('Error al guardar el catálogo en Supabase:', error)
    throw new Error(error.message)
  }
  await cargarPlantas()
}

export async function eliminarPlanta(id: string): Promise<void> {
  const { error } = await supabase.from('plants').delete().eq('id', id)
  if (error) {
    console.error('Error al eliminar la planta de Supabase:', error)
    throw new Error(error.message)
  }
  await cargarPlantas()
}

export async function alternarEstadoPlanta(id: string, nuevoEstado: EstadoPlanta): Promise<void> {
  const vendidaEn = nuevoEstado === 'vendido' ? new Date().toISOString() : null
  const { error } = await supabase
    .from('plants')
    .update({
      estado: nuevoEstado,
      vendida_en: vendidaEn,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
  if (error) {
    console.error('Error al alternar estado en Supabase:', error)
    throw new Error(error.message)
  }
  await cargarPlantas()
}

export async function subirImagenPlanta(archivo: File): Promise<string> {
  const extension = archivo.name.split('.').pop() || 'jpg'
  const nombreLimpio = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extension}`
  const ruta = `${nombreLimpio}`

  try {
    const { error } = await supabase.storage
      .from('plants')
      .upload(ruta, archivo, {
        cacheControl: '3600',
        upsert: true,
      })

    if (!error) {
      const { data } = supabase.storage.from('plants').getPublicUrl(ruta)
      if (data?.publicUrl) return data.publicUrl
    } else {
      console.warn('Aviso: no se pudo subir a Supabase Storage, usando codificación local:', error.message)
    }
  } catch (err) {
    console.warn('Aviso al subir imagen a Supabase Storage:', err)
  }

  return new Promise<string>((resolve, reject) => {
    const lector = new FileReader()
    lector.onload = () => resolve(String(lector.result))
    lector.onerror = reject
    lector.readAsDataURL(archivo)
  })
}

export async function inicializarCatalogoEnSupabase(): Promise<void> {
  await guardarPlantas(PLANTAS_INICIALES)
}

export async function comprobarConexionSupabase(): Promise<{
  conectado: boolean
  total: number
  error?: string
}> {
  try {
    const { data, error } = await supabase.from('plants').select('id')
    if (error) {
      return { conectado: false, total: 0, error: error.message }
    }
    return { conectado: true, total: data?.length ?? 0 }
  } catch (err) {
    return {
      conectado: false,
      total: 0,
      error: err instanceof Error ? err.message : 'Error desconocido al conectar con Supabase',
    }
  }
}

function suscribirse(actualizar: () => void) {
  iniciarSincronizacion()
  window.addEventListener(EVENTO_CATALOGO, actualizar)
  return () => {
    window.removeEventListener(EVENTO_CATALOGO, actualizar)
  }
}

export function usePlantas() {
  return useSyncExternalStore(suscribirse, leerPlantas, () => PLANTAS_INICIALES)
}
