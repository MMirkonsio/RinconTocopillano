import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { LuBookmark, LuLock, LuX } from "react-icons/lu";
import { API } from "../config";
import { rutas } from "../lib/rutas";
import { useAuth } from "../auth/AuthContext";
import { mensajeError, toast } from "../lib/alertas";
import { contar } from "../lib/formato";
import AppLayout from "../components/layout/AppLayout";
import EstadoVacio from "../components/ui/EstadoVacio";
import { GrillaEsqueletos } from "../components/ui/Esqueletos";
import PostMini from "../components/posts/PostMini";
import { useTitulo } from "../lib/useTitulo";

const Guardados = () => {
  useTitulo("Guardados");
  const { user } = useAuth();
  const [guardados, setGuardados] = useState(null);

  useEffect(() => {
    if (!user) return;
    axios
      .get(`${API}/guardados`)
      .then(({ data }) => setGuardados(data))
      .catch(() => setGuardados([]));
  }, [user]);

  const quitar = async (publicacionId) => {
    const antes = guardados;
    setGuardados(guardados.filter((p) => p.publicacion_id !== publicacionId));
    try {
      await axios.delete(`${API}/guardados/${publicacionId}`);
      toast.success("Quitado de guardados");
    } catch (error) {
      setGuardados(antes);
      toast.error(mensajeError(error, "No se pudo quitar"));
    }
  };

  return (
    <AppLayout conAside={false}>
      <div className="space-y-4">
        <header>
          <h1 className="text-2xl font-bold tracking-tight">Guardados</h1>
          <p className="text-sm text-suave">
            {guardados ? contar(guardados.length, "publicación guardada", "publicaciones guardadas") : "Lo que marcaste para ver después."}
          </p>
        </header>

        {!user ? (
          <EstadoVacio Icono={LuLock} titulo="Inicia sesión para ver tus guardados">
            <Link to={rutas.iniciarSesion} className="btn-primario">
              Iniciar sesión
            </Link>
          </EstadoVacio>
        ) : guardados === null ? (
          <GrillaEsqueletos />
        ) : guardados.length === 0 ? (
          <EstadoVacio Icono={LuBookmark} titulo="No tienes nada guardado" texto="Toca «Guardar» en cualquier publicación para encontrarla aquí después.">
            <Link to={rutas.inicio} className="btn-primario">
              Explorar publicaciones
            </Link>
          </EstadoVacio>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 2xl:grid-cols-4">
            {guardados.map((p) => (
              <PostMini
                key={p.publicacion_id}
                publicacion={p}
                accion={
                  <button
                    type="button"
                    onClick={() => quitar(p.publicacion_id)}
                    className="flex size-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75"
                    aria-label={`Quitar ${p.titulo} de guardados`}
                    title="Quitar de guardados"
                  >
                    <LuX className="size-4" />
                  </button>
                }
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Guardados;
