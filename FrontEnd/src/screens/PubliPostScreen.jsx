import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LuArrowLeft, LuCalendar, LuClock, LuHandshake, LuMessageCircle, LuSearchX, LuUser } from "react-icons/lu";
import { API } from "../config";
import { rutas } from "../lib/rutas";
import { useTitulo } from "../lib/useTitulo";
import { useAuth } from "../auth/AuthContext";
import { enlaceWhatsApp, fechaCompleta, formatearPrecio } from "../lib/formato";
import AppLayout from "../components/layout/AppLayout";
import PostCard from "../components/posts/PostCard";
import Comentarios from "../components/posts/Comentarios";
import Avatar from "../components/ui/Avatar";
import EstadoVacio from "../components/ui/EstadoVacio";
import { PostEsqueleto } from "../components/ui/Esqueletos";

// Ícono de WhatsApp (no está en Lucide)
const IconoWhatsApp = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.04 21.5h-.01a9.43 9.43 0 0 1-4.8-1.32l-.35-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44a9.38 9.38 0 0 1 6.68 2.77 9.38 9.38 0 0 1 2.76 6.68c0 5.21-4.24 9.44-9.45 9.44m8.04-17.48A11.3 11.3 0 0 0 12.04.7C5.77.7.67 5.8.67 12.06c0 2 .52 3.96 1.52 5.68L.57 23.3l5.7-1.5a11.33 11.33 0 0 0 5.77 1.47h.01c6.26 0 11.36-5.1 11.36-11.36 0-3.04-1.18-5.89-3.33-8.03" />
  </svg>
);

function Vendedor({ p }) {
  const { user } = useAuth();
  const esPropia = user?.id === p.usuario_id;
  const whatsapp = enlaceWhatsApp(
    p.telefono,
    `Hola ${p.nombre_usuario}, vi tu publicación "${p.titulo}" (${formatearPrecio(p.precio)}) en Rincón Tocopillano. ¿Sigue disponible?`
  );

  return (
    <section className="tarjeta p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <Avatar foto={p.foto_perfil} nombre={p.nombre_usuario} tamano="lg" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium tracking-wide text-suave uppercase">{esPropia ? "Tu publicación" : "Publicado por"}</p>
          <p className="truncate text-lg font-bold">{p.nombre_usuario}</p>
          <p className="flex items-center gap-1 text-xs text-suave">
            <LuCalendar className="size-3.5" /> {fechaCompleta(p.tiempo_publicacion)}
          </p>
        </div>
      </div>
      {!esPropia && p.estado === "vendido" && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-superficie-2 p-3 text-sm text-suave">
          <LuHandshake className="size-4 shrink-0" /> Este producto ya se vendió. Revisa el perfil por si tiene algo parecido.
        </p>
      )}
      {!esPropia && p.estado === "reservado" && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
          <LuClock className="size-4 shrink-0" /> Está reservado, pero puedes escribir por si se libera.
        </p>
      )}
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {!esPropia && p.estado !== "vendido" && whatsapp && (
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn bg-[#25D366] text-white hover:bg-[#1ebe5b]">
            <IconoWhatsApp className="size-4" /> Contactar por WhatsApp
          </a>
        )}
        {!esPropia && p.estado !== "vendido" && !whatsapp && (
          <a href="#titulo-comentarios" className="btn-primario">
            <LuMessageCircle className="size-4" /> Preguntar en comentarios
          </a>
        )}
        <Link
          to={rutas.usuario(p.nombre_usuario)}
          className={`btn-secundario ${esPropia || p.estado === "vendido" ? "sm:col-span-2" : ""}`}
        >
          <LuUser className="size-4" /> {esPropia ? "Ver mi perfil" : "Ver perfil y más publicaciones"}
        </Link>
      </div>
    </section>
  );
}

const PubliPostScreen = () => {
  const { publicacion_id, slug } = useParams();
  const navigate = useNavigate();
  const { search, hash } = useLocation();
  const [publicacion, setPublicacion] = useState(null);
  const [noExiste, setNoExiste] = useState(false);

  useEffect(() => {
    let vigente = true; // ignora la respuesta si mientras tanto se abrió otra publicación
    setPublicacion(null);
    setNoExiste(false);
    axios
      .get(`${API}/publicaciones/${publicacion_id}`)
      .then(({ data }) => vigente && setPublicacion(data))
      .catch(() => vigente && setNoExiste(true));
    return () => {
      vigente = false;
    };
  }, [publicacion_id]);

  // URL canónica: /publicacion/66/completos-italianos. Si el texto del final falta, está
  // desactualizado (se cambió el título) o es un enlace antiguo (/comments), se corrige.
  useEffect(() => {
    // Al pasar de una publicación a otra, `publicacion` aún tiene la anterior por un momento
    if (!publicacion || String(publicacion.publicacion_id) !== publicacion_id) return;
    const canonica = rutas.publicacion(publicacion.publicacion_id, publicacion.titulo);
    if (canonica !== rutas.publicacion(publicacion_id, slug)) {
      navigate(`${canonica}${search}${hash}`, { replace: true });
    }
  }, [publicacion, publicacion_id, slug, search, hash, navigate]);

  useTitulo(publicacion?.titulo ?? (noExiste ? "Publicación no encontrada" : null));

  // Mantener el contador de comentarios de la tarjeta al día
  const alCambiarTotal = useCallback((total) => {
    setPublicacion((p) => (p ? { ...p, total_comentarios: total } : p));
  }, []);

  return (
    <AppLayout>
      <div className="space-y-4">
        <button type="button" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate(rutas.inicio))} className="btn-fantasma -ml-2 px-3">
          <LuArrowLeft className="size-4" /> Volver
        </button>

        {noExiste ? (
          <EstadoVacio Icono={LuSearchX} titulo="Esta publicación no existe" texto="Puede que su autor la haya eliminado.">
            <Link to={rutas.inicio} className="btn-primario">
              Ir al inicio
            </Link>
          </EstadoVacio>
        ) : !publicacion ? (
          <PostEsqueleto />
        ) : (
          <>
            <PostCard publicacion={publicacion} detalle alEliminar={() => navigate(rutas.inicio)} />
            <Vendedor p={publicacion} />
            <Comentarios publicacionId={publicacion.publicacion_id} alCambiarTotal={alCambiarTotal} />
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default PubliPostScreen;
