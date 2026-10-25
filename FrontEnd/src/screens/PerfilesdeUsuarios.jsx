import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LuClock, LuImagePlus, LuMapPin, LuPencil, LuPhone, LuPlus, LuUserX } from "react-icons/lu";
import { API } from "../config";
import { rutas } from "../lib/rutas";
import { useTitulo } from "../lib/useTitulo";
import { useAuth } from "../auth/AuthContext";
import { contar, enlaceWhatsApp } from "../lib/formato";
import AppLayout from "../components/layout/AppLayout";
import Avatar from "../components/ui/Avatar";
import EstadoVacio from "../components/ui/EstadoVacio";
import { GrillaEsqueletos } from "../components/ui/Esqueletos";
import PostMini from "../components/posts/PostMini";

function Dato({ Icono, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-suave">
      <Icono className="size-4 shrink-0" /> {children}
    </span>
  );
}

const PerfilUsuario = () => {
  const { nombre } = useParams();
  const { user } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [publicaciones, setPublicaciones] = useState(null);
  const [noExiste, setNoExiste] = useState(false);
  const esPropio = Boolean(user && perfil && user.id === perfil.id);
  useTitulo(perfil ? perfil.nombre_usuario : noExiste ? "Usuario no encontrado" : null);

  // El nombre en la URL no distingue mayúsculas: se corrige al nombre real
  const navigate = useNavigate();
  useEffect(() => {
    // Solo si es el mismo usuario escrito con otras mayúsculas (al pasar de un perfil a
    // otro, `perfil` aún tiene el anterior por un momento)
    if (perfil && perfil.nombre_usuario !== nombre && perfil.nombre_usuario.toLowerCase() === nombre.toLowerCase()) {
      navigate(rutas.usuario(perfil.nombre_usuario), { replace: true });
    }
  }, [perfil, nombre, navigate]);

  useEffect(() => {
    let vigente = true; // ignora las respuestas si mientras tanto se abrió otro perfil
    setPerfil(null);
    setPublicaciones(null);
    setNoExiste(false);
    axios
      .get(`${API}/usuarios/${encodeURIComponent(nombre)}`)
      .then(({ data }) => vigente && setPerfil(data))
      .catch(() => vigente && setNoExiste(true));
    axios
      .get(`${API}/usuarios/${encodeURIComponent(nombre)}/publicaciones`)
      .then(({ data }) => vigente && setPublicaciones(data))
      .catch(() => vigente && setPublicaciones([]));
    return () => {
      vigente = false;
    };
  }, [nombre]);

  if (noExiste) {
    return (
      <AppLayout conAside={false}>
        <EstadoVacio Icono={LuUserX} titulo="Este perfil no existe">
          <Link to={rutas.inicio} className="btn-primario">
            Ir al inicio
          </Link>
        </EstadoVacio>
      </AppLayout>
    );
  }

  const whatsapp = perfil && enlaceWhatsApp(perfil.telefono, `Hola ${perfil.nombre_usuario}, te escribo desde Rincón Tocopillano.`);

  return (
    <AppLayout conAside={false}>
      <div className="space-y-6">
        <section className="tarjeta overflow-hidden">
          <div className="relative h-32 bg-linear-to-r from-mar-700 via-mar-500 to-arena-400 sm:h-40">
            <img src="/images/tocopilla.jpg" alt="" className="size-full object-cover opacity-40 mix-blend-overlay" />
          </div>
          <div className="px-4 pb-5 sm:px-6">
            <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              {perfil ? (
                <Avatar foto={perfil.foto_perfil} nombre={perfil.nombre_usuario} tamano="xl" className="ring-4 ring-superficie" />
              ) : (
                <div className="esqueleto size-28 rounded-full ring-4 ring-superficie" />
              )}
              {perfil && (
                <div className="flex gap-2">
                  {esPropio ? (
                    <>
                      <Link to={rutas.ajustes} className="btn-secundario">
                        <LuPencil className="size-4" /> Editar perfil
                      </Link>
                      <Link to={rutas.publicar} className="btn-primario">
                        <LuPlus className="size-4" /> Publicar
                      </Link>
                    </>
                  ) : (
                    whatsapp && (
                      <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn bg-[#25D366] text-white hover:bg-[#1ebe5b]">
                        <LuPhone className="size-4" /> Escribir por WhatsApp
                      </a>
                    )
                  )}
                </div>
              )}
            </div>

            {perfil ? (
              <div className="mt-4">
                <h1 className="text-2xl font-bold tracking-tight">{perfil.nombre_usuario}</h1>
                {perfil.descripcion ? (
                  <p className="mt-1 max-w-2xl text-[15px] text-suave">{perfil.descripcion}</p>
                ) : (
                  esPropio && (
                    <Link to={rutas.ajustes} className="mt-1 inline-block text-sm text-mar-600 hover:underline dark:text-mar-300">
                      Agrega una descripción para que te conozcan mejor
                    </Link>
                  )
                )}
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                  {publicaciones && <Dato Icono={LuImagePlus}>{contar(publicaciones.length, "publicación", "publicaciones")}</Dato>}
                  {perfil.direccion && <Dato Icono={LuMapPin}>{perfil.direccion}</Dato>}
                  {perfil.horario && <Dato Icono={LuClock}>{perfil.horario}</Dato>}
                  {perfil.telefono && <Dato Icono={LuPhone}>{perfil.telefono}</Dato>}
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <div className="esqueleto h-7 w-48" />
                <div className="esqueleto h-4 w-72" />
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold">{esPropio ? "Mis publicaciones" : "Publicaciones"}</h2>
          {publicaciones === null ? (
            <GrillaEsqueletos />
          ) : publicaciones.length === 0 ? (
            <EstadoVacio
              Icono={LuImagePlus}
              titulo={esPropio ? "Aún no has publicado nada" : "Sin publicaciones todavía"}
              texto={esPropio ? "Tu primera publicación aparecerá aquí." : undefined}
            >
              {esPropio && (
                <Link to={rutas.publicar} className="btn-primario">
                  Crear publicación
                </Link>
              )}
            </EstadoVacio>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 2xl:grid-cols-4">
              {publicaciones.map((p) => (
                <PostMini key={p.publicacion_id} publicacion={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
};

export default PerfilUsuario;
