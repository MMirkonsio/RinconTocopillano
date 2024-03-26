import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { login } from "../utils/auth";
import Swal from "sweetalert2";
import Navbar2 from "../components/Navbar2";

const InicioSesion = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleInicioSesion = async () => {
    try {
      if (!email || !password) {
        // Verifica si el email o la contraseña están vacíos
        Swal.fire({
          icon: "error",
          title: "Campos Vacíos",
          text: "Por favor ingrese su email y contraseña",
        });
        return; // Detiene la función si los campos están vacíos
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
        credentials: "include", // Agrega esta línea
      });

      const usuario = await response.json();

      if (
        usuario &&
        usuario.usuario_id &&
        usuario.correo &&
        usuario.nombre_usuario
      ) {
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
  };

  return (
    <div className="relative min-h-[100dvh]">
      <Navbar2 />
      <img
        src="/images/tocopilla.jpeg" // Corrige la ruta de la imagen
        alt="Imagen Tocopilla"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex justify-center items-center p-3 epilogue">
        <div className="backdrop-blur-sm bg-white/30 p-8 rounded-md shadow-lg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleInicioSesion();
            }}
            className="mt-8"
          >
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-rincon">
                Bienvenido al Rincon Tocopillano!
              </h1>
              <p className="text-gray-600 md:text-xl">
                El mejor lugar para vender tus productos!
              </p>
            </div>
            <div className="grid gap-6">
              <div className="space-y-2 block text-xl font-bold mb-2">
                <label>Email:</label>
                <input
                  id="correo"
                  type="email"
                  className="w-full px-4 py-2 border rounded-md "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Correo electrónico"
                  autoComplete="current-email"
                />
              </div>
              <div className="space-y-2 block text-xl font-bold mb-2">
                <label>Contraseña:</label>
                <input
                  id="password"
                  type="password"
                  className="w-full px-4 py-2 border rounded-md "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-rincon hover:bg-rinconHover  text-gray-100 px-4 py-2 text-xl rounded-md font-bold"
              >
                Iniciar
              </button>
            </div>
            <div className="grid mt-4">
              <p className="flex flex-row justify-center gap-1 font-semibold text-center text-lg text-gray-900">
                No tienes una cuenta?
                <Link to="/registro" className="underline hover:text-gray-700">
                  Registrate
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InicioSesion;
