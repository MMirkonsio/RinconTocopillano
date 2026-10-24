import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  LuBell,
  LuBookmark,
  LuChevronDown,
  LuCircleHelp,
  LuLogIn,
  LuLogOut,
  LuMenu,
  LuPencil,
  LuPlus,
  LuSearch,
  LuUser,
} from "react-icons/lu";
import { API } from "../../config";
import { rutas } from "../../lib/rutas";
import { useAuth } from "../../auth/AuthContext";
import { useClickFuera } from "../../lib/useClickFuera";
import Avatar from "../ui/Avatar";
import ToggleTema from "../ui/ToggleTema";
import Logo from "./Logo";

export function Buscador({ className = "" }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [texto, setTexto] = useState(params.get("q") ?? "");

  useEffect(() => setTexto(params.get("q") ?? ""), [params]);

  // En pantallas angostas el texto largo se corta: se usa uno más corto
  const [ancho, setAncho] = useState(() => matchMedia("(min-width: 640px)").matches);
  useEffect(() => {
    const consulta = matchMedia("(min-width: 640px)");
    const alCambiar = (e) => setAncho(e.matches);
    consulta.addEventListener("change", alCambiar);
    return () => consulta.removeEventListener("change", alCambiar);
  }, []);

  const buscar = (e) => {
    e.preventDefault();
    const q = texto.trim();
    navigate(rutas.buscar(q));
  };

  return (
    <form onSubmit={buscar} role="search" className={`relative ${className}`}>
      <LuSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-suave sm:left-3.5" />
      <input
        type="search"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder={ancho ? "Buscar en Tocopilla…" : "Buscar…"}
        aria-label="Buscar publicaciones"
        enterKeyHint="search"
        className="campo rounded-full bg-superficie-2 py-2 pr-3 pl-9 shadow-none focus:bg-superficie sm:pl-10"
      />
    </form>
  );
}

function MenuUsuario() {
  const { user, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);
  const cerrar = useCallback(() => setAbierto(false), []);
  const ref = useClickFuera(abierto, cerrar);

  const salir = async () => {
    cerrar();
    await cerrarSesion();
    navigate(rutas.iniciarSesion);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        className="flex items-center gap-1 rounded-full p-0.5 pr-1.5 transition hover:bg-superficie-2"
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-label="Menú de usuario"
      >
        <Avatar foto={user.foto_perfil} nombre={user.nombre_usuario} tamano="sm" />
        <LuChevronDown className="hidden size-4 text-suave sm:block" />
      </button>
      {abierto && (
        <div className="menu-flotante right-0 mt-2 w-60" role="menu">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <Avatar foto={user.foto_perfil} nombre={user.nombre_usuario} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.nombre_usuario}</p>
              <p className="truncate text-xs text-suave">{user.correo}</p>
            </div>
          </div>
          <div className="my-1 h-px bg-borde" />
          <Link to={rutas.usuario(user.nombre_usuario)} onClick={cerrar} className="menu-item" role="menuitem">
            <LuUser className="size-4 text-suave" /> Mi perfil
          </Link>
          <Link to={rutas.ajustes} onClick={cerrar} className="menu-item" role="menuitem">
            <LuPencil className="size-4 text-suave" /> Editar perfil
          </Link>
          <Link to={rutas.guardados} onClick={cerrar} className="menu-item" role="menuitem">
            <LuBookmark className="size-4 text-suave" /> Guardados
          </Link>
          <Link to={rutas.ayuda} onClick={cerrar} className="menu-item" role="menuitem">
            <LuCircleHelp className="size-4 text-suave" /> Ayuda
          </Link>
          <div className="my-1 h-px bg-borde" />
          <button type="button" onClick={salir} className="menu-item text-red-600 dark:text-red-400" role="menuitem">
            <LuLogOut className="size-4" /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

function Campana() {
  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    axios
      .get(`${API}/notificaciones/total`)
      .then(({ data }) => setCantidad(data.total_notificaciones))
      .catch(() => {});
  }, []);

  return (
    <Link
      to={rutas.notificaciones}
      className="btn-icono relative"
      aria-label={cantidad ? `Notificaciones (${cantidad})` : "Notificaciones"}
      title="Notificaciones"
    >
      <LuBell className="size-5" />
      {cantidad > 0 && (
        <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-arena-500 px-1 text-[10px] font-bold text-white ring-2 ring-superficie">
          {cantidad > 9 ? "9+" : cantidad}
        </span>
      )}
    </Link>
  );
}

export default function Header({ onAbrirMenu }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-borde bg-superficie/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:gap-3">
        <button type="button" onClick={onAbrirMenu} className="btn-icono -ml-2 lg:hidden" aria-label="Abrir menú">
          <LuMenu className="size-5" />
        </button>
        <Logo />

        {/* En móvil ocupa el espacio libre de la cabecera; en escritorio queda centrado */}
        <Buscador className="min-w-0 flex-1 md:mx-auto md:max-w-xl" />

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {user && (
            <Link to={rutas.publicar} className="btn-primario hidden sm:inline-flex">
              <LuPlus className="size-4" /> Publicar
            </Link>
          )}
          {/* En móvil el cambio de tema está en el menú lateral, para dejar sitio al buscador */}
          <div className="hidden sm:block">
            <ToggleTema />
          </div>
          {user ? (
            <>
              <Campana />
              <MenuUsuario />
            </>
          ) : (
            <>
              <Link to={rutas.iniciarSesion} className="btn-fantasma hidden sm:inline-flex">
                Iniciar sesión
              </Link>
              <Link to={rutas.registro} className="btn-primario hidden sm:inline-flex">
                Crear cuenta
              </Link>
              <Link to={rutas.iniciarSesion} className="btn-icono sm:hidden" aria-label="Iniciar sesión">
                <LuLogIn className="size-5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
