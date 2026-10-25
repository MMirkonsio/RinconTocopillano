import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { LuX } from "react-icons/lu";
import Header from "./Header";
import Sidebar from "./Sidebar";
import BarraMovil from "./BarraMovil";
import AsideDerecho from "./AsideDerecho";
import Logo from "./Logo";
import ToggleTema from "../ui/ToggleTema";

// Estructura común de las páginas: cabecera, menú lateral, contenido y (opcional) columna derecha
export default function AppLayout({ children, conAside = true }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const cerrarMenu = useCallback(() => setMenuAbierto(false), []);
  const { pathname, search } = useLocation();

  // Volver arriba al cambiar de página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  // Bloquear el scroll del fondo con el panel móvil abierto
  useEffect(() => {
    document.body.style.overflow = menuAbierto ? "hidden" : "";
    if (!menuAbierto) return;
    const alTecla = (e) => e.key === "Escape" && cerrarMenu();
    document.addEventListener("keydown", alTecla);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", alTecla);
    };
  }, [menuAbierto, cerrarMenu]);

  return (
    <div className="min-h-dvh">
      <Header onAbrirMenu={() => setMenuAbierto(true)} />

      <div
        className={`mx-auto grid max-w-7xl gap-6 px-4 pt-4 pb-28 sm:pt-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:pb-12 ${
          conAside ? "xl:grid-cols-[15rem_minmax(0,1fr)_20rem]" : ""
        }`}
      >
        <aside className="hidden lg:block">
          <div className="sticky top-22 max-h-[calc(100dvh-6rem)] overflow-y-auto pb-4 sin-scrollbar">
            <Sidebar />
          </div>
        </aside>

        <main className="min-w-0">{children}</main>

        {conAside && (
          <aside className="hidden xl:block">
            <div className="sticky top-22">
              <AsideDerecho />
            </div>
          </aside>
        )}
      </div>

      <BarraMovil onAbrirMenu={() => setMenuAbierto(true)} />

      {/* Panel lateral en móvil */}
      {menuAbierto && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={cerrarMenu} />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] animate-aparecer flex-col bg-superficie shadow-flotante">
            <div className="flex h-16 items-center justify-between border-b border-borde px-4">
              <Logo />
              <div className="flex items-center gap-1">
                <ToggleTema />
                <button type="button" onClick={cerrarMenu} className="btn-icono" aria-label="Cerrar menú">
                  <LuX className="size-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <Sidebar onNavegar={cerrarMenu} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
