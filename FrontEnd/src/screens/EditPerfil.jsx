import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LuCircleAlert, LuClock, LuLock, LuMail, LuMapPin, LuPhone, LuUser } from "react-icons/lu";
import { API } from "../config";
import { rutas } from "../lib/rutas";
import { useAuth } from "../auth/AuthContext";
import { mensajeError, toast } from "../lib/alertas";
import AppLayout from "../components/layout/AppLayout";
import Avatar from "../components/ui/Avatar";
import EstadoVacio from "../components/ui/EstadoVacio";
import { Campo } from "../components/layout/AuthLayout";
import { useTitulo } from "../lib/useTitulo";

const CAMPOS = ["nombre_usuario", "correo", "telefono", "descripcion", "direccion", "horario"];

const EditarPerfil = () => {
  useTitulo("Editar perfil");
  const { user, actualizarUsuario } = useAuth();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!user) return;
    axios
      .get(`${API}/perfil`)
      .then(({ data }) => setPerfil(Object.fromEntries(CAMPOS.map((c) => [c, data[c] ?? ""]))))
      .catch((err) => setError(mensajeError(err, "No se pudo cargar tu perfil")));
  }, [user]);

  if (!user) {
    return (
      <AppLayout conAside={false}>
        <EstadoVacio Icono={LuLock} titulo="Inicia sesión para editar tu perfil">
          <Link to={rutas.iniciarSesion} className="btn-primario">
            Iniciar sesión
          </Link>
        </EstadoVacio>
      </AppLayout>
    );
  }

  const cambiar = (e) => setPerfil({ ...perfil, [e.target.name]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    setError("");
    setGuardando(true);
    try {
      const { data } = await axios.patch(`${API}/perfil`, perfil);
      actualizarUsuario({ nombre_usuario: data.usuario.nombre_usuario, correo: data.usuario.correo });
      toast.success("Perfil actualizado");
      navigate(rutas.usuario(data.usuario.nombre_usuario));
    } catch (err) {
      setError(mensajeError(err, "No se pudo guardar el perfil"));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <AppLayout conAside={false}>
      <form onSubmit={guardar} className="tarjeta mx-auto max-w-2xl p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <Avatar foto={user.foto_perfil} nombre={user.nombre_usuario} tamano="lg" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Editar perfil</h1>
            <p className="text-sm text-suave">Así te verán los demás en la comunidad.</p>
          </div>
        </div>

        {!perfil && !error ? (
          <div className="mt-6 space-y-4">
            {CAMPOS.map((c) => (
              <div key={c} className="esqueleto h-11" />
            ))}
          </div>
        ) : (
          perfil && (
            <div className="mt-6 space-y-6">
              <fieldset className="space-y-4">
                <legend className="mb-3 text-xs font-semibold tracking-wider text-suave uppercase">Cuenta</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Campo id="nombre_usuario" etiqueta="Nombre de usuario" Icono={LuUser}>
                    <input id="nombre_usuario" name="nombre_usuario" value={perfil.nombre_usuario} onChange={cambiar} required minLength={3} maxLength={25} className="campo pl-10" />
                  </Campo>
                  <Campo id="correo" etiqueta="Correo" Icono={LuMail}>
                    <input id="correo" name="correo" type="email" value={perfil.correo} onChange={cambiar} required maxLength={100} className="campo pl-10" />
                  </Campo>
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="mb-3 text-xs font-semibold tracking-wider text-suave uppercase">Tu negocio o tienda</legend>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="descripcion" className="etiqueta">
                      Descripción
                    </label>
                    <span className="text-xs text-suave tabular-nums">{perfil.descripcion.length}/255</span>
                  </div>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={perfil.descripcion}
                    onChange={cambiar}
                    maxLength={255}
                    rows={3}
                    placeholder="Ej: Completos y churrascos caseros, delivery en el centro."
                    className="campo resize-y"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Campo id="telefono" etiqueta="Teléfono (WhatsApp)" Icono={LuPhone}>
                    <input id="telefono" name="telefono" type="tel" value={perfil.telefono} onChange={cambiar} maxLength={20} placeholder="+56 9 1234 5678" className="campo pl-10" />
                  </Campo>
                  <Campo id="horario" etiqueta="Horario" Icono={LuClock}>
                    <input id="horario" name="horario" value={perfil.horario} onChange={cambiar} maxLength={100} placeholder="Lun a Sáb, 10:00 a 20:00" className="campo pl-10" />
                  </Campo>
                </div>
                <Campo id="direccion" etiqueta="Dirección o sector" Icono={LuMapPin}>
                  <input id="direccion" name="direccion" value={perfil.direccion} onChange={cambiar} maxLength={255} placeholder="Ej: Calle 21 de Mayo, cerca de la plaza" className="campo pl-10" />
                </Campo>
              </fieldset>
            </div>
          )
        )}

        {error && (
          <div role="alert" className="mt-6 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
            <LuCircleAlert className="mt-0.5 size-4 shrink-0" /> {error}
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 border-t border-borde pt-5 sm:flex-row sm:justify-end">
          <Link to={rutas.usuario(user.nombre_usuario)} className="btn-secundario">
            Cancelar
          </Link>
          <button type="submit" disabled={!perfil || guardando} className="btn-primario px-6">
            {guardando ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </form>
    </AppLayout>
  );
};

export default EditarPerfil;
