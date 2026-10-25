import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  LuChevronDown,
  LuClock,
  LuFlame,
  LuImagePlus,
  LuMessageSquareText,
  LuRefreshCw,
  LuSearchX,
  LuTag,
  LuX,
} from "react-icons/lu";
import { API } from "../../config";
import { rutas } from "../../lib/rutas";
import { useAuth } from "../../auth/AuthContext";
import { CATEGORIAS } from "../../lib/categorias";
import Avatar from "../ui/Avatar";
import EstadoVacio from "../ui/EstadoVacio";
import { ListaEsqueletos } from "../ui/Esqueletos";
import PostCard from "./PostCard";

const ORDENES = [
  { valor: "recientes", texto: "Recientes", Icono: LuClock },
  { valor: "populares", texto: "Populares", Icono: LuFlame },
  { valor: "comentadas", texto: "Comentadas", Icono: LuMessageSquareText },
];

// Barra "crear publicación" al estilo Reddit
function CrearPublicacion() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="tarjeta flex items-center gap-3 p-3">
      <Avatar foto={user.foto_perfil} nombre={user.nombre_usuario} />
      <Link
        to={rutas.publicar}
        className="min-w-0 flex-1 truncate rounded-full border border-borde bg-superficie-2 px-4 py-2.5 text-sm text-suave transition hover:border-mar-300 hover:bg-superficie"
      >
        <span className="sm:hidden">¿Qué quieres publicar hoy?</span>
        <span className="hidden sm:inline">¿Qué quieres vender o compartir, {user.nombre_usuario}?</span>
      </Link>
      <Link to={rutas.publicar} className="btn-icono hidden sm:inline-flex" aria-label="Publicar con foto">
        <LuImagePlus className="size-5" />
      </Link>
    </div>
  );
}

const FILTROS_ESTADO = [
  { valor: "", texto: "Todos los estados" },
  { valor: "disponible", texto: "Solo disponibles" },
  { valor: "reservado", texto: "Reservados" },
  { valor: "vendido", texto: "Vendidos" },
];

// Lista de publicaciones con búsqueda (?q=), orden (?orden=), estado (?estado=) y categoría opcional
export default function Feed({ categoriaId }) {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const orden = ORDENES.some((o) => o.valor === params.get("orden")) ? params.get("orden") : "recientes";
  const estado = FILTROS_ESTADO.some((f) => f.valor && f.valor === params.get("estado")) ? params.get("estado") : "";
  const [publicaciones, setPublicaciones] = useState(null);
  const [error, setError] = useState(false);

  const cargar = useCallback(() => {
    setPublicaciones(null);
    setError(false);
    axios
      .get(`${API}/publicaciones`, { params: { search: q, orden, categoria: categoriaId, estado: estado || undefined } })
      .then(({ data }) => setPublicaciones(data))
      .catch(() => setError(true));
  }, [q, orden, categoriaId, estado]);

  useEffect(cargar, [cargar]);

  // Cambia un parámetro de la URL; el valor por defecto se quita para dejar la URL limpia
  const cambiarParametro = (nombre, valor, porDefecto) => {
    const nuevos = new URLSearchParams(params);
    if (!valor || valor === porDefecto) nuevos.delete(nombre);
    else nuevos.set(nombre, valor);
    setParams(nuevos);
  };

  return (
    <div className="space-y-4">
      {!categoriaId && !q && <CrearPublicacion />}

      {/* Orden y categorías */}
      <div className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1 rounded-full border border-borde bg-superficie p-1 shadow-tarjeta sm:w-fit">
            {ORDENES.map(({ valor, texto, Icono }) => (
              <button
                key={valor}
                type="button"
                onClick={() => cambiarParametro("orden", valor, "recientes")}
                aria-pressed={orden === valor}
                className={`flex min-w-0 flex-1 items-center justify-center gap-1 rounded-full px-2 py-1.5 text-[13px] font-semibold transition sm:flex-none sm:gap-1.5 sm:px-3.5 sm:text-sm ${
                  orden === valor ? "bg-mar-600 text-white shadow-sm" : "text-suave hover:text-texto"
                }`}
              >
                <Icono className="size-4 shrink-0" /> {texto}
              </button>
            ))}
          </div>
          <label className="relative sm:w-48">
            <span className="sr-only">Filtrar por estado</span>
            <LuTag className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-suave" />
            <select
              value={estado}
              onChange={(e) => cambiarParametro("estado", e.target.value, "")}
              className={`campo cursor-pointer appearance-none rounded-full bg-none py-2 pr-9 pl-9 font-medium shadow-tarjeta ${estado ? "border-mar-500 text-mar-700 dark:text-mar-300" : ""}`}
            >
              {FILTROS_ESTADO.map(({ valor, texto }) => (
                <option key={valor} value={valor}>
                  {texto}
                </option>
              ))}
            </select>
            <LuChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-suave" />
          </label>
        </div>

        {!categoriaId && (
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sin-scrollbar lg:mx-0 lg:flex-wrap lg:px-0">
            <Link to={rutas.inicio} className="chip chip-activo shrink-0">
              Todas
            </Link>
            {CATEGORIAS.map(({ id, nombre, Icono }) => (
              <Link key={id} to={rutas.categoria(id)} className="chip shrink-0">
                <Icono className="size-4" /> {nombre}
              </Link>
            ))}
          </div>
        )}
      </div>

      {q && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-suave">
            {publicaciones ? `${publicaciones.length} resultado${publicaciones.length === 1 ? "" : "s"}` : "Buscando"} para{" "}
            <span className="font-semibold text-texto">«{q}»</span>
          </p>
          <Link to={rutas.inicio} className="btn-fantasma px-3 py-1.5 text-xs">
            <LuX className="size-3.5" /> Limpiar
          </Link>
        </div>
      )}

      {error ? (
        <EstadoVacio Icono={LuRefreshCw} titulo="No se pudieron cargar las publicaciones" texto="Revisa tu conexión e inténtalo de nuevo.">
          <button type="button" onClick={cargar} className="btn-primario">
            Reintentar
          </button>
        </EstadoVacio>
      ) : publicaciones === null ? (
        <ListaEsqueletos />
      ) : publicaciones.length === 0 ? (
        <EstadoVacio
          Icono={LuSearchX}
          titulo={q ? "Sin resultados" : "Todavía no hay publicaciones"}
          texto={q ? "Prueba con otras palabras o revisa las categorías." : "¡Sé la primera persona en publicar aquí!"}
        >
          <Link to={rutas.publicar} className="btn-primario">
            Crear publicación
          </Link>
        </EstadoVacio>
      ) : (
        publicaciones.map((p) => (
          <PostCard
            key={p.publicacion_id}
            publicacion={p}
            alEliminar={() => setPublicaciones((lista) => lista.filter((x) => x.publicacion_id !== p.publicacion_id))}
          />
        ))
      )}
    </div>
  );
}
