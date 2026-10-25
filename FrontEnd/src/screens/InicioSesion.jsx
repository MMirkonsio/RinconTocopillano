import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuCircleAlert, LuLock, LuMail } from "react-icons/lu";
import { useAuth } from "../auth/AuthContext";
import { mensajeError, toast } from "../lib/alertas";
import { rutas } from "../lib/rutas";
import AuthLayout, { Campo, CampoPassword } from "../components/layout/AuthLayout";
import { useTitulo } from "../lib/useTitulo";

const InicioSesion = () => {
  useTitulo("Iniciar sesión");
  const navigate = useNavigate();
  const location = useLocation();
  const { iniciarSesion } = useAuth();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const usuario = await iniciarSesion(correo.trim(), password);
      toast.success(`¡Hola de nuevo, ${usuario.nombre_usuario}!`);
      navigate(location.state?.desde ?? rutas.inicio, { replace: true });
    } catch (err) {
      setError(
        err.response?.status === 401 ? "Correo o contraseña incorrectos." : mensajeError(err, "No se pudo iniciar sesión.")
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <AuthLayout titulo="Bienvenido de vuelta" subtitulo="Inicia sesión para publicar, comentar y guardar lo que te guste.">
      <form onSubmit={enviar} className="space-y-4">
        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
            <LuCircleAlert className="mt-0.5 size-4 shrink-0" /> {error}
          </div>
        )}
        <Campo id="correo" etiqueta="Correo electrónico" Icono={LuMail}>
          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            autoComplete="email"
            required
            placeholder="tucorreo@ejemplo.com"
            className="campo pl-10"
          />
        </Campo>
        <Campo id="password" etiqueta="Contraseña" Icono={LuLock}>
          <CampoPassword id="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" Icono={LuLock} />
        </Campo>
        <button type="submit" disabled={cargando} className="btn-primario w-full py-2.5">
          {cargando ? "Entrando…" : "Iniciar sesión"}
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-suave">
        ¿No tienes cuenta?{" "}
        <Link to={rutas.registro} className="font-semibold text-mar-600 hover:underline dark:text-mar-300">
          Regístrate gratis
        </Link>
      </p>
    </AuthLayout>
  );
};

export default InicioSesion;
