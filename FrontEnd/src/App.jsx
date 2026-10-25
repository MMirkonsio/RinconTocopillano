import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { Toaster } from "sonner";
import { API } from "./config";
import { categoriaSlug, rutas } from "./lib/rutas";
import HomeScreen from "./screens/HomeScreen";
import PubliPostScreen from "./screens/PubliPostScreen";
import PublicacionScreen from "./screens/PublicacionScreen";
import EditPerfil from "./screens/EditPerfil";
import PerfilesdeUsuarios from "./screens/PerfilesdeUsuarios";
import BandejaDeEntrada from "./screens/BandejaDeEntrada";
import GuardadosScreen from "./screens/GuardadosScreen";
import AyudaUser from "./screens/AyudaUser";
import Registro from "./screens/Registrarse";
import InicioSesion from "./screens/InicioSesion";
import CategoriasScreen from "./screens/CategoriasScreen";
import NoEncontrado from "./screens/NoEncontrado";

// ---------------------------------------------------------------------------
// Redirecciones desde las URLs antiguas (enlaces compartidos antes del cambio)
// ---------------------------------------------------------------------------

// Redirige a `destino` conservando los parámetros (?q=…) de la URL actual
function Redirigir({ a }) {
  const { search, state } = useLocation();
  return <Navigate to={`${a}${a.includes("?") ? "" : search}`} state={state} replace />;
}

// /categorias/1 → /categoria/comida
function RedirigirCategoria() {
  const { categoria_id } = useParams();
  const id = Number(categoria_id);
  if (!Number.isInteger(id) || id < 1 || id > 7) return <NoEncontrado />;
  return <Navigate to={`/categoria/${categoriaSlug(id)}`} replace />;
}

// /perfil/36 → /usuario/prueba1 (hay que preguntar el nombre al backend)
function RedirigirPerfil() {
  const { usuario_id } = useParams();
  const [destino, setDestino] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/usuarios/id/${usuario_id}`)
      .then(({ data }) => setDestino(rutas.usuario(data.nombre_usuario)))
      .catch(() => setDestino(false));
  }, [usuario_id]);

  if (destino === false) return <NoEncontrado />;
  return destino ? <Navigate to={destino} replace /> : null;
}

// Rutas de la aplicación (separadas de BrowserRouter para poder probarlas)
export function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/publicacion/:publicacion_id/:slug?" element={<PubliPostScreen />} />
      <Route path="/publicar" element={<PublicacionScreen />} />
      <Route path="/usuario/:nombre" element={<PerfilesdeUsuarios />} />
      <Route path="/categoria/:slug" element={<CategoriasScreen />} />
      <Route path="/guardados" element={<GuardadosScreen />} />
      <Route path="/notificaciones" element={<BandejaDeEntrada />} />
      <Route path="/ajustes" element={<EditPerfil />} />
      <Route path="/ayuda" element={<AyudaUser />} />
      <Route path="/iniciar-sesion" element={<InicioSesion />} />
      <Route path="/registro" element={<Registro />} />

      {/* URLs antiguas */}
      <Route path="/inicio" element={<Redirigir a="/" />} />
      <Route path="/login" element={<Redirigir a={rutas.iniciarSesion} />} />
      <Route path="/editar-perfil" element={<Redirigir a={rutas.ajustes} />} />
      <Route path="/guardados/:usuario_id" element={<Redirigir a={rutas.guardados} />} />
      <Route path="/bandeja-de-entrada/:usuario_id" element={<Redirigir a={rutas.notificaciones} />} />
      <Route path="/categorias/:categoria_id" element={<RedirigirCategoria />} />
      <Route path="/perfil/:usuario_id" element={<RedirigirPerfil />} />

      <Route path="*" element={<NoEncontrado />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Rutas />
      <Toaster position="bottom-center" richColors closeButton offset={88} mobileOffset={88} />
    </BrowserRouter>
  );
}

export default App;
