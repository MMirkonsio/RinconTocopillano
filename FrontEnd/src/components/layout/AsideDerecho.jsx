import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { LuArrowBigUp, LuPlus, LuShieldCheck, LuTrendingUp } from "react-icons/lu";
import { API } from "../../config";
import { rutas } from "../../lib/rutas";
import { useAuth } from "../../auth/AuthContext";
import { formatearPrecio, imagenUrl } from "../../lib/formato";

const REGLAS = [
  "Publica fotos reales de lo que ofreces.",
  "Indica un precio claro (o «Gratis»).",
  "Trato respetuoso en comentarios.",
  "Nada ilegal, peligroso ni engañoso.",
  "Coordina entregas en lugares públicos.",
];

function Populares() {
  const [populares, setPopulares] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/publicaciones/populares`)
      .then(({ data }) => setPopulares(data.slice(0, 5)))
      .catch(() => setPopulares([]));
  }, []);

  if (populares?.length === 0) return null;

  return (
    <section className="tarjeta p-4">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-bold">
        <LuTrendingUp className="size-4 text-arena-500" /> Lo más votado
      </h2>
      <ol className="space-y-1">
        {(populares ?? Array.from({ length: 3 }, () => null)).map((p, i) =>
          p ? (
            <li key={p.publicacion_id}>
              <Link
                to={rutas.publicacion(p.publicacion_id, p.titulo)}
                className="-mx-2 flex items-center gap-3 rounded-xl p-2 transition hover:bg-superficie-2"
              >
                <img src={imagenUrl(p.imagen_contenido)} alt="" loading="lazy" className="size-12 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.titulo}</p>
                  <p className="mt-0.5 flex items-center gap-2 text-xs text-suave">
                    <span className="font-semibold text-arena-700 dark:text-arena-300">{formatearPrecio(p.precio)}</span>
                    <span className="flex items-center">
                      <LuArrowBigUp className="size-3.5" /> {p.likes}
                    </span>
                  </p>
                </div>
              </Link>
            </li>
          ) : (
            <li key={i} className="flex items-center gap-3 p-2">
              <div className="esqueleto size-12" />
              <div className="flex-1 space-y-2">
                <div className="esqueleto h-3 w-3/4" />
                <div className="esqueleto h-3 w-1/3" />
              </div>
            </li>
          )
        )}
      </ol>
    </section>
  );
}

// Columna derecha (escritorio ancho): presentación de la comunidad, populares y reglas
export default function AsideDerecho() {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <section className="tarjeta overflow-hidden">
        <img src="/images/tocopilla.jpg" alt="Vista de Tocopilla desde el cerro" className="h-24 w-full object-cover" />
        <div className="p-4">
          <h2 className="font-bold">Rincón Tocopillano</h2>
          <p className="mt-1 text-sm text-suave">
            El mercado de la comunidad: compra, vende y descubre lo que ofrecen tus vecinos en Tocopilla.
          </p>
          <Link to={user ? rutas.publicar : rutas.registro} className="btn-primario mt-4 w-full">
            <LuPlus className="size-4" /> {user ? "Crear publicación" : "Únete a la comunidad"}
          </Link>
        </div>
      </section>

      <Populares />

      <section className="tarjeta p-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold">
          <LuShieldCheck className="size-4 text-mar-600 dark:text-mar-300" /> Reglas de la comunidad
        </h2>
        <ol className="space-y-2 text-sm">
          {REGLAS.map((regla, i) => (
            <li key={regla} className="flex gap-2.5">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-superficie-2 text-xs font-semibold text-suave">
                {i + 1}
              </span>
              <span className="text-suave">{regla}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
