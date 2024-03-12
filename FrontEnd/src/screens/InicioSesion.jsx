import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Darkmode from "../components/DarkMode";
import { login } from "../utils/auth";


const InicioSesion = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleInicioSesion = async () => {
    try {
      if (!password) {
        console.error('La contraseña no puede estar vacía');
        return;
      }

  
      const response = await fetch("http://localhost:3307/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: email,
          password: password,
        }),
        credentials: 'include',  // Agrega esta línea
      });

      
    const usuario = await response.json();

    if (usuario && usuario.usuario_id && usuario.correo && usuario.nombre_usuario) {
      const usuarioAutenticado = {
        id: usuario.usuario_id, // Usa el nombre correcto de la propiedad
        correo: usuario.correo,
        nombre_usuario: usuario.nombre_usuario,
      };
      login(usuarioAutenticado);
      navigate("/inicio");
    } else if (usuario && usuario.error) {
      console.error("Error del servidor:", usuario.error);
      // Manejar el mensaje de error según tus necesidades
    } else {
      console.error("Respuesta del servidor no válida:", usuario);
    }

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
  }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-rincon dark:text-gray-100 epilogue">
      <Darkmode />
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Bienvenido al Rincon Tocopillano!</h1>
        <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
          El mejor lugar para publicar tus productos.
        </p>
      </div>
      <div className="grid gap-6 sm:max-w-[500px]">
        <div className="space-y-2 block text-sm font-bold mb-2">
          <label >Email</label>
          <input
            id="correo"
            type="email"
            className="w-full px-4 py-2 border rounded-md dark:text-gray-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Correo electrónico"
          />

        </div>
        <div className="space-y-2 block text-sm font-bold mb-2">
          <label >Contraseña</label>
          <input
            id="password"
            type="password"
            className="w-full px-4 py-2 border rounded-md dark:text-gray-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="w-full bg-rinconClaro dark:hover:bg-rinconHover text-white px-4 py-2 rounded-md"
          onClick={handleInicioSesion}
        >
          Iniciar
        </button>
      </div>
      <div className="grid max-w-[400px]  mt-4">
        <p className="flex flex-col gap-1 text-center text-sm text-gray-500 dark:text-gray-300">
          No tienes una cuenta?
          <Link to="/registro" className="underline text-rincon dark:text-gray-100">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default InicioSesion;
