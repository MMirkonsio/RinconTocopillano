import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuMessageCircle } from "react-icons/lu";
import { useAuth } from "../../auth/AuthContext";
import { categoriaPorId } from "../../lib/categorias";
import { fechaCompleta, formatearPrecio, imagenUrl, tiempoRelativo } from "../../lib/formato";
import { EtiquetaEstado } from "../../lib/estados";
import { rutas } from "../../lib/rutas";
import Avatar from "../ui/Avatar";
import Lightbox from "./Lightbox";
import Carrusel from "./Carrusel";
import { Compartir, Guardar, MenuPropietario, Votos } from "./Acciones";

export function ChipCategoria({ categoriaId, pequeno = false }) {
  const { id, nombre, Icono, color } = categoriaPorId(categoriaId);
  return (
    <Link
      to={rutas.categoria(id)}
      className={`inline-flex items-center gap-1 rounded-full font-semibold transition hover:opacity-80 ${color} ${
        pequeno ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      <Icono className={pequeno ? "size-3" : "size-3.5"} />
      {nombre}
    </Link>
  );
}

// Tarjeta de una publicación. En el feed enlaza al detalle; en el detalle muestra todo.
export default function PostCard({ publicacion: p, detalle = false, alEliminar }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  // Índice de la foto abierta en pantalla completa (null = cerrada)
  const [ampliada, setAmpliada] = useState(null);
  const [estado, setEstado] = useState(p.estado ?? "disponible");
  const vendido = estado === "vendido";
  const urlDetalle = rutas.publicacion(p.publicacion_id, p.titulo);
  const imagenes = p.imagenes?.length ? p.imagenes : p.imagen_contenido ? [p.imagen_contenido] : [];
  const Titulo = detalle ? "h1" : "h2";
  const cerrarVisor = useCallback(() => setAmpliada(null), []);

  return (
    <article className="tarjeta overflow-hidden transition hover:border-mar-200 dark:hover:border-mar-900">
      <div className="px-4 pt-4 sm:px-5">
        <div className="flex items-start gap-3">
          <Link to={rutas.usuario(p.nombre_usuario)} className="shrink-0">
            <Avatar foto={p.foto_perfil} nombre={p.nombre_usuario} />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <Link to={rutas.usuario(p.nombre_usuario)} className="truncate text-sm font-semibold hover:underline">
                {p.nombre_usuario}
              </Link>
              <span className="text-xs text-suave" title={fechaCompleta(p.tiempo_publicacion)}>
                {tiempoRelativo(p.tiempo_publicacion)}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <ChipCategoria categoriaId={p.categoria_id} pequeno />
              <EtiquetaEstado estado={estado} />
            </div>
          </div>
          {user?.id === p.usuario_id && (
            <MenuPropietario
              publicacionId={p.publicacion_id}
              estado={estado}
              alCambiarEstado={setEstado}
              alEliminar={alEliminar}
            />
          )}
        </div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <Titulo className={`font-bold tracking-tight break-words ${detalle ? "text-2xl" : "text-lg leading-snug"}`}>
            {detalle ? (
              p.titulo
            ) : (
              <Link to={urlDetalle} className="hover:text-mar-700 dark:hover:text-mar-300">
                {p.titulo}
              </Link>
            )}
          </Titulo>
          <span className={`precio mt-0.5 shrink-0 ${vendido ? "line-through opacity-60" : ""}`}>
            {formatearPrecio(p.precio)}
          </span>
        </div>
        <p
          className={`mt-1.5 text-[15px] leading-relaxed break-words text-suave ${
            detalle ? "whitespace-pre-line" : "line-clamp-3"
          }`}
        >
          {p.contenido}
        </p>
      </div>

      {imagenes.length > 0 && (
        <div className={`relative mt-3 overflow-hidden ${detalle ? "" : "sm:mx-5 sm:rounded-xl"}`}>
          <Carrusel
            imagenes={imagenes}
            titulo={p.titulo}
            alto={detalle ? "aspect-[4/3] max-h-[36rem]" : "aspect-[4/3] max-h-[26rem]"}
            gris={vendido}
            alAbrir={(i) => (detalle ? setAmpliada(i) : navigate(urlDetalle))}
            etiquetaAbrir={detalle ? undefined : `Ver ${p.titulo}`}
          />
          {vendido && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/35">
              <span className="-rotate-6 rounded-xl border-2 border-white/90 bg-slate-950/70 px-5 py-1.5 text-lg font-extrabold tracking-[0.2em] text-white uppercase shadow-lg">
                Vendido
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 px-4 py-3 sm:px-5">
        <Votos publicacionId={p.publicacion_id} total={p.total_votos} miVoto={p.mi_voto} />
        <Link to={urlDetalle} className="accion" aria-label={`${p.total_comentarios ?? 0} comentarios`}>
          <LuMessageCircle className="size-4" />
          {p.total_comentarios ?? 0}
        </Link>
        <Compartir publicacionId={p.publicacion_id} titulo={p.titulo} />
        <div className="ml-auto">
          <Guardar publicacionId={p.publicacion_id} guardado={p.guardado} />
        </div>
      </div>

      {ampliada !== null && (
        <Lightbox imagenes={imagenes.map(imagenUrl)} inicio={ampliada} alt={p.titulo} alCerrar={cerrarVisor} />
      )}
    </article>
  );
}
