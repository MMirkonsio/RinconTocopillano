import { Link } from "react-router-dom";
import { LuImages } from "react-icons/lu";
import { formatearPrecio, imagenUrl, tiempoRelativo } from "../../lib/formato";
import { categoriaPorId } from "../../lib/categorias";
import { EtiquetaEstado } from "../../lib/estados";
import { rutas } from "../../lib/rutas";

// Tarjeta compacta para grillas (perfil, guardados)
export default function PostMini({ publicacion: p, accion }) {
  const { Icono, color } = categoriaPorId(p.categoria_id);
  const vendido = p.estado === "vendido";
  const cantidadFotos = p.imagenes?.length ?? p.total_imagenes ?? 1;

  return (
    <div className="group tarjeta relative overflow-hidden transition hover:-translate-y-0.5 hover:shadow-flotante">
      <Link to={rutas.publicacion(p.publicacion_id, p.titulo)} className="block">
        <div className="relative aspect-square overflow-hidden bg-superficie-2">
          <img
            src={imagenUrl(p.imagen_contenido)}
            alt={p.titulo}
            loading="lazy"
            className={`size-full object-cover transition duration-300 group-hover:scale-105 ${vendido ? "grayscale" : ""}`}
          />
          <span className={`absolute top-2 left-2 flex size-7 items-center justify-center rounded-lg shadow-sm ${color}`}>
            <Icono className="size-4" />
          </span>
          <EtiquetaEstado estado={p.estado} className="absolute bottom-2 left-2 shadow-sm" />
          {cantidadFotos > 1 && (
            <span
              className="absolute right-2 bottom-2 flex items-center gap-1 rounded-full bg-slate-950/60 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm"
              title={`${cantidadFotos} fotos`}
            >
              <LuImages className="size-3" /> {cantidadFotos}
            </span>
          )}
        </div>
        <div className="p-3">
          <p className="truncate text-sm font-semibold">{p.titulo}</p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className={`text-sm font-bold text-arena-700 dark:text-arena-300 ${vendido ? "line-through opacity-60" : ""}`}>
              {formatearPrecio(p.precio)}
            </span>
            <span className="truncate text-xs text-suave">{tiempoRelativo(p.tiempo_publicacion)}</span>
          </div>
        </div>
      </Link>
      {accion && <div className="absolute top-2 right-2">{accion}</div>}
    </div>
  );
}
