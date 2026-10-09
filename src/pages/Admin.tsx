import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import type { User } from '@supabase/supabase-js'
import {
  AlertCircle,
  CheckCircle2,
  Database,
  ImagePlus,
  LayoutDashboard,
  Leaf,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Trash2,
  X,
} from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import type { AmbientePlanta, EstadoPlanta, Planta } from '../data/plants'
import {
  alternarEstadoPlanta,
  comprobarConexionSupabase,
  eliminarPlanta,
  guardarPlanta,
  inicializarCatalogoEnSupabase,
  usePlantas,
  subirImagenPlanta,
} from '../lib/catalogo'
import { guardarAjustes, leerAjustes, type Ajustes } from '../lib/ajustes'
import { supabase } from '../lib/supabase'

const CLAVE_SESION_PIN = 'estudio-verde-hong-admin-pin'
const CLAVE_ADMIN_PIN = '741013'

function crearBorrador(): Planta {
  return {
    id: crypto.randomUUID(),
    nombre: '',
    precio: 0,
    imagenes: [],
    ambiente: 'Interior',
    descripcion: '',
    estado: 'disponible',
    destacado: false,
  }
}

export function AdminLogin() {
  const [metodo, setMetodo] = useState<'supabase' | 'pin'>('supabase')
  const [email, setEmail] = useState('honglin@estudioverde.com')
  const [password, setPassword] = useState('')
  const [pin, setPin] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const navegar = useNavigate()

  const enviarSupabase = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setError('')
    setCargando(true)

    try {
      const { data, error: errorAuth } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (errorAuth) {
        if (errorAuth.message.includes('Invalid login credentials')) {
          setError('Email o contraseña incorrectos.')
        } else {
          setError(errorAuth.message)
        }
        return
      }

      if (data.session) {
        navegar('/admin', { replace: true })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con Supabase.')
    } finally {
      setCargando(false)
    }
  }

  const enviarPin = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    if (pin !== CLAVE_ADMIN_PIN) {
      setError('La clave no es correcta.')
      return
    }
    sessionStorage.setItem(CLAVE_SESION_PIN, 'activa')
    navegar('/admin', { replace: true })
  }

  return (
    <main className="grid min-h-screen place-items-center bg-secondary/15 px-5 py-12">
      <div className="w-full max-w-md border border-foreground/15 bg-background p-7 sm:p-9 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Estudio Verde Hong</p>
        <h1 className="font-display mt-2 text-3xl font-medium">Administración</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Panel de control con sincronización en tiempo real vía Supabase.
        </p>

        <div className="mt-6 flex border-b border-foreground/15">
          <button
            type="button"
            onClick={() => { setMetodo('supabase'); setError('') }}
            className={`flex-1 pb-3 text-xs font-medium tracking-wide uppercase transition-colors ${metodo === 'supabase' ? 'border-b-2 border-foreground text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Cuenta Supabase
          </button>
          <button
            type="button"
            onClick={() => { setMetodo('pin'); setError('') }}
            className={`flex-1 pb-3 text-xs font-medium tracking-wide uppercase transition-colors ${metodo === 'pin' ? 'border-b-2 border-foreground text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Clave PIN rápida
          </button>
        </div>

        {metodo === 'supabase' ? (
          <form onSubmit={enviarSupabase} className="mt-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="email">
              Correo del administrador
            </label>
            <input
              id="email"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              className="mt-1 min-h-11 w-full border border-foreground/25 bg-background px-3 text-sm outline-none focus:border-foreground"
              placeholder="honglin@estudioverde.com"
            />

            <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(evento) => setPassword(evento.target.value)}
              className="mt-1 min-h-11 w-full border border-foreground/25 bg-background px-3 text-sm outline-none focus:border-foreground"
              placeholder="••••••••"
            />

            {error && (
              <p className="mt-3 flex items-start gap-2 text-xs text-destructive">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-foreground px-4 text-sm font-medium text-primary-foreground hover:bg-foreground/90 disabled:opacity-50"
            >
              {cargando && <Loader2 className="size-4 animate-spin" />}
              {cargando ? 'Iniciando sesión...' : 'Entrar con Supabase'}
            </button>

            <div className="mt-5 border-t border-foreground/10 pt-4 text-xs text-muted-foreground leading-relaxed">
              <p>
                <strong>Nota:</strong> Este acceso sincroniza con Supabase mediante Row Level Security.
                Si aún no has creado tu usuario en Supabase, créalo en{' '}
                <span className="text-foreground font-mono">Authentication &gt; Users &gt; Add user</span>.
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={enviarPin} className="mt-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="clave">
              Clave PIN de acceso
            </label>
            <input
              id="clave"
              type="password"
              inputMode="numeric"
              autoFocus
              value={pin}
              onChange={(evento) => setPin(evento.target.value)}
              className="mt-1 min-h-11 w-full border border-foreground/25 bg-background px-3 text-sm outline-none focus:border-foreground"
              placeholder="741013"
            />

            {error && (
              <p className="mt-3 flex items-start gap-2 text-xs text-destructive">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </p>
            )}

            <button
              type="submit"
              className="mt-6 min-h-11 w-full bg-foreground px-4 text-sm font-medium text-primary-foreground hover:bg-foreground/90"
            >
              Entrar con PIN
            </button>

            <div className="mt-5 border-t border-foreground/10 pt-4 text-xs text-muted-foreground leading-relaxed">
              <p>
                El acceso con PIN te permite ver el panel localmente. Para guardar cambios en Supabase con RLS activo,
                es necesario iniciar sesión con tu cuenta de Supabase.
              </p>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}

export default function Admin() {
  const ubicacion = useLocation()
  const navegar = useNavigate()
  const [comprobando, setComprobando] = useState(true)
  const [usuario, setUsuario] = useState<User | null>(null)
  const [esPin, setEsPin] = useState(false)
  const [conexionSupabase, setConexionSupabase] = useState<{
    conectado: boolean
    total: number
    error?: string
  } | null>(null)

  useEffect(() => {
    let activo = true

    async function verificarAcceso() {
      const pinActivo = sessionStorage.getItem(CLAVE_SESION_PIN) === 'activa'
      setEsPin(pinActivo)

      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (activo) {
          setUsuario(session?.user ?? null)
        }
      } catch (err) {
        console.warn('Error al verificar sesión de Supabase:', err)
      } finally {
        if (activo) {
          setComprobando(false)
        }
      }

      comprobarConexionSupabase().then((res) => {
        if (activo) setConexionSupabase(res)
      })
    }

    void verificarAcceso()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evento, sesion) => {
      setUsuario(sesion?.user ?? null)
    })

    return () => {
      activo = false
      subscription.unsubscribe()
    }
  }, [])

  const cerrarSesion = async () => {
    sessionStorage.removeItem(CLAVE_SESION_PIN)
    await supabase.auth.signOut()
    navegar('/admin/login', { replace: true })
  }

  const recargarEstadoConexion = async () => {
    const res = await comprobarConexionSupabase()
    setConexionSupabase(res)
  }

  if (comprobando) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Loader2 className="size-5 animate-spin" />
          <span>Verificando autenticación...</span>
        </div>
      </div>
    )
  }

  if (!usuario && !esPin) {
    return <Navigate to="/admin/login" replace />
  }

  const vista = ubicacion.pathname.includes('/plantas')
    ? 'plantas'
    : ubicacion.pathname.includes('/ajustes')
      ? 'ajustes'
      : 'dashboard'

  return (
    <div className="min-h-screen bg-secondary/20">
      <BarraLateral
        vista={vista}
        usuario={usuario}
        conexion={conexionSupabase}
        alCerrarSesion={cerrarSesion}
      />
      <main className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-8 md:ml-64 md:px-10 md:py-10">
        {!usuario && esPin && (
          <div className="mb-6 flex items-start gap-3 border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-900 dark:text-amber-200">
            <AlertCircle className="size-4 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-medium">Modo local activo (Autenticado por PIN)</p>
              <p className="mt-0.5 opacity-90">
                Has iniciado sesión con el PIN local. Si has habilitado Row Level Security (RLS) en Supabase,
                para modificar y guardar datos es recomendable{' '}
                <button
                  type="button"
                  onClick={cerrarSesion}
                  className="underline underline-offset-2 font-semibold hover:opacity-80"
                >
                  iniciar sesión con tu cuenta de Supabase
                </button>
                .
              </p>
            </div>
          </div>
        )}

        {vista === 'dashboard' ? (
          <PanelDashboard
            conexion={conexionSupabase}
            alRecargarConexion={recargarEstadoConexion}
          />
        ) : vista === 'plantas' ? (
          <GestionPlantas />
        ) : (
          <PanelAjustes />
        )}
      </main>
      <NavegacionMovil vista={vista} />
    </div>
  )
}

function BarraLateral({
  vista,
  usuario,
  conexion,
  alCerrarSesion,
}: {
  vista: string
  usuario: User | null
  conexion: { conectado: boolean; total: number; error?: string } | null
  alCerrarSesion: () => void
}) {
  const enlaces = [
    { destino: '/admin', etiqueta: 'Dashboard', icono: LayoutDashboard, clave: 'dashboard' },
    { destino: '/admin/plantas', etiqueta: 'Plantas', icono: Leaf, clave: 'plantas' },
    { destino: '/admin/ajustes', etiqueta: 'Ajustes', icono: Settings, clave: 'ajustes' },
  ]

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-foreground/15 bg-background p-5 md:flex md:flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-lg font-medium">Estudio Verde</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Administración</p>
          </div>
          <Link
            to="/"
            target="_blank"
            className="text-xs border border-foreground/20 px-2 py-1 text-muted-foreground hover:text-foreground"
            title="Ver tienda en vivo"
          >
            Ver web ↗
          </Link>
        </div>

        <div className="mt-4 rounded-md border border-foreground/10 bg-secondary/30 p-2.5">
          <div className="flex items-center gap-2 text-xs">
            {conexion?.conectado ? (
              <>
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium text-emerald-800 dark:text-emerald-400">Supabase Activo</span>
              </>
            ) : (
              <>
                <span className="size-2 rounded-full bg-amber-500" />
                <span className="font-medium text-amber-800 dark:text-amber-400">Supabase Pendiente</span>
              </>
            )}
          </div>
          {usuario ? (
            <p className="mt-1 truncate text-[11px] text-muted-foreground" title={usuario.email}>
              {usuario.email}
            </p>
          ) : (
            <p className="mt-1 text-[11px] text-muted-foreground">Sesión con PIN local</p>
          )}
        </div>

        <nav className="mt-8 grid gap-1.5">
          {enlaces.map(({ destino, etiqueta, icono: Icono, clave }) => (
            <Link
              key={destino}
              to={destino}
              className={`flex min-h-10 items-center gap-3 px-3 text-sm font-medium transition-colors ${
                vista === clave
                  ? 'bg-foreground text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icono className="size-4" />
              {etiqueta}
            </Link>
          ))}
        </nav>
      </div>

      <button
        type="button"
        onClick={alCerrarSesion}
        className="flex min-h-11 items-center gap-3 border-t border-foreground/10 pt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <LogOut className="size-4" />
        Cerrar sesión
      </button>
    </aside>
  )
}

function NavegacionMovil({ vista }: { vista: string }) {
  const enlaces = [
    { destino: '/admin', etiqueta: 'Dashboard', icono: LayoutDashboard, clave: 'dashboard' },
    { destino: '/admin/plantas', etiqueta: 'Plantas', icono: Leaf, clave: 'plantas' },
    { destino: '/admin/ajustes', etiqueta: 'Ajustes', icono: Settings, clave: 'ajustes' },
  ]
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-foreground/15 bg-background md:hidden">
      {enlaces.map(({ destino, etiqueta, icono: Icono, clave }) => (
        <Link
          key={destino}
          to={destino}
          className={`flex min-h-14 flex-col items-center justify-center gap-1 text-xs ${
            vista === clave ? 'text-foreground font-semibold' : 'text-muted-foreground'
          }`}
        >
          <Icono className="size-4" />
          {etiqueta}
        </Link>
      ))}
    </nav>
  )
}

function PanelDashboard({
  conexion,
  alRecargarConexion,
}: {
  conexion: { conectado: boolean; total: number; error?: string } | null
  alRecargarConexion: () => Promise<void>
}) {
  const plantas = usePlantas()
  const [inicializando, setInicializando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const disponibles = plantas.filter((planta) => planta.estado === 'disponible').length
  const vendidas = plantas.filter((planta) => planta.estado === 'vendido').length
  const recientes = plantas.slice(-5).reverse()

  const poblarCatalogo = async () => {
    if (!window.confirm('¿Quieres cargar las 8 plantas iniciales en Supabase?')) return
    setInicializando(true)
    setMensaje('')
    try {
      await inicializarCatalogoEnSupabase()
      await alRecargarConexion()
      setMensaje('Catálogo inicial cargado con éxito en Supabase.')
    } catch (err) {
      setMensaje(`Error al inicializar catálogo: ${err instanceof Error ? err.message : 'Error desconocido'}`)
    } finally {
      setInicializando(false)
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Visión General</p>
          <h1 className="font-display mt-1 text-3xl font-medium sm:text-4xl">Dashboard</h1>
        </div>
        <button
          type="button"
          onClick={() => void alRecargarConexion()}
          className="inline-flex min-h-10 items-center gap-2 border border-foreground/20 bg-background px-3 text-xs font-medium hover:bg-secondary"
        >
          <RefreshCw className="size-3.5" />
          Comprobar Supabase
        </button>
      </div>

      {mensaje && (
        <div className="mt-4 border border-foreground/15 bg-background p-3 text-sm">
          {mensaje}
        </div>
      )}

      {/* Tarjeta de estado de Supabase */}
      <div className="mt-6 border border-foreground/15 bg-background p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`grid size-10 place-items-center rounded-full ${conexion?.conectado ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}>
              <Database className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm">Estado de la Base de Datos Supabase</h3>
                {conexion?.conectado ? (
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <CheckCircle2 className="size-3" /> Conectado ({conexion.total} en BD)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    <AlertCircle className="size-3" /> Pendiente configurar
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {conexion?.conectado
                  ? 'La tabla "plants" responde correctamente y sincroniza en tiempo real.'
                  : conexion?.error || 'Asegúrate de haber ejecutado el archivo supabase/schema.sql en el SQL Editor de Supabase.'}
              </p>
            </div>
          </div>

          {conexion?.conectado && conexion.total === 0 && (
            <button
              type="button"
              disabled={inicializando}
              onClick={() => void poblarCatalogo()}
              className="inline-flex min-h-10 items-center gap-2 bg-foreground px-4 text-xs font-medium text-primary-foreground hover:bg-foreground/90 disabled:opacity-50"
            >
              {inicializando && <Loader2 className="size-3.5 animate-spin" />}
              Cargar plantas iniciales en Supabase
            </button>
          )}
        </div>
      </div>

      {/* Métricas */}
      <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-5">
        {[
          { etiqueta: 'Total en catálogo', valor: plantas.length },
          { etiqueta: 'Disponibles', valor: disponibles },
          { etiqueta: 'Vendidas', valor: vendidas },
        ].map((dato) => (
          <div key={dato.etiqueta} className="border border-foreground/15 bg-background p-4 sm:p-6">
            <p className="text-xs text-muted-foreground sm:text-sm">{dato.etiqueta}</p>
            <p className="mt-2 text-2xl font-semibold sm:text-3xl">{dato.valor}</p>
          </div>
        ))}
      </div>

      {/* Plantas recientes */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-medium">Plantas recientes</h2>
          <Link to="/admin/plantas" className="text-xs font-medium underline underline-offset-4">
            Gestionar todas ({plantas.length})
          </Link>
        </div>
        <div className="mt-4 divide-y divide-foreground/10 border-y border-foreground/10 bg-background">
          {recientes.map((planta) => (
            <div key={planta.id} className="flex items-center gap-4 p-3">
              <img
                src={planta.imagenes[0] || '/plants/hero.jpg'}
                alt=""
                className="h-12 w-10 object-cover bg-secondary"
              />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{planta.nombre}</p>
                <p className="text-xs text-muted-foreground">
                  {planta.ambiente} · {planta.estado === 'disponible' ? 'Disponible' : 'Vendida'}
                </p>
              </div>
              <p className="text-sm font-medium">{planta.precio} €</p>
            </div>
          ))}
          {recientes.length === 0 && (
            <p className="p-4 text-center text-sm text-muted-foreground">No hay plantas registradas aún.</p>
          )}
        </div>
      </section>
    </section>
  )
}

function GestionPlantas() {
  const plantas = usePlantas()
  const [busqueda, establecerBusqueda] = useState('')
  const [filtro, establecerFiltro] = useState('Todo')
  const [edicion, establecerEdicion] = useState<Planta | null>(null)
  const [mensaje, establecerMensaje] = useState<{ texto: string; error?: boolean } | null>(null)
  const [procesandoId, setProcesandoId] = useState<string | null>(null)

  const filtradas = useMemo(
    () =>
      plantas.filter(
        (planta) =>
          planta.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
          (filtro === 'Todo' || planta.ambiente === filtro || planta.estado === filtro)
      ),
    [busqueda, filtro, plantas]
  )

  const notificar = (texto: string, error = false) => {
    establecerMensaje({ texto, error })
    window.setTimeout(() => establecerMensaje(null), 4000)
  }

  const borrar = async (id: string) => {
    const planta = plantas.find((elemento) => elemento.id === id)
    if (!planta) return
    if (!window.confirm(`¿Seguro que deseas eliminar "${planta.nombre}" de Supabase?`)) return

    setProcesandoId(id)
    try {
      await eliminarPlanta(id)
      notificar(`"${planta.nombre}" ha sido eliminada.`)
    } catch (err) {
      notificar(`Error al eliminar en Supabase: ${err instanceof Error ? err.message : 'Error desconocido'}`, true)
    } finally {
      setProcesandoId(null)
    }
  }

  const alternarEstado = async (planta: Planta) => {
    const nuevoEstado = planta.estado === 'disponible' ? 'vendido' : 'disponible'
    setProcesandoId(planta.id)
    try {
      await alternarEstadoPlanta(planta.id, nuevoEstado)
      notificar(`Estado de "${planta.nombre}" cambiado a ${nuevoEstado === 'disponible' ? 'Disponible' : 'Vendida'}.`)
    } catch (err) {
      notificar(`Error al actualizar estado en Supabase: ${err instanceof Error ? err.message : 'Error desconocido'}`, true)
    } finally {
      setProcesandoId(null)
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Catálogo</p>
          <h1 className="font-display mt-1 text-3xl font-medium sm:text-4xl">Plantas</h1>
        </div>
        <button
          type="button"
          onClick={() => establecerEdicion(crearBorrador())}
          className="inline-flex min-h-11 items-center gap-2 bg-foreground px-4 text-sm font-medium text-primary-foreground hover:bg-foreground/90"
        >
          <Plus className="size-4" />
          Añadir planta
        </button>
      </div>

      {mensaje && (
        <div
          role="status"
          className={`mt-5 flex items-center justify-between border px-4 py-3 text-sm ${
            mensaje.error
              ? 'border-destructive/30 bg-destructive/10 text-destructive'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
          }`}
        >
          <span>{mensaje.texto}</span>
          <button type="button" onClick={() => establecerMensaje(null)} aria-label="Cerrar">
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <input
          value={busqueda}
          onChange={(evento) => establecerBusqueda(evento.target.value)}
          placeholder="Buscar por nombre..."
          className="min-h-11 flex-1 border border-foreground/20 bg-background px-3 text-sm outline-none focus:border-foreground"
        />
        <select
          value={filtro}
          onChange={(evento) => establecerFiltro(evento.target.value)}
          className="min-h-11 border border-foreground/20 bg-background px-3 text-sm"
        >
          <option value="Todo">Todos los filtros</option>
          <option value="Interior">Interior</option>
          <option value="Exterior">Exterior</option>
          <option value="disponible">Disponibles</option>
          <option value="vendido">Vendidas</option>
        </select>
      </div>

      {edicion && (
        <FormularioPlanta
          planta={edicion}
          plantas={plantas}
          alCancelar={() => establecerEdicion(null)}
          alGuardado={(esNueva, nombre) => {
            establecerEdicion(null)
            notificar(esNueva ? `"${nombre}" añadida a Supabase con éxito.` : `"${nombre}" actualizada en Supabase.`)
          }}
          alError={(err) => notificar(err, true)}
        />
      )}

      <div className="mt-6 overflow-hidden border border-foreground/15 bg-background divide-y divide-foreground/10">
        {filtradas.map((planta) => {
          const ocupado = procesandoId === planta.id
          return (
            <div key={planta.id} className="flex items-center gap-3 p-3">
              <img
                src={planta.imagenes[0] || '/plants/hero.jpg'}
                alt=""
                className="h-16 w-14 shrink-0 object-cover bg-secondary"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{planta.nombre}</p>
                  {planta.destacado && (
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground uppercase font-semibold">
                      Destacada
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {planta.precio} € · {planta.ambiente} ·{' '}
                  <span className={planta.estado === 'disponible' ? 'text-emerald-600 font-medium' : 'text-amber-600'}>
                    {planta.estado === 'disponible' ? 'Disponible' : 'Vendida'}
                  </span>
                </p>
                <button
                  type="button"
                  disabled={ocupado}
                  onClick={() => void alternarEstado(planta)}
                  className="mt-1.5 text-xs underline underline-offset-4 hover:text-foreground text-muted-foreground disabled:opacity-50"
                >
                  {ocupado ? 'Actualizando...' : planta.estado === 'disponible' ? 'Marcar como vendida' : 'Marcar como disponible'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => establecerEdicion(planta)}
                disabled={ocupado}
                aria-label={`Editar ${planta.nombre}`}
                className="grid size-10 place-items-center border border-foreground/15 hover:bg-secondary disabled:opacity-50"
              >
                <Pencil className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => void borrar(planta.id)}
                disabled={ocupado}
                aria-label={`Eliminar ${planta.nombre}`}
                className="grid size-10 place-items-center border border-foreground/15 text-destructive hover:bg-destructive/10 disabled:opacity-50"
              >
                {ocupado ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              </button>
            </div>
          )
        })}
        {filtradas.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No se encontraron plantas que coincidan con la búsqueda.
          </div>
        )}
      </div>
    </section>
  )
}

function FormularioPlanta({
  planta,
  plantas,
  alCancelar,
  alGuardado,
  alError,
}: {
  planta: Planta
  plantas: Planta[]
  alCancelar: () => void
  alGuardado: (esNueva: boolean, nombre: string) => void
  alError: (mensaje: string) => void
}) {
  const esNueva = !plantas.some((elemento) => elemento.id === planta.id)
  const [borrador, establecerBorrador] = useState(planta)
  const [errorLocal, setErrorLocal] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [subiendoImagen, setSubiendoImagen] = useState(false)
  const [urlManual, setUrlManual] = useState('')

  const actualizar = <Clave extends keyof Planta>(clave: Clave, valor: Planta[Clave]) =>
    establecerBorrador((actual) => ({ ...actual, [clave]: valor }))

  const cargarArchivos = async (evento: ChangeEvent<HTMLInputElement>) => {
    const archivos = Array.from(evento.target.files ?? [])
    if (archivos.length === 0) return

    setSubiendoImagen(true)
    setErrorLocal('')

    try {
      const urlsSubidas: string[] = []
      for (const archivo of archivos) {
        const url = await subirImagenPlanta(archivo)
        urlsSubidas.push(url)
      }
      actualizar('imagenes', [...borrador.imagenes, ...urlsSubidas])
    } catch (err) {
      setErrorLocal('Hubo un error al procesar las imágenes.')
      console.error(err)
    } finally {
      setSubiendoImagen(false)
      evento.target.value = ''
    }
  }

  const agregarUrlManual = () => {
    const url = urlManual.trim()
    if (!url) return
    actualizar('imagenes', [...borrador.imagenes, url])
    setUrlManual('')
  }

  const moverImagen = (indice: number, direccion: -1 | 1) => {
    const destino = indice + direccion
    if (destino < 0 || destino >= borrador.imagenes.length) return
    const imagenes = [...borrador.imagenes]
    const elemento = imagenes[indice]
    imagenes[indice] = imagenes[destino]
    imagenes[destino] = elemento
    actualizar('imagenes', imagenes)
  }

  const eliminarImagen = (indice: number) => {
    actualizar('imagenes', borrador.imagenes.filter((_, posicion) => posicion !== indice))
  }

  const enviar = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setErrorLocal('')

    if (!borrador.nombre.trim()) {
      setErrorLocal('El nombre de la planta es obligatorio.')
      return
    }
    if (borrador.precio < 0) {
      setErrorLocal('El precio debe ser igual o superior a 0 €.')
      return
    }
    if (borrador.imagenes.length === 0) {
      setErrorLocal('Debes añadir al menos una imagen (subida o mediante URL).')
      return
    }

    setGuardando(true)
    try {
      await guardarPlanta(borrador)
      alGuardado(esNueva, borrador.nombre)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al guardar en Supabase.'
      setErrorLocal(msg)
      alError(`Error al guardar en Supabase: ${msg}`)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={enviar} className="mt-7 border border-foreground/15 bg-background p-5 sm:p-7 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-medium">
          {esNueva ? 'Añadir nueva planta' : `Editar: ${planta.nombre}`}
        </h2>
        <button type="button" onClick={alCancelar} aria-label="Cancelar" className="grid size-10 place-items-center">
          <X className="size-5" />
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Campo etiqueta="Nombre de la planta">
          <input
            required
            value={borrador.nombre}
            onChange={(evento) => actualizar('nombre', evento.target.value)}
            className="campo"
            placeholder="ej. Monstera Deliciosa"
          />
        </Campo>

        <Campo etiqueta="Precio (€)">
          <input
            type="number"
            min="0"
            step="0.01"
            required
            value={borrador.precio || ''}
            onChange={(evento) => actualizar('precio', Number(evento.target.value))}
            className="campo"
            placeholder="0"
          />
        </Campo>

        <Campo etiqueta="Ambiente">
          <select
            value={borrador.ambiente}
            onChange={(evento) => actualizar('ambiente', evento.target.value as AmbientePlanta)}
            className="campo"
          >
            <option value="Interior">Interior</option>
            <option value="Exterior">Exterior</option>
          </select>
        </Campo>

        <Campo etiqueta="Estado">
          <select
            value={borrador.estado}
            onChange={(evento) => actualizar('estado', evento.target.value as EstadoPlanta)}
            className="campo"
          >
            <option value="disponible">Disponible</option>
            <option value="vendido">Vendida</option>
          </select>
        </Campo>
      </div>

      <div className="mt-4">
        <Campo etiqueta="Descripción">
          <textarea
            value={borrador.descripcion}
            onChange={(evento) => actualizar('descripcion', evento.target.value)}
            rows={3}
            className="campo mt-1"
            placeholder="Breve descripción o cuidados..."
          />
        </Campo>
      </div>

      <label className="mt-5 flex min-h-11 items-center justify-between border-y border-foreground/10 py-3 text-sm font-medium">
        <span>Mostrar como destacada en la página de inicio</span>
        <input
          type="checkbox"
          checked={borrador.destacado}
          onChange={(evento) => actualizar('destacado', evento.target.checked)}
          className="size-4 accent-foreground"
        />
      </label>

      {/* Sección de imágenes */}
      <div className="mt-5">
        <p className="text-sm font-medium">Imágenes de la planta</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Sube fotos desde tu dispositivo (se guardarán en Supabase Storage) o añade un enlace directo.
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 border border-dashed border-foreground/30 bg-secondary/30 px-4 text-xs font-medium hover:bg-secondary">
            {subiendoImagen ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
            {subiendoImagen ? 'Procesando imágenes...' : 'Subir fotos desde archivo'}
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={subiendoImagen}
              onChange={cargarArchivos}
              className="sr-only"
            />
          </label>

          <div className="flex flex-1 min-w-[240px] gap-2">
            <input
              value={urlManual}
              onChange={(e) => setUrlManual(e.target.value)}
              placeholder="O pega una URL: /plants/foto.jpg o https://..."
              className="campo text-xs"
            />
            <button
              type="button"
              onClick={agregarUrlManual}
              className="min-h-11 border border-foreground/20 px-3 text-xs font-medium hover:bg-secondary shrink-0"
            >
              Añadir URL
            </button>
          </div>
        </div>

        {borrador.imagenes.length > 0 && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {borrador.imagenes.map((imagen, indice) => (
              <div key={`${imagen}-${indice}`} className="relative h-28 w-24 shrink-0 border border-foreground/20 bg-secondary">
                <img src={imagen} alt="" className="h-full w-full object-cover" />
                {indice === 0 && (
                  <span className="absolute top-1 left-1 bg-foreground text-primary-foreground text-[9px] px-1 font-semibold uppercase">
                    Portada
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 flex bg-background/90 divide-x divide-foreground/10 text-xs">
                  <button
                    type="button"
                    onClick={() => moverImagen(indice, -1)}
                    disabled={indice === 0}
                    className="flex-1 py-1 text-center hover:bg-secondary disabled:opacity-30"
                    title="Mover antes"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => moverImagen(indice, 1)}
                    disabled={indice === borrador.imagenes.length - 1}
                    className="flex-1 py-1 text-center hover:bg-secondary disabled:opacity-30"
                    title="Mover después"
                  >
                    →
                  </button>
                  <button
                    type="button"
                    onClick={() => eliminarImagen(indice)}
                    className="flex-1 py-1 text-center text-destructive hover:bg-destructive/10"
                    title="Eliminar foto"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {errorLocal && (
        <p className="mt-4 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorLocal}</span>
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={guardando || subiendoImagen}
          className="inline-flex min-h-11 items-center gap-2 bg-foreground px-5 text-sm font-medium text-primary-foreground hover:bg-foreground/90 disabled:opacity-50"
        >
          {guardando ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {guardando ? 'Guardando en Supabase...' : 'Guardar en Supabase'}
        </button>
        <button
          type="button"
          onClick={alCancelar}
          disabled={guardando}
          className="min-h-11 border border-foreground/20 px-4 text-sm hover:bg-secondary"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

function Campo({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium">
      <span className="block mb-1 text-xs uppercase tracking-wider text-muted-foreground">{etiqueta}</span>
      {children}
    </label>
  )
}

function PanelAjustes() {
  const [ajustes, setAjustes] = useState<Ajustes | null>(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<{ texto: string; error?: boolean } | null>(null)

  useEffect(() => {
    void leerAjustes().then((res) => {
      setAjustes(res)
      setCargando(false)
    })
  }, [])

  const guardar = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    if (!ajustes) return

    setGuardando(true)
    setMensaje(null)

    try {
      await guardarAjustes(ajustes)
      setMensaje({ texto: 'Ajustes guardados correctamente en Supabase y localmente.' })
    } catch (err) {
      setMensaje({
        texto: `Ajustes guardados localmente (aviso Supabase: ${err instanceof Error ? err.message : 'Error desconocido'})`,
        error: true,
      })
    } finally {
      setGuardando(false)
    }
  }

  if (cargando || !ajustes) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-10">
        <Loader2 className="size-4 animate-spin" />
        <span>Cargando configuración...</span>
      </div>
    )
  }

  return (
    <section>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Configuración</p>
        <h1 className="font-display mt-1 text-3xl font-medium sm:text-4xl">Ajustes</h1>
      </div>

      <form onSubmit={guardar} className="mt-8 max-w-2xl border border-foreground/15 bg-background p-5 sm:p-7 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo etiqueta="Nombre de la tienda">
            <input
              value={ajustes.nombreTienda}
              onChange={(evento) => setAjustes({ ...ajustes, nombreTienda: evento.target.value })}
              className="campo"
            />
          </Campo>
          <Campo etiqueta="Enlace de Facebook">
            <input
              value={ajustes.facebook}
              onChange={(evento) => setAjustes({ ...ajustes, facebook: evento.target.value })}
              className="campo"
            />
          </Campo>
        </div>

        <div className="mt-4">
          <Campo etiqueta="Dirección / Ubicación">
            <input
              value={ajustes.direccion}
              onChange={(evento) => setAjustes({ ...ajustes, direccion: evento.target.value })}
              className="campo mt-1"
            />
          </Campo>
        </div>

        <div className="mt-4">
          <Campo etiqueta="Horario de atención">
            <input
              value={ajustes.horario}
              onChange={(evento) => setAjustes({ ...ajustes, horario: evento.target.value })}
              className="campo mt-1"
            />
          </Campo>
        </div>

        <div className="mt-4">
          <Campo etiqueta="Información de recogida y entrega">
            <textarea
              value={ajustes.entrega}
              onChange={(evento) => setAjustes({ ...ajustes, entrega: evento.target.value })}
              rows={3}
              className="campo mt-1"
            />
          </Campo>
        </div>

        {mensaje && (
          <div
            role="status"
            className={`mt-4 border px-4 py-3 text-sm ${
              mensaje.error
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200'
                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        <button
          type="submit"
          disabled={guardando}
          className="mt-6 inline-flex min-h-11 items-center gap-2 bg-foreground px-5 text-sm font-medium text-primary-foreground hover:bg-foreground/90 disabled:opacity-50"
        >
          {guardando ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {guardando ? 'Guardando ajustes...' : 'Guardar ajustes'}
        </button>
      </form>
    </section>
  )
}
