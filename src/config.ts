export const STUDIO_NAME = 'Estudio Verde Hong'

export const WHATSAPP_NUMBER = '+34 643 42 49 77'
export const FACEBOOK_URL = 'https://www.facebook.com/share/1EntaEhMxj/?mibextid=wwXIfr'
const WHATSAPP_PHONE = '34643424977'

export function whatsappLink(message?: string): string {
  const url = `https://wa.me/${WHATSAPP_PHONE}`
  return message ? `${url}?text=${encodeURIComponent(message)}` : url
}

export function facebookLink(): string {
  return FACEBOOK_URL
}

export const DEFAULT_MESSAGE =
  'Hola, he visto vuestras plantas en la web y me gustaria hacer una consulta.'
