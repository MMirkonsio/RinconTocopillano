import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomeScreen from "./screens/HomeScreen";
import Publicaciones from "./components/Publicaciones";
import PublicacionScreen from "./screens/PublicacionScreen";
import Editar from "./screens/EditPerfil";
import PerfilUsuario from "./screens/PerfilUsuario";
import BandejaDeEntrada from "./components/BandejaEntrada";
import GuardadosP from "./components/Guardados";
import AyudaUser from "./components/Ayuda";
import Registro from "./screens/Registrarse";
import InicioSesion from "./screens/InicioSesion";


function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas con Navbar */}
        <Route
          path="*"  // Cambia la ruta principal a "*"
          element={
            <div className="bg-gray-100 overflow-hidden mx-auto flex flex-col dark:bg-rincon dark:text-gray-100">
              <Navbar />
              <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/inicio" element={<HomeScreen />} />
                <Route
                  path="/publicaciones"
                  element={
                      <Publicaciones />
                  }
                />
                <Route path="/publicar" element={<PublicacionScreen />} />
                <Route
                  path="/bandeja-de-entrada"
                  element={<BandejaDeEntrada />}
                />
                <Route path="/guardados" element={<GuardadosP />} />
                <Route path="/ayuda" element={<AyudaUser />} />
                <Route path="/perfil" element={<PerfilUsuario />} />
                <Route path="/api/guardar-perfil" element={<Editar />} />
                
              </Routes>
            </div>
          }
        />

        {/* Ruta sin Navbar */}
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<InicioSesion />} />
      </Routes>
    </Router>
  );
}

export default App;
