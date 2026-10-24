import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LuCircleAlert, LuImagePlus, LuLock } from "react-icons/lu";
import { API } from "../config";
import { rutas } from "../lib/rutas";
import { useAuth } from "../auth/AuthContext";
import { CATEGORIAS, categoriaPorId } from "../lib/categorias";
import { formatearPrecio } from "../lib/formato";
import { mensajeError, toast } from "../lib/alertas";
import AppLayout from "../components/layout/AppLayout";
import Avatar from "../components/ui/Avatar";
import EstadoVacio from "../components/ui/EstadoVacio";
import SelectorFotos from "../components/posts/SelectorFotos";
import { useTitulo } from "../lib/useTitulo";

function Contador({ actual, maximo }) {
  return (
    <span className={`text-xs tabular-nums ${actual >= maximo ? "font-semibold text-red-500" : "text-suave"}`}>
      {actual}/{maximo}
    </span>
  );
}

// Vista previa de cómo se verá la publicación en el feed
function VistaPrevia({ form, imagen, cantidad }) {
  const { user } = useAuth();
  const categoria = form.categoria_id ? categoriaPorId(form.categoria_id) : null;
  return (
    <div className="tarjeta overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-2.5">
          <Avatar foto={user.foto_perfil} nombre={user.nombre_usuario} tamano="sm" />
          <div>
            <p className="text-sm font-semibold">{user.nombre_usuario}</p>
            <p className="text-xs text-suave">justo ahora</p>
          </div>
        </div>
        {categoria && (
          <span className={`mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${categoria.color}`}>
            <categoria.Icono className="size-3" /> {categoria.nombre}
          </span>
        )}
        <div className="mt-2 flex items-start justify-between gap-2">
          <p className={`font-bold break-words ${form.titulo ? "" : "text-suave"}`}>{form.titulo || "Título de tu publicación"}</p>
          {form.precio !== "" && <span className="precio shrink-0">{formatearPrecio(form.precio)}</span>}
        </div>
        <p className="mt-1 line-clamp-3 text-sm break-words text-suave">{form.contenido || "Aquí aparecerá la descripción."}</p>
      </div>
      <div className="relative flex aspect-[4/3] items-center justify-center bg-superficie-2">
        {imagen ? <img src={imagen} alt="" className="size-full object-cover" /> : <LuImagePlus className="size-10 text-suave/50" />}
        {cantidad > 1 && (
          <span className="absolute top-3 right-3 rounded-full bg-slate-950/60 px-2 py-0.5 text-xs font-semibold text-white">
            1/{cantidad}
          </span>
        )}
      </div>
    </div>
  );
}

const PublicacionScreen = () => {
  useTitulo("Crear publicación");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ titulo: "", contenido: "", precio: "", categoria_id: null });
  const [fotos, setFotos] = useState([]);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Liberar las vistas previas de las fotos al salir de la página
  const fotosActuales = useRef(fotos);
  useEffect(() => {
    fotosActuales.current = fotos;
  }, [fotos]);
  useEffect(() => () => fotosActuales.current.forEach((f) => URL.revokeObjectURL(f.url)), []);

  if (!user) {
    return (
      <AppLayout conAside={false}>
        <EstadoVacio Icono={LuLock} titulo="Inicia sesión para publicar" texto="Necesitas una cuenta para vender o compartir en la comunidad.">
          <Link to={rutas.iniciarSesion} state={{ desde: rutas.publicar }} className="btn-primario">
            Iniciar sesión
          </Link>
          <Link to={rutas.registro} className="btn-secundario">
            Crear cuenta
          </Link>
        </EstadoVacio>
      </AppLayout>
    );
  }

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    if (fotos.length === 0) return setError("Agrega al menos una foto de lo que publicas.");
    if (!form.categoria_id) return setError("Elige una categoría.");
    if (form.precio === "") return setError("Indica un precio (pon 0 si es gratis).");

    setError("");
    setEnviando(true);
    try {
      const datos = new FormData();
      datos.append("titulo", form.titulo.trim());
      datos.append("contenido", form.contenido.trim());
      datos.append("precio", form.precio);
      datos.append("categoria_id", form.categoria_id);
      fotos.forEach((f) => datos.append("imagenes", f.archivo));
      const { data } = await axios.post(`${API}/publicaciones`, datos);
      toast.success("¡Tu publicación ya está en línea!");
      navigate(rutas.publicacion(data.publicacion_id, form.titulo));
    } catch (err) {
      setError(mensajeError(err, "No se pudo publicar. Inténtalo de nuevo."));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AppLayout conAside={false}>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <form onSubmit={enviar} className="tarjeta space-y-6 p-4 sm:p-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Crear publicación</h1>
            <p className="mt-1 text-sm text-suave">Vende o comparte algo con la comunidad de Tocopilla.</p>
          </div>

          {/* Fotos */}
          <div>
            <span className="etiqueta">Fotos</span>
            <SelectorFotos fotos={fotos} setFotos={setFotos} setError={setError} />
          </div>

          {/* Título y descripción */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="titulo" className="etiqueta">
                Título
              </label>
              <Contador actual={form.titulo.length} maximo={75} />
            </div>
            <input id="titulo" name="titulo" value={form.titulo} onChange={cambiar} required maxLength={75} placeholder="Ej: Empanadas de pino recién hechas" className="campo" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="contenido" className="etiqueta">
                Descripción
              </label>
              <Contador actual={form.contenido.length} maximo={255} />
            </div>
            <textarea
              id="contenido"
              name="contenido"
              value={form.contenido}
              onChange={cambiar}
              required
              maxLength={255}
              rows={4}
              placeholder="Cuenta los detalles: estado, tamaño, horario de entrega, sector…"
              className="campo resize-y"
            />
          </div>

          {/* Precio */}
          <div className="max-w-xs">
            <label htmlFor="precio" className="etiqueta">
              Precio
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-semibold text-suave">$</span>
              <input
                id="precio"
                inputMode="numeric"
                value={form.precio === "" ? "" : Number(form.precio).toLocaleString("es-CL")}
                onChange={(e) => {
                  const digitos = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setForm({ ...form, precio: digitos === "" ? "" : String(Number(digitos)) });
                }}
                placeholder="0"
                className="campo pl-8"
              />
            </div>
            <p className="mt-1.5 text-xs text-suave">En pesos chilenos. Pon 0 si es gratis.</p>
          </div>

          {/* Categoría */}
          <fieldset>
            <legend className="etiqueta">Categoría</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {CATEGORIAS.map(({ id, nombre, Icono, color }) => {
                const activa = form.categoria_id === id;
                return (
                  <label
                    key={id}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-2.5 text-sm font-medium transition ${
                      activa ? "border-mar-500 bg-mar-50 ring-2 ring-mar-500/20 dark:bg-mar-500/10" : "border-borde hover:border-mar-300"
                    }`}
                  >
                    <input type="radio" name="categoria" value={id} checked={activa} onChange={() => setForm({ ...form, categoria_id: id })} className="sr-only" />
                    <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${color}`}>
                      <Icono className="size-4" />
                    </span>
                    <span className="leading-tight">{nombre}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {error && (
            <div role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
              <LuCircleAlert className="mt-0.5 size-4 shrink-0" /> {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 border-t border-borde pt-5 sm:flex-row sm:justify-end">
            <Link to={rutas.inicio} className="btn-secundario">
              Cancelar
            </Link>
            <button type="submit" disabled={enviando} className="btn-primario px-6">
              {enviando ? "Publicando…" : "Publicar"}
            </button>
          </div>
        </form>

        <aside className="hidden xl:block">
          <div className="sticky top-22 space-y-3">
            <p className="text-xs font-semibold tracking-wider text-suave uppercase">Vista previa</p>
            <VistaPrevia form={form} imagen={fotos[0]?.url} cantidad={fotos.length} />
            <p className="text-xs text-suave">Consejo: las publicaciones con buena foto y precio claro reciben más votos y mensajes.</p>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
};

export default PublicacionScreen;
