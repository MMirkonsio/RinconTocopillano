import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import Publicaciones from "./components/Publicaciones"; // Importa el componente Publicaciones
import PublicacionScreen from "./screens/PublicacionScreen";
import Editar from "./screens/EditPerfil";
import PerfilesdeUsuarios from "./screens/PerfilesdeUsuarios";
import Bandeja from "./screens/BandejaDeEntrada";
import GuardadosP from "./screens/GuardadosP";
import AyudaUser from "./screens/AyudaUser";
import Registro from "./screens/Registrarse";
import InicioSesion from "./screens/InicioSesion";
import CategoriasScreen from "./screens/CategoriasScreen";

function App() {
  const [searchTerm, setSearchTerm] = useState(""); // Importa useState desde React y úsalo aquí

  return (
    <div className="min-h-[100dvh] mx-auto dark:bg-rincon dark:text-gray-100  bg-gray-100">
      <Router>
        <Routes>
          <Route
            path="*"
            element={
              <>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <HomeScreen
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                      />
                    }
                  />
                  <Route
                    path="/inicio"
                    element={
                      <HomeScreen
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                      />
                    }
                  />
                  <Route
                    path="/publicaciones"
                    element={<Publicaciones searchTerm={searchTerm} />}
                  />
                  <Route path="/publicar" element={<PublicacionScreen />} />
                  <Route
                    path="/bandeja-de-entrada/:usuario_id"
                    element={<Bandeja />}
                  />

                  <Route path="/guardados" element={<GuardadosP />} />
                  <Route path="/ayuda" element={<AyudaUser />} />
                  <Route
                    path="/perfil/:usuario_id"
                    element={<PerfilesdeUsuarios />}
                  />
                  <Route path="/api/guardar-perfil" element={<Editar />} />
                  <Route
                    path="/categorias/:categoria_id"
                    element={<CategoriasScreen />}
                  />
                </Routes>
              </>
            }
          />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<InicioSesion />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
