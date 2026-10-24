import { Link, useLocation } from "react-router-dom";
import { LuBell, LuBookmark, LuCircleHelp, LuFlame, LuHouse, LuPlus } from "react-icons/lu";
import { useAuth } from "../../auth/AuthContext";
import { CATEGORIAS } from "../../lib/categorias";
import { rutas } from "../../lib/rutas";

function ItemNav({ to, Icono, activo, children, onNavegar }) {
  return (
    <Link
      to={to}
      onClick={onNavegar}
      aria-current={activo ? "page" : undefined}
      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
        activo ? "bg-mar-50 text-mar-700 dark:bg-mar-500/10 dark:text-mar-300" : "text-texto hover:bg-superficie-2"
      }`}
    >
      {Icono && <Icono className={`size-5 ${activo ? "" : "text-suave"}`} />}
      {children}
    </Link>
  );
}

// Navegación principal y categorías. Se usa fija en escritorio y como panel en móvil.
export default function Sidebar({ onNavegar }) {
  const { user } = useAuth();
  const { pathname, search } = useLocation();
  const orden = new URLSearchParams(search).get("orden");
  const enInicio = pathname === "/";

  return (
    <nav className="flex flex-col gap-6" aria-label="Navegación principal">
      <div className="space-y-1">
        <ItemNav to={rutas.inicio} Icono={LuHouse} activo={enInicio && orden !== "populares"} onNavegar={onNavegar}>
          Inicio
        </ItemNav>
        <ItemNav to={rutas.populares} Icono={LuFlame} activo={enInicio && orden === "populares"} onNavegar={onNavegar}>
          Populares
        </ItemNav>
        {user && (
          <>
            <ItemNav to={rutas.guardados} Icono={LuBookmark} activo={pathname === rutas.guardados} onNavegar={onNavegar}>
              Guardados
            </ItemNav>
            <ItemNav
              to={rutas.notificaciones}
              Icono={LuBell}
              activo={pathname === rutas.notificaciones}
              onNavegar={onNavegar}
            >
              Notificaciones
            </ItemNav>
          </>
        )}
        <ItemNav to={rutas.ayuda} Icono={LuCircleHelp} activo={pathname === rutas.ayuda} onNavegar={onNavegar}>
          Ayuda
        </ItemNav>
      </div>

      <div>
        <h2 className="mb-2 px-3 text-xs font-semibold tracking-wider text-suave uppercase">Categorías</h2>
        <div className="space-y-0.5">
          {CATEGORIAS.map(({ id, nombre, Icono, color }) => {
            const activo = pathname === rutas.categoria(id);
            return (
              <Link
                key={id}
                to={rutas.categoria(id)}
                onClick={onNavegar}
                aria-current={activo ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-1.5 text-sm font-medium transition ${
                  activo ? "bg-superficie-2 text-texto" : "text-texto hover:bg-superficie-2"
                }`}
              >
                <span className={`flex size-7 items-center justify-center rounded-lg ${color}`}>
                  <Icono className="size-4" />
                </span>
                {nombre}
              </Link>
            );
          })}
        </div>
      </div>

      {!user && (
        <div className="rounded-2xl bg-linear-to-br from-mar-600 to-mar-800 p-4 text-white">
          <p className="font-semibold">¿Tienes algo para vender?</p>
          <p className="mt-1 text-sm text-mar-100">Crea tu cuenta gratis y publica en minutos.</p>
          <Link to={rutas.registro} onClick={onNavegar} className="btn mt-3 w-full bg-white text-mar-700 hover:bg-mar-50">
            <LuPlus className="size-4" /> Crear cuenta
          </Link>
        </div>
      )}

      <p className="px-3 text-xs text-suave">Hecho en Tocopilla 🌊 · {new Date().getFullYear()}</p>
    </nav>
  );
}
