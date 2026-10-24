import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { LuArrowBigUp, LuBellOff, LuLock } from "react-icons/lu";
import { API } from "../config";
import { rutas } from "../lib/rutas";
import { useAuth } from "../auth/AuthContext";
import AppLayout from "../components/layout/AppLayout";
import Avatar from "../components/ui/Avatar";
import EstadoVacio from "../components/ui/EstadoVacio";
import { useTitulo } from "../lib/useTitulo";

// Notificaciones: votos positivos que otros dieron a tus publicaciones
const Bandeja = () => {
  useTitulo("Notificaciones");
  const { user } = useAuth();
  const [notificaciones, setNotificaciones] = useState(null);

  useEffect(() => {
    if (!user) return;
    axios
      .get(`${API}/notificaciones`)
      .then(({ data }) => setNotificaciones(data.filter((n) => n.tipo === "upvote")))
      .catch(() => setNotificaciones([]));
  }, [user]);

  return (
    <AppLayout>
      <div className="space-y-4">
        <header>
          <h1 className="text-2xl font-bold tracking-tight">Notificaciones</h1>
          <p className="text-sm text-suave">Quién ha votado a favor de tus publicaciones.</p>
        </header>

        {!user ? (
          <EstadoVacio Icono={LuLock} titulo="Inicia sesión para ver tus notificaciones">
            <Link to={rutas.iniciarSesion} className="btn-primario">
              Iniciar sesión
            </Link>
          </EstadoVacio>
        ) : notificaciones === null ? (
          <div className="tarjeta divide-y divide-borde" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 p-4">
                <div className="esqueleto size-10 rounded-full" />
                <div className="esqueleto h-4 flex-1" />
              </div>
            ))}
          </div>
        ) : notificaciones.length === 0 ? (
          <EstadoVacio Icono={LuBellOff} titulo="Sin notificaciones por ahora" texto="Cuando alguien vote a favor de tus publicaciones, lo verás aquí." />
        ) : (
          <ul className="tarjeta divide-y divide-borde overflow-hidden">
            {notificaciones.map((n) => (
              <li key={n.voto_id}>
                <Link
                  to={rutas.publicacion(n.publicacion_id, n.titulo)}
                  className="flex items-center gap-3 p-4 transition hover:bg-superficie-2"
                >
                  <div className="relative">
                    <Avatar foto={n.foto_perfil} nombre={n.nombre_usuario} />
                    <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-mar-600 text-white ring-2 ring-superficie">
                      <LuArrowBigUp className="size-3.5 fill-current" />
                    </span>
                  </div>
                  <p className="min-w-0 flex-1 text-sm">
                    <span className="font-semibold">{n.nombre_usuario}</span>
                    <span className="text-suave"> votó a favor de </span>
                    <span className="font-medium">«{n.titulo}»</span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppLayout>
  );
};

export default Bandeja;
