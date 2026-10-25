import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { LuMessageCircle, LuReply, LuTrash2 } from "react-icons/lu";
import { API } from "../../config";
import { rutas } from "../../lib/rutas";
import { useAuth } from "../../auth/AuthContext";
import { confirmar, mensajeError, toast } from "../../lib/alertas";
import { fechaCompleta, tiempoRelativo } from "../../lib/formato";
import Avatar from "../ui/Avatar";

const MAXIMO = 150;

// Caja de texto con contador para comentar o responder
function Editor({ placeholder, textoBoton, alEnviar, alCancelar, autoFocus = false }) {
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    setEnviando(true);
    const ok = await alEnviar(texto.trim());
    setEnviando(false);
    if (ok) setTexto("");
  };

  return (
    <form onSubmit={enviar} className="rounded-2xl border border-borde bg-superficie transition focus-within:border-mar-500 focus-within:ring-4 focus-within:ring-mar-500/15">
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder={placeholder}
        maxLength={MAXIMO}
        rows={2}
        autoFocus={autoFocus}
        aria-label={placeholder}
        className="block w-full resize-none rounded-t-2xl border-0 bg-transparent px-4 pt-3 text-sm placeholder:text-suave/70 focus:ring-0 focus:outline-none [field-sizing:content] min-h-16"
      />
      <div className="flex items-center justify-between gap-2 px-3 pb-2.5">
        <span className={`text-xs tabular-nums ${texto.length >= MAXIMO ? "font-semibold text-red-500" : "text-suave"}`}>
          {texto.length}/{MAXIMO}
        </span>
        <div className="flex gap-2">
          {alCancelar && (
            <button type="button" onClick={alCancelar} className="btn-fantasma px-3 py-1.5 text-xs">
              Cancelar
            </button>
          )}
          <button type="submit" disabled={!texto.trim() || enviando} className="btn-primario px-4 py-1.5 text-xs">
            {enviando ? "Enviando…" : textoBoton}
          </button>
        </div>
      </div>
    </form>
  );
}

function Comentario({ c, esRespuesta = false, alResponder, alEliminar }) {
  const { user } = useAuth();

  return (
    <div className="flex gap-3">
      <Link to={rutas.usuario(c.nombre_usuario)} className="shrink-0">
        <Avatar foto={c.foto_perfil} nombre={c.nombre_usuario} tamano={esRespuesta ? "sm" : "md"} />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2">
          <Link to={rutas.usuario(c.nombre_usuario)} className="text-sm font-semibold hover:underline">
            {c.nombre_usuario}
          </Link>
          <span className="text-xs text-suave" title={fechaCompleta(c.tiempo_comentario)}>
            {tiempoRelativo(c.tiempo_comentario)}
          </span>
        </div>
        {esRespuesta && c.nombre_usuario_reply && (
          <p className="text-xs text-suave">
            respondiendo a{" "}
            <Link to={rutas.usuario(c.nombre_usuario_reply)} className="font-medium text-mar-600 hover:underline dark:text-mar-300">
              @{c.nombre_usuario_reply}
            </Link>
          </p>
        )}
        <p className="mt-1 text-sm leading-relaxed break-words whitespace-pre-line">{c.contenido}</p>
        <div className="mt-1 -ml-2 flex items-center gap-1">
          {user && alResponder && (
            <button type="button" onClick={alResponder} className="btn-fantasma px-2 py-1 text-xs text-suave">
              <LuReply className="size-3.5" /> Responder
            </button>
          )}
          {user?.id === c.usuario_id && (
            <button
              type="button"
              onClick={alEliminar}
              className="btn-fantasma px-2 py-1 text-xs text-suave hover:text-red-600 dark:hover:text-red-400"
            >
              <LuTrash2 className="size-3.5" /> Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Comentarios de una publicación con sus respuestas (un nivel, como antes)
export default function Comentarios({ publicacionId, alCambiarTotal }) {
  const { user } = useAuth();
  const [comentarios, setComentarios] = useState(null);
  const [respondiendoA, setRespondiendoA] = useState(null);

  const cargar = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/publicaciones/${publicacionId}/comentarios`);
      const conRespuestas = await Promise.all(
        data.comentarios.map(async (c) => {
          const r = await axios.get(`${API}/comentarios/${c.comentario_id}/respuestas`);
          return { ...c, respuestas: r.data.respuestas };
        })
      );
      setComentarios(conRespuestas);
      alCambiarTotal?.(data.totalComentarios);
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
      setComentarios([]);
    }
  }, [publicacionId, alCambiarTotal]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const comentar = async (contenido) => {
    try {
      await axios.post(`${API}/publicaciones/${publicacionId}/comentarios`, { contenido });
      await cargar();
      return true;
    } catch (error) {
      toast.error(mensajeError(error, "No se pudo publicar el comentario"));
      return false;
    }
  };

  const responder = async (comentarioId, contenido) => {
    try {
      await axios.post(`${API}/comentarios/${comentarioId}/respuestas`, { contenido });
      setRespondiendoA(null);
      await cargar();
      return true;
    } catch (error) {
      toast.error(mensajeError(error, "No se pudo publicar la respuesta"));
      return false;
    }
  };

  const eliminar = async (comentarioId, tieneRespuestas) => {
    const ok = await confirmar({
      titulo: "¿Eliminar comentario?",
      texto: tieneRespuestas ? "También se eliminarán sus respuestas." : "No se puede deshacer.",
    });
    if (!ok) return;
    try {
      await axios.delete(`${API}/comentarios/${comentarioId}`);
      toast.success("Comentario eliminado");
      await cargar();
    } catch (error) {
      toast.error(mensajeError(error, "No se pudo eliminar el comentario"));
    }
  };

  const total = comentarios?.reduce((n, c) => n + 1 + c.respuestas.length, 0) ?? 0;

  return (
    <section className="tarjeta p-4 sm:p-5" aria-labelledby="titulo-comentarios">
      <h2 id="titulo-comentarios" className="mb-4 flex items-center gap-2 font-bold">
        <LuMessageCircle className="size-5 text-suave" /> Comentarios
        {comentarios && <span className="rounded-full bg-superficie-2 px-2 py-0.5 text-xs font-semibold text-suave">{total}</span>}
      </h2>

      {user ? (
        <Editor placeholder="Escribe un comentario o pregunta al vendedor…" textoBoton="Comentar" alEnviar={comentar} />
      ) : (
        <div className="flex flex-col items-start justify-between gap-3 rounded-2xl bg-superficie-2 p-4 sm:flex-row sm:items-center">
          <p className="text-sm text-suave">Inicia sesión para comentar o preguntar por este producto.</p>
          <Link to={rutas.iniciarSesion} className="btn-primario px-4 py-1.5 text-xs">
            Iniciar sesión
          </Link>
        </div>
      )}

      <div className="mt-6 space-y-6">
        {comentarios === null &&
          [0, 1].map((i) => (
            <div key={i} className="flex gap-3" aria-hidden="true">
              <div className="esqueleto size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="esqueleto h-3 w-28" />
                <div className="esqueleto h-3 w-3/4" />
              </div>
            </div>
          ))}

        {comentarios?.length === 0 && (
          <p className="py-6 text-center text-sm text-suave">Aún no hay comentarios. ¡Haz la primera pregunta!</p>
        )}

        {comentarios?.map((c) => (
          <div key={c.comentario_id}>
            <Comentario
              c={c}
              alResponder={() => setRespondiendoA(respondiendoA === c.comentario_id ? null : c.comentario_id)}
              alEliminar={() => eliminar(c.comentario_id, c.respuestas.length > 0)}
            />
            {(c.respuestas.length > 0 || respondiendoA === c.comentario_id) && (
              <div className="mt-4 ml-5 space-y-4 border-l-2 border-borde pl-5">
                {c.respuestas.map((r) => (
                  <Comentario
                    key={r.comentario_id}
                    c={r}
                    esRespuesta
                    alResponder={() => setRespondiendoA(c.comentario_id)}
                    alEliminar={() => eliminar(r.comentario_id, false)}
                  />
                ))}
                {respondiendoA === c.comentario_id && (
                  <Editor
                    placeholder={`Responder a ${c.nombre_usuario}…`}
                    textoBoton="Responder"
                    autoFocus
                    alEnviar={(texto) => responder(c.comentario_id, texto)}
                    alCancelar={() => setRespondiendoA(null)}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
