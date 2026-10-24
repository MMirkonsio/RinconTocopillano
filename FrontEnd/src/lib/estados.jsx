/* eslint-disable react-refresh/only-export-components */
import { LuCircleCheck, LuClock, LuHandshake } from "react-icons/lu";

// Mismos valores que la columna `publicaciones.estado`
export const ESTADOS = {
  disponible: {
    texto: "Disponible",
    aviso: "Publicación marcada como disponible",
    Icono: LuCircleCheck,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  reservado: {
    texto: "Reservado",
    aviso: "Publicación marcada como reservada",
    Icono: LuClock,
    color: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  },
  vendido: {
    texto: "Vendido",
    aviso: "¡Felicitaciones por la venta! Publicación marcada como vendida",
    Icono: LuHandshake,
    color: "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900",
  },
};

export const estadoDe = (valor) => ESTADOS[valor] ?? ESTADOS.disponible;

// Etiqueta compacta. No se muestra para "disponible" (es lo normal) salvo que se pida.
export function EtiquetaEstado({ estado, mostrarDisponible = false, className = "" }) {
  if (!estado || (estado === "disponible" && !mostrarDisponible)) return null;
  const { texto, Icono, color } = estadoDe(estado);
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase ${color} ${className}`}>
      <Icono className="size-3" /> {texto}
    </span>
  );
}
