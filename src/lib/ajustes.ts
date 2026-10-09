import { supabase } from './supabase'

export const CLAVE_AJUSTES_LOCAL = 'estudio-verde-hong-ajustes'

export interface Ajustes {
  nombreTienda: string
  facebook: string
  direccion: string
  horario: string
  entrega: string
}

export const ajustesIniciales: Ajustes = {
  nombreTienda: 'Estudio Verde Hong',
  facebook: 'https://www.facebook.com/estudioverdehong',
  direccion: 'Madrid y Toledo',
  horario: 'Lunes a sábado, 10:00–18:00',
  entrega: 'Envío gratis para pedidos superiores a 30 € cerca de Toledo y 50 € en Madrid.',
}

export function leerAjustesLocales(): Ajustes {
  try {
    const guardados = localStorage.getItem(CLAVE_AJUSTES_LOCAL)
    if (!guardados) return ajustesIniciales

    const ajustes = JSON.parse(guardados) as Partial<Ajustes>
    return {
      ...ajustesIniciales,
      ...ajustes,
      facebook: ajustes.facebook || ajustesIniciales.facebook,
    }
  } catch {
    return ajustesIniciales
  }
}

export async function leerAjustes(): Promise<Ajustes> {
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 'general')
      .maybeSingle()

    if (error || !data) {
      return leerAjustesLocales()
    }

    const ajustes: Ajustes = {
      nombreTienda: data.nombre_tienda ?? ajustesIniciales.nombreTienda,
      facebook: data.facebook ?? ajustesIniciales.facebook,
      direccion: data.direccion ?? ajustesIniciales.direccion,
      horario: data.horario ?? ajustesIniciales.horario,
      entrega: data.entrega ?? ajustesIniciales.entrega,
    }

    localStorage.setItem(CLAVE_AJUSTES_LOCAL, JSON.stringify(ajustes))
    return ajustes
  } catch {
    return leerAjustesLocales()
  }
}

export async function guardarAjustes(ajustes: Ajustes): Promise<void> {
  localStorage.setItem(CLAVE_AJUSTES_LOCAL, JSON.stringify(ajustes))

  const { error } = await supabase.from('store_settings').upsert({
    id: 'general',
    nombre_tienda: ajustes.nombreTienda,
    facebook: ajustes.facebook,
    direccion: ajustes.direccion,
    horario: ajustes.horario,
    entrega: ajustes.entrega,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.warn('No se pudieron guardar los ajustes en Supabase, guardados localmente:', error.message)
    throw new Error(error.message)
  }
}

