export const STUDIO_NAME = 'Estudio Verde Hong'

const FALLBACK_WHATSAPP_NUMBER = '34643424977'
const configuredWhatsAppNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, '')

// Set VITE_WHATSAPP_NUMBER in .env for the live business contact number.
export const WHATSAPP_NUMBER = configuredWhatsAppNumber || FALLBACK_WHATSAPP_NUMBER

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export const DEFAULT_MESSAGE =
  'Hola, he visto vuestras plantas en la web y me gustaria hacer una consulta.'
