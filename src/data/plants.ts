export type AmbientePlanta = 'Interior' | 'Exterior'
export type EstadoPlanta = 'disponible' | 'vendido'

export interface Planta {
  id: string
  nombre: string
  precio: number
  imagenes: string[]
  ambiente: AmbientePlanta
  descripcion: string
  estado: EstadoPlanta
  destacado: boolean
}

export const PLANTAS_INICIALES: Planta[] = [
  { id: 'monstera-deliciosa', nombre: 'Monstera Deliciosa', precio: 39, imagenes: ['/plants/monstera.jpg'], ambiente: 'Interior', descripcion: 'Una planta tropical de hojas grandes que aporta presencia y frescura a cualquier estancia.', estado: 'disponible', destacado: true },
  { id: 'ficus-lyrata', nombre: 'Ficus Lyrata', precio: 45, imagenes: ['/plants/ficus.jpg'], ambiente: 'Interior', descripcion: 'Hojas esculturales y un porte elegante para espacios luminosos y tranquilos.', estado: 'disponible', destacado: true },
  { id: 'sansevieria', nombre: 'Sansevieria', precio: 24, imagenes: ['/plants/sansevieria.jpg'], ambiente: 'Interior', descripcion: 'Resistente, vertical y muy sencilla de integrar en rincones con luz suave.', estado: 'vendido', destacado: false },
  { id: 'poto-dorado', nombre: 'Poto Dorado', precio: 18, imagenes: ['/plants/poto.jpg'], ambiente: 'Interior', descripcion: 'Una planta colgante y agradecida que llena de vida estanterías y repisas.', estado: 'disponible', destacado: true },
  { id: 'calathea-orbifolia', nombre: 'Calathea Orbifolia', precio: 32, imagenes: ['/plants/calathea.jpg'], ambiente: 'Interior', descripcion: 'Follaje decorativo de gran tamaño para interiores con luz indirecta.', estado: 'vendido', destacado: false },
  { id: 'aloe-vera', nombre: 'Aloe Vera', precio: 16, imagenes: ['/plants/aloe.jpg'], ambiente: 'Exterior', descripcion: 'Una suculenta sobria y luminosa, perfecta para balcones y terrazas soleadas.', estado: 'disponible', destacado: true },
  { id: 'palmera-areca', nombre: 'Palmera Areca', precio: 36, imagenes: ['/plants/areca.jpg'], ambiente: 'Interior', descripcion: 'Una palmera ligera y exuberante para aportar volumen verde a casa.', estado: 'disponible', destacado: false },
  { id: 'set-cactus-suculentas', nombre: 'Set de Cactus y Suculentas', precio: 28, imagenes: ['/plants/cactus.jpg'], ambiente: 'Exterior', descripcion: 'Una selección de plantas resistentes para llenar de textura un exterior soleado.', estado: 'disponible', destacado: false },
]

export function slugPlanta(planta: Planta): string {
  return planta.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
