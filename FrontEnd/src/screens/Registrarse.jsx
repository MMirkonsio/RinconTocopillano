import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuCamera, LuCircleAlert, LuLock, LuMail, LuPhone, LuUser } from "react-icons/lu";
import { API } from "../config";
import { rutas } from "../lib/rutas";
import { useAuth } from "../auth/AuthContext";
import { toast } from "../lib/alertas";
import AuthLayout, { Campo, CampoPassword } from "../components/layout/AuthLayout";
import { useTitulo } from "../lib/useTitulo";

const Registro = () => {
  useTitulo("Crear cuenta");
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();
  const [form, setForm] = useState({ nombre_usuario: "", correo: "", telefono: "", password: "" });
  const [foto, setFoto] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => () => vistaPrevia && URL.revokeObjectURL(vistaPrevia), [vistaPrevia]);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const elegirFoto = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    if (archivo.size > 5 * 1024 * 1024) {
      setError("La foto no puede pesar más de 5 MB.");
      return;
    }
    setFoto(archivo);
    setVistaPrevia(URL.createObjectURL(archivo));
  };

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setCargando(true);
    try {
      const datos = new FormData();
      Object.entries(form).forEach(([k, v]) => datos.append(k, k === "password" ? v : v.trim()));
      if (foto) datos.append("foto_perfil", foto);

      const respuesta = await fetch(`${API}/auth/registro`, { method: "POST", credentials: "include", body: datos });
      if (!respuesta.ok) {
        const { error: mensaje } = await respuesta.json().catch(() => ({}));
        setError(mensaje || "No se pudo crear la cuenta.");
        return;
      }
      // Entrar directamente con la cuenta recién creada
      await iniciarSesion(form.correo.trim(), form.password);
      toast.success(`¡Bienvenido a Rincón Tocopillano, ${form.nombre_usuario.trim()}!`);
      navigate(rutas.inicio, { replace: true });
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <AuthLayout titulo="Crea tu cuenta" subtitulo="Únete a la comunidad y empieza a publicar en minutos.">
      <form onSubmit={enviar} className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="group relative cursor-pointer" aria-label="Elegir foto de perfil">
            <span className="flex size-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-borde bg-superficie-2 transition group-hover:border-mar-400">
              {vistaPrevia ? (
                <img src={vistaPrevia} alt="Vista previa de tu foto" className="size-full object-cover" />
              ) : (
                <LuUser className="size-8 text-suave" />
              )}
            </span>
            <span className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full bg-mar-600 text-white ring-2 ring-fondo">
              <LuCamera className="size-3.5" />
            </span>
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={elegirFoto} className="sr-only" />
          </label>
          <div className="text-sm">
            <p className="font-medium">Foto de perfil</p>
            <p className="text-suave">Opcional · JPG, PNG o WEBP de hasta 5 MB</p>
          </div>
        </div>

        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
            <LuCircleAlert className="mt-0.5 size-4 shrink-0" /> {error}
          </div>
        )}

        <Campo id="nombre_usuario" etiqueta="Nombre de usuario" Icono={LuUser}>
          <input id="nombre_usuario" name="nombre_usuario" value={form.nombre_usuario} onChange={cambiar} required minLength={3} maxLength={25} autoComplete="username" placeholder="ej: completos_don_juan" className="campo pl-10" />
        </Campo>
        <Campo id="correo" etiqueta="Correo electrónico" Icono={LuMail}>
          <input id="correo" name="correo" type="email" value={form.correo} onChange={cambiar} required autoComplete="email" placeholder="tucorreo@ejemplo.com" className="campo pl-10" />
        </Campo>
        <Campo id="telefono" etiqueta="Teléfono (WhatsApp)" Icono={LuPhone} ayuda="Los compradores podrán escribirte por WhatsApp.">
          <input id="telefono" name="telefono" type="tel" value={form.telefono} onChange={cambiar} required maxLength={20} autoComplete="tel" placeholder="+56 9 1234 5678" className="campo pl-10" />
        </Campo>
        <Campo id="password" etiqueta="Contraseña" Icono={LuLock} ayuda="Mínimo 8 caracteres.">
          <CampoPassword id="password" value={form.password} onChange={cambiar} autoComplete="new-password" Icono={LuLock} />
        </Campo>

        <button type="submit" disabled={cargando} className="btn-primario w-full py-2.5">
          {cargando ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-suave">
        ¿Ya tienes cuenta?{" "}
        <Link to={rutas.iniciarSesion} className="font-semibold text-mar-600 hover:underline dark:text-mar-300">
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Registro;
