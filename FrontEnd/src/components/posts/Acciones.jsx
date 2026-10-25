import { useCallback, useState } from "react";
import axios from "axios";
import {
  LuArrowBigDown,
  LuArrowBigUp,
  LuBookmark,
  LuBookmarkCheck,
  LuCheck,
  LuEllipsis,
  LuLink,
  LuShare2,
  LuTrash2,
} from "react-icons/lu";
import { API } from "../../config";
import { rutas } from "../../lib/rutas";
import { useAuth } from "../../auth/AuthContext";
import { useClickFuera } from "../../lib/useClickFuera";
import { confirmar, mensajeError, toast } from "../../lib/alertas";
import { ESTADOS } from "../../lib/estados";

const pedirSesion = (accion) =>
  toast.info(`Inicia sesión para ${accion}`, {
    action: { label: "Entrar", onClick: () => (window.location.href = rutas.iniciarSesion) },
  });

// Votos estilo Reddit: flecha arriba/abajo con el total al medio
export function Votos({ publicacionId, total, miVoto }) {
  const { user } = useAuth();
  const [estado, setEstado] = useState({ total: Number(total) || 0, voto: miVoto === "unvote" ? null : miVoto });
  const [enviando, setEnviando] = useState(false);

  const votar = async (tipo) => {
    if (!user) return pedirSesion("votar");
    if (enviando) return;
    const nuevoTipo = estado.voto === tipo ? "unvote" : tipo;
    const valor = { upvote: 1, downvote: -1 };
    const anterior = estado;
    // Actualización optimista: se corrige con la respuesta del servidor
    setEstado({
      voto: nuevoTipo === "unvote" ? null : nuevoTipo,
      total: estado.total - (valor[estado.voto] ?? 0) + (valor[nuevoTipo] ?? 0),
    });
    setEnviando(true);
    try {
      const { data } = await axios.post(`${API}/publicaciones/${publicacionId}/voto`, { tipo: nuevoTipo });
      setEstado((e) => ({ ...e, total: data.totalVotes }));
    } catch (error) {
      setEstado(anterior);
      toast.error(mensajeError(error, "No se pudo registrar tu voto"));
    } finally {
      setEnviando(false);
    }
  };

  const colorTotal =
    estado.voto === "upvote"
      ? "text-mar-600 dark:text-mar-300"
      : estado.voto === "downvote"
        ? "text-arena-600 dark:text-arena-300"
        : "text-texto";

  return (
    <div className="inline-flex h-9 items-center rounded-full bg-superficie-2">
      <button
        type="button"
        onClick={() => votar("upvote")}
        aria-label="Votar a favor"
        aria-pressed={estado.voto === "upvote"}
        className={`flex size-9 items-center justify-center rounded-full transition hover:bg-mar-100 hover:text-mar-600 dark:hover:bg-mar-500/15 ${
          estado.voto === "upvote" ? "text-mar-600 dark:text-mar-300" : "text-suave"
        }`}
      >
        <LuArrowBigUp className={`size-5 ${estado.voto === "upvote" ? "fill-current" : ""}`} />
      </button>
      <span className={`min-w-6 text-center text-xs font-bold tabular-nums ${colorTotal}`}>{estado.total}</span>
      <button
        type="button"
        onClick={() => votar("downvote")}
        aria-label="Votar en contra"
        aria-pressed={estado.voto === "downvote"}
        className={`flex size-9 items-center justify-center rounded-full transition hover:bg-arena-100 hover:text-arena-600 dark:hover:bg-arena-500/15 ${
          estado.voto === "downvote" ? "text-arena-600 dark:text-arena-300" : "text-suave"
        }`}
      >
        <LuArrowBigDown className={`size-5 ${estado.voto === "downvote" ? "fill-current" : ""}`} />
      </button>
    </div>
  );
}

export function Guardar({ publicacionId, guardado, conTexto = true, alCambiar }) {
  const { user } = useAuth();
  const [activo, setActivo] = useState(Boolean(guardado));

  const alternar = async () => {
    if (!user) return pedirSesion("guardar publicaciones");
    setActivo(!activo);
    try {
      const { data } = activo
        ? await axios.delete(`${API}/guardados/${publicacionId}`)
        : await axios.put(`${API}/guardados/${publicacionId}`);
      const ahora = data.guardado;
      setActivo(ahora);
      toast.success(ahora ? "Guardado en tu lista" : "Quitado de guardados");
      alCambiar?.(ahora);
    } catch (error) {
      setActivo(activo);
      toast.error(mensajeError(error, "No se pudo guardar"));
    }
  };

  return (
    <button
      type="button"
      onClick={alternar}
      aria-pressed={activo}
      aria-label={activo ? "Quitar de guardados" : "Guardar"}
      className={`accion ${activo ? "bg-mar-50 text-mar-700 dark:bg-mar-500/15 dark:text-mar-300" : ""}`}
    >
      {activo ? <LuBookmarkCheck className="size-4" /> : <LuBookmark className="size-4" />}
      {conTexto && <span className="hidden sm:inline">{activo ? "Guardado" : "Guardar"}</span>}
    </button>
  );
}

export function Compartir({ publicacionId, titulo }) {
  const compartir = async () => {
    const url = `${window.location.origin}${rutas.publicacion(publicacionId, titulo)}`;
    // En móvil se abre el menú nativo de compartir; si no existe, se copia el enlace
    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, text: `${titulo} — Rincón Tocopillano`, url });
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Enlace copiado", { icon: <LuLink className="size-4" /> });
    } catch {
      toast.error("No se pudo copiar el enlace");
    }
  };

  return (
    <button type="button" onClick={compartir} className="accion" aria-label="Compartir">
      <LuShare2 className="size-4" />
      <span className="hidden sm:inline">Compartir</span>
    </button>
  );
}

// Menú "…" con las acciones del dueño: cambiar el estado de venta y eliminar
export function MenuPropietario({ publicacionId, estado = "disponible", alCambiarEstado, alEliminar }) {
  const [abierto, setAbierto] = useState(false);
  const cerrar = useCallback(() => setAbierto(false), []);
  const ref = useClickFuera(abierto, cerrar);

  const cambiarEstado = async (nuevo) => {
    cerrar();
    if (nuevo === estado) return;
    alCambiarEstado?.(nuevo); // optimista
    try {
      await axios.patch(`${API}/publicaciones/${publicacionId}/estado`, { estado: nuevo });
      toast.success(ESTADOS[nuevo].aviso);
    } catch (error) {
      alCambiarEstado?.(estado);
      toast.error(mensajeError(error, "No se pudo cambiar el estado"));
    }
  };

  const eliminar = async () => {
    cerrar();
    const ok = await confirmar({
      titulo: "¿Eliminar publicación?",
      texto: "También se borrarán sus comentarios y votos. No se puede deshacer.",
    });
    if (!ok) return;
    try {
      await axios.delete(`${API}/publicaciones/${publicacionId}`);
      toast.success("Publicación eliminada");
      alEliminar?.();
    } catch (error) {
      toast.error(mensajeError(error, "No se pudo eliminar la publicación"));
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        className="btn-icono"
        aria-label="Opciones de la publicación"
        aria-haspopup="menu"
        aria-expanded={abierto}
      >
        <LuEllipsis className="size-5" />
      </button>
      {abierto && (
        <div className="menu-flotante right-0 mt-1 w-60" role="menu">
          <p className="px-3 pt-1.5 pb-1 text-xs font-semibold tracking-wider text-suave uppercase">Estado</p>
          {Object.entries(ESTADOS).map(([valor, { texto, Icono, color }]) => (
            <button
              key={valor}
              type="button"
              onClick={() => cambiarEstado(valor)}
              className="menu-item"
              role="menuitemradio"
              aria-checked={estado === valor}
            >
              <span className={`flex size-6 items-center justify-center rounded-md ${color}`}>
                <Icono className="size-3.5" />
              </span>
              <span className="flex-1">{texto}</span>
              {estado === valor && <LuCheck className="size-4 text-mar-600 dark:text-mar-300" />}
            </button>
          ))}
          <div className="my-1 h-px bg-borde" />
          <button type="button" onClick={eliminar} className="menu-item text-red-600 dark:text-red-400" role="menuitem">
            <LuTrash2 className="size-4" /> Eliminar publicación
          </button>
        </div>
      )}
    </div>
  );
}
