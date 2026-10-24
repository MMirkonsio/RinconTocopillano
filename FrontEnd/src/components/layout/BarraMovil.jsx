import { Link, useLocation } from "react-router-dom";
import { LuBookmark, LuCircleHelp, LuHouse, LuLayoutGrid, LuLogIn, LuPlus, LuUser } from "react-icons/lu";
import { useAuth } from "../../auth/AuthContext";
import { rutas } from "../../lib/rutas";

function Pestana({ to, onClick, Icono, texto, activo }) {
  const clases = `flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition ${
    activo ? "text-mar-600 dark:text-mar-300" : "text-suave"
  }`;
  const contenido = (
    <>
      <Icono className="size-5" />
      {texto}
    </>
  );
  return onClick ? (
    <button type="button" onClick={onClick} className={clases}>
      {contenido}
    </button>
  ) : (
    <Link to={to} className={clases} aria-current={activo ? "page" : undefined}>
      {contenido}
    </Link>
  );
}

// Barra de pestañas inferior en móvil
export default function BarraMovil({ onAbrirMenu }) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-borde bg-superficie/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      aria-label="Navegación móvil"
    >
      <div className="mx-auto flex max-w-md items-end">
        <Pestana to={rutas.inicio} Icono={LuHouse} texto="Inicio" activo={pathname === "/"} />
        <Pestana onClick={onAbrirMenu} Icono={LuLayoutGrid} texto="Categorías" />
        <div className="flex flex-1 justify-center">
          <Link
            to={user ? rutas.publicar : rutas.iniciarSesion}
            className="-mt-5 flex size-14 items-center justify-center rounded-full bg-mar-600 text-white shadow-lg ring-4 shadow-mar-700/30 ring-fondo transition active:scale-95"
            aria-label="Publicar"
          >
            <LuPlus className="size-6" />
          </Link>
        </div>
        {user ? (
          <>
            <Pestana to={rutas.guardados} Icono={LuBookmark} texto="Guardados" activo={pathname === rutas.guardados} />
            <Pestana to={rutas.usuario(user.nombre_usuario)} Icono={LuUser} texto="Perfil" activo={pathname === rutas.usuario(user.nombre_usuario)} />
          </>
        ) : (
          <>
            <Pestana to={rutas.ayuda} Icono={LuCircleHelp} texto="Ayuda" activo={pathname === rutas.ayuda} />
            <Pestana to={rutas.iniciarSesion} Icono={LuLogIn} texto="Entrar" activo={pathname === rutas.iniciarSesion} />
          </>
        )}
      </div>
    </nav>
  );
}
