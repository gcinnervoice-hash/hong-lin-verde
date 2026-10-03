import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { ImagePlus, LayoutDashboard, Leaf, LogOut, Pencil, Save, Settings, Trash2, X } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import type { AmbientePlanta, EstadoPlanta, Planta } from '../data/plants'
import { guardarPlantas, usePlantas } from '../lib/catalogo'

const CLAVE_SESION = 'estudio-verde-hong-admin'
const CLAVE_AJUSTES = 'estudio-verde-hong-ajustes'
const CLAVE_ADMIN = '741013'

interface Ajustes {
  nombreTienda: string
  facebook: string
  direccion: string
  horario: string
  entrega: string
}

const ajustesIniciales: Ajustes = {
  nombreTienda: 'Estudio Verde Hong',
  facebook: 'https://www.facebook.com/estudioverdehong',
  direccion: 'Madrid y Toledo',
  horario: 'Lunes a sábado, 10:00–18:00',
  entrega: 'Envío gratis para pedidos superiores a 30 € cerca de Toledo y 50 € en Madrid.',
}

function leerAjustes(): Ajustes {
  const guardados = localStorage.getItem(CLAVE_AJUSTES)
  if (!guardados) return ajustesIniciales

  const ajustes = JSON.parse(guardados) as Partial<Ajustes> & { whatsapp?: string }
  return {
    ...ajustesIniciales,
    ...ajustes,
    facebook: ajustes.facebook || 'https://www.facebook.com/estudioverdehong',
  }
}

function crearBorrador(): Planta {
  return { id: crypto.randomUUID(), nombre: '', precio: 0, imagenes: [], ambiente: 'Interior', descripcion: '', estado: 'disponible', destacado: false }
}

export function AdminLogin() {
  const [clave, establecerClave] = useState('')
  const [error, establecerError] = useState('')
  const navegar = useNavigate()
  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    if (clave !== CLAVE_ADMIN) {
      establecerError('La clave no es correcta.')
      return
    }
    sessionStorage.setItem(CLAVE_SESION, 'activa')
    navegar('/admin', { replace: true })
  }
  return <main className="grid min-h-screen place-items-center px-5"><form onSubmit={enviar} className="w-full max-w-sm border border-foreground/15 bg-background p-7 sm:p-9"><p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Estudio Verde Hong</p><h1 className="font-display mt-3 text-3xl font-medium">Administración</h1><label className="mt-8 block text-sm font-medium" htmlFor="clave">Clave de acceso</label><input id="clave" type="password" inputMode="numeric" autoFocus value={clave} onChange={(evento) => establecerClave(evento.target.value)} className="mt-2 min-h-11 w-full border border-foreground/25 bg-transparent px-3 outline-none focus:border-foreground" /><p className="mt-2 min-h-5 text-sm text-destructive">{error}</p><button className="mt-5 min-h-11 w-full bg-foreground px-4 text-sm font-medium text-primary-foreground">Entrar</button></form></main>
}

export default function Admin() {
  const ubicacion = useLocation()
  if (sessionStorage.getItem(CLAVE_SESION) !== 'activa') return <Navigate to="/admin/login" replace />
  const vista = ubicacion.pathname.includes('/plantas') ? 'plantas' : ubicacion.pathname.includes('/ajustes') ? 'ajustes' : 'dashboard'
  return <div className="min-h-screen bg-secondary/20"><BarraLateral vista={vista} /><main className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-8 md:ml-56 md:px-10 md:py-10">{vista === 'dashboard' ? <PanelDashboard /> : vista === 'plantas' ? <GestionPlantas /> : <PanelAjustes />}</main><NavegacionMovil vista={vista} /></div>
}

function BarraLateral({ vista }: { vista: string }) {
  const navegar = useNavigate()
  const enlaces = [{ destino: '/admin', etiqueta: 'Dashboard', icono: LayoutDashboard, clave: 'dashboard' }, { destino: '/admin/plantas', etiqueta: 'Plantas', icono: Leaf, clave: 'plantas' }, { destino: '/admin/ajustes', etiqueta: 'Ajustes', icono: Settings, clave: 'ajustes' }]
  return <aside className="fixed inset-y-0 left-0 hidden w-56 border-r border-foreground/15 bg-background p-5 md:block"><p className="font-display text-lg font-medium">Estudio Verde Hong</p><nav className="mt-10 grid gap-1">{enlaces.map(({ destino, etiqueta, icono: Icono, clave }) => <Link key={destino} to={destino} className={`flex min-h-11 items-center gap-3 px-3 text-sm ${vista === clave ? 'bg-foreground text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}><Icono className="size-4" />{etiqueta}</Link>)}</nav><button type="button" onClick={() => { sessionStorage.removeItem(CLAVE_SESION); navegar('/admin/login') }} className="absolute bottom-6 flex min-h-11 items-center gap-3 px-3 text-sm text-muted-foreground hover:text-foreground"><LogOut className="size-4" />Salir</button></aside>
}

function NavegacionMovil({ vista }: { vista: string }) {
  const enlaces = [{ destino: '/admin', etiqueta: 'Dashboard', icono: LayoutDashboard, clave: 'dashboard' }, { destino: '/admin/plantas', etiqueta: 'Plantas', icono: Leaf, clave: 'plantas' }, { destino: '/admin/ajustes', etiqueta: 'Ajustes', icono: Settings, clave: 'ajustes' }]
  return <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-foreground/15 bg-background md:hidden">{enlaces.map(({ destino, etiqueta, icono: Icono, clave }) => <Link key={destino} to={destino} className={`flex min-h-14 flex-col items-center justify-center gap-1 text-xs ${vista === clave ? 'text-foreground' : 'text-muted-foreground'}`}><Icono className="size-4" />{etiqueta}</Link>)}</nav>
}

function PanelDashboard() {
  const plantas = usePlantas()
  const disponibles = plantas.filter((planta) => planta.estado === 'disponible').length
  const vendidas = plantas.filter((planta) => planta.estado === 'vendido').length
  const recientes = plantas.slice(-4).reverse()
  return <section><p className="text-sm text-muted-foreground">Administración</p><h1 className="font-display mt-2 text-3xl font-medium sm:text-4xl">Dashboard</h1><div className="mt-8 grid grid-cols-3 gap-3 sm:gap-5">{[{ etiqueta: 'Plantas', valor: plantas.length }, { etiqueta: 'Disponibles', valor: disponibles }, { etiqueta: 'Vendidas', valor: vendidas }].map((dato) => <div key={dato.etiqueta} className="border border-foreground/15 bg-background p-4 sm:p-6"><p className="text-xs text-muted-foreground sm:text-sm">{dato.etiqueta}</p><p className="mt-3 text-2xl font-semibold sm:text-3xl">{dato.valor}</p></div>)}</div><section className="mt-10"><h2 className="font-display text-2xl font-medium">Añadidas recientemente</h2><div className="mt-4 divide-y divide-foreground/10 border-y border-foreground/10 bg-background">{recientes.map((planta) => <div key={planta.id} className="flex items-center gap-4 p-3"><img src={planta.imagenes[0]} alt="" className="h-12 w-10 object-cover" /><p className="flex-1 text-sm font-medium">{planta.nombre}</p><p className="text-sm">{planta.precio} €</p></div>)}</div></section></section>
}

function GestionPlantas() {
  const plantas = usePlantas()
  const [busqueda, establecerBusqueda] = useState('')
  const [filtro, establecerFiltro] = useState('Todo')
  const [edicion, establecerEdicion] = useState<Planta | null>(null)
  const [mensaje, establecerMensaje] = useState('')
  const filtradas = useMemo(() => plantas.filter((planta) => planta.nombre.toLowerCase().includes(busqueda.toLowerCase()) && (filtro === 'Todo' || planta.ambiente === filtro || planta.estado === filtro)), [busqueda, filtro, plantas])
  const notificar = (texto: string) => { establecerMensaje(texto); window.setTimeout(() => establecerMensaje(''), 3000) }
  const borrar = (id: string) => { const planta = plantas.find((elemento) => elemento.id === id); if (planta && window.confirm(`¿Eliminar ${planta.nombre}?`)) { guardarPlantas(plantas.filter((elemento) => elemento.id !== id)); notificar('Planta eliminada.') } }
  const alternarEstado = (id: string) => { guardarPlantas(plantas.map((planta) => planta.id === id ? { ...planta, estado: planta.estado === 'disponible' ? 'vendido' : 'disponible' } : planta)); notificar('Estado actualizado.') }
  return <section><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-muted-foreground">Catálogo</p><h1 className="font-display mt-2 text-3xl font-medium sm:text-4xl">Plantas</h1></div><button type="button" onClick={() => establecerEdicion(crearBorrador())} className="min-h-11 bg-foreground px-4 text-sm font-medium text-primary-foreground">Añadir planta</button></div>{mensaje && <p role="status" className="mt-5 border border-foreground/15 bg-background px-4 py-3 text-sm">{mensaje}</p>}<div className="mt-7 flex flex-col gap-3 sm:flex-row"><input value={busqueda} onChange={(evento) => establecerBusqueda(evento.target.value)} placeholder="Buscar por nombre" className="min-h-11 flex-1 border border-foreground/20 bg-background px-3 text-sm outline-none focus:border-foreground" /><select value={filtro} onChange={(evento) => establecerFiltro(evento.target.value)} className="min-h-11 border border-foreground/20 bg-background px-3 text-sm"><option>Todo</option><option>Interior</option><option>Exterior</option><option value="disponible">Disponible</option><option value="vendido">Vendida</option></select></div>{edicion && <FormularioPlanta planta={edicion} plantas={plantas} alCancelar={() => establecerEdicion(null)} alGuardar={(planta) => { const existe = plantas.some((elemento) => elemento.id === planta.id); guardarPlantas(existe ? plantas.map((elemento) => elemento.id === planta.id ? planta : elemento) : [...plantas, planta]); establecerEdicion(null); notificar(existe ? 'Planta actualizada.' : 'Planta añadida.') }} />}<div className="mt-6 overflow-hidden border border-foreground/15 bg-background">{filtradas.map((planta) => <div key={planta.id} className="flex items-center gap-3 border-b border-foreground/10 p-3 last:border-0"><img src={planta.imagenes[0]} alt="" className="h-16 w-14 object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{planta.nombre}</p><p className="mt-1 text-xs text-muted-foreground">{planta.precio} € · {planta.ambiente} · {planta.estado === 'disponible' ? 'Disponible' : 'Vendida'}</p><button type="button" onClick={() => alternarEstado(planta.id)} className="mt-2 text-xs underline underline-offset-4">{planta.estado === 'disponible' ? 'Marcar vendida' : 'Marcar disponible'}</button></div><button type="button" onClick={() => establecerEdicion(planta)} aria-label={`Editar ${planta.nombre}`} className="grid size-10 place-items-center border border-foreground/15"><Pencil className="size-4" /></button><button type="button" onClick={() => borrar(planta.id)} aria-label={`Eliminar ${planta.nombre}`} className="grid size-10 place-items-center border border-foreground/15 text-destructive"><Trash2 className="size-4" /></button></div>)}</div></section>
}

function FormularioPlanta({ planta, plantas, alCancelar, alGuardar }: { planta: Planta; plantas: Planta[]; alCancelar: () => void; alGuardar: (planta: Planta) => void }) {
  const [borrador, establecerBorrador] = useState(planta)
  const [error, establecerError] = useState('')
  const actualizar = <Clave extends keyof Planta>(clave: Clave, valor: Planta[Clave]) => establecerBorrador((actual) => ({ ...actual, [clave]: valor }))
  const cargarImagenes = async (evento: ChangeEvent<HTMLInputElement>) => { const archivos = Array.from(evento.target.files ?? []); const imagenes = await Promise.all(archivos.map((archivo) => new Promise<string>((resolver, rechazar) => { const lector = new FileReader(); lector.onload = () => resolver(String(lector.result)); lector.onerror = rechazar; lector.readAsDataURL(archivo) }))); actualizar('imagenes', [...borrador.imagenes, ...imagenes]) }
  const moverImagen = (indice: number, direccion: -1 | 1) => { const destino = indice + direccion; if (destino < 0 || destino >= borrador.imagenes.length) return; const imagenes = [...borrador.imagenes]; [imagenes[indice], imagenes[destino]] = [imagenes[destino], imagenes[indice]]; actualizar('imagenes', imagenes) }
  const enviar = (evento: FormEvent<HTMLFormElement>) => { evento.preventDefault(); if (!borrador.nombre.trim() || borrador.precio <= 0 || borrador.imagenes.length === 0) { establecerError('Añade nombre, precio y al menos una imagen.'); return } alGuardar(borrador) }
  return <form onSubmit={enviar} className="mt-7 border border-foreground/15 bg-background p-5 sm:p-7"><div className="flex items-center justify-between gap-4"><h2 className="font-display text-2xl font-medium">{plantas.some((elemento) => elemento.id === planta.id) ? 'Editar planta' : 'Añadir planta'}</h2><button type="button" onClick={alCancelar} aria-label="Cancelar" className="grid size-10 place-items-center"><X className="size-5" /></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><Campo etiqueta="Nombre"><input value={borrador.nombre} onChange={(evento) => actualizar('nombre', evento.target.value)} className="campo" /></Campo><Campo etiqueta="Precio"><input type="number" min="0" step="0.01" value={borrador.precio || ''} onChange={(evento) => actualizar('precio', Number(evento.target.value))} className="campo" /></Campo><Campo etiqueta="Ambiente"><select value={borrador.ambiente} onChange={(evento) => actualizar('ambiente', evento.target.value as AmbientePlanta)} className="campo"><option>Interior</option><option>Exterior</option></select></Campo><Campo etiqueta="Estado"><select value={borrador.estado} onChange={(evento) => actualizar('estado', evento.target.value as EstadoPlanta)} className="campo"><option value="disponible">Disponible</option><option value="vendido">Vendida</option></select></Campo></div><Campo etiqueta="Descripción"><textarea value={borrador.descripcion} onChange={(evento) => actualizar('descripcion', evento.target.value)} rows={3} className="campo mt-2" /></Campo><label className="mt-5 flex min-h-11 items-center justify-between border-y border-foreground/10 py-3 text-sm font-medium">Mostrar en inicio<input type="checkbox" checked={borrador.destacado} onChange={(evento) => actualizar('destacado', evento.target.checked)} className="size-4 accent-foreground" /></label><div className="mt-5"><label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 border border-dashed border-foreground/30 px-4 text-sm"><ImagePlus className="size-4" />Subir imágenes<input type="file" accept="image/*" multiple onChange={cargarImagenes} className="sr-only" /></label><div className="mt-3 flex gap-3 overflow-x-auto">{borrador.imagenes.map((imagen, indice) => <div key={imagen} className="relative h-24 w-20 shrink-0"><img src={imagen} alt="" className="h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 flex bg-background/90"><button type="button" onClick={() => moverImagen(indice, -1)} className="flex-1 text-xs" aria-label="Mover antes">←</button><button type="button" onClick={() => moverImagen(indice, 1)} className="flex-1 text-xs" aria-label="Mover después">→</button><button type="button" onClick={() => actualizar('imagenes', borrador.imagenes.filter((_, posicion) => posicion !== indice))} className="flex-1 text-xs text-destructive" aria-label="Eliminar imagen">×</button></div></div>)}</div></div><p className="mt-4 text-sm text-destructive">{error}</p><div className="mt-5 flex gap-3"><button type="submit" className="inline-flex min-h-11 items-center gap-2 bg-foreground px-4 text-sm font-medium text-primary-foreground"><Save className="size-4" />Guardar</button><button type="button" onClick={alCancelar} className="min-h-11 border border-foreground/20 px-4 text-sm">Cancelar</button></div></form>
}

function Campo({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium">{etiqueta}{children}</label>
}

function PanelAjustes() {
  const [ajustes, establecerAjustes] = useState(leerAjustes)
  const [mensaje, establecerMensaje] = useState('')
  const guardar = (evento: FormEvent<HTMLFormElement>) => { evento.preventDefault(); localStorage.setItem(CLAVE_AJUSTES, JSON.stringify(ajustes)); establecerMensaje('Ajustes guardados.') }
  return <section><p className="text-sm text-muted-foreground">Configuración</p><h1 className="font-display mt-2 text-3xl font-medium sm:text-4xl">Ajustes</h1><form onSubmit={guardar} className="mt-8 max-w-2xl border border-foreground/15 bg-background p-5 sm:p-7"><div className="grid gap-4 sm:grid-cols-2"><Campo etiqueta="Nombre de la tienda"><input value={ajustes.nombreTienda} onChange={(evento) => establecerAjustes({ ...ajustes, nombreTienda: evento.target.value })} className="campo" /></Campo><Campo etiqueta="Facebook"><input value={ajustes.facebook} onChange={(evento) => establecerAjustes({ ...ajustes, facebook: evento.target.value })} className="campo" /></Campo></div><Campo etiqueta="Dirección"><input value={ajustes.direccion} onChange={(evento) => establecerAjustes({ ...ajustes, direccion: evento.target.value })} className="campo mt-2" /></Campo><Campo etiqueta="Horario"><input value={ajustes.horario} onChange={(evento) => establecerAjustes({ ...ajustes, horario: evento.target.value })} className="campo mt-2" /></Campo><Campo etiqueta="Información de entrega"><textarea value={ajustes.entrega} onChange={(evento) => establecerAjustes({ ...ajustes, entrega: evento.target.value })} rows={3} className="campo mt-2" /></Campo>{mensaje && <p role="status" className="mt-4 text-sm">{mensaje}</p>}<button className="mt-6 inline-flex min-h-11 items-center gap-2 bg-foreground px-4 text-sm font-medium text-primary-foreground"><Save className="size-4" />Guardar</button></form></section>
}
