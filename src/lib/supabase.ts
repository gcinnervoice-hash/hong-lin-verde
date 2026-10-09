import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL || 'https://vwhmigzmahtixjfvtnzj.supabase.co'
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_KZqylce91CMQcKv2cu4G4g_cgv40L-g'

if (!url || !publishableKey) {
  console.warn('Aviso: faltan las variables de entorno de Supabase (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY).')
}

export const supabase = createClient(url, publishableKey)
