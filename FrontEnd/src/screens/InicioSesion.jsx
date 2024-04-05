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
    <div className="flex justify-center items-center min-h-[100dvh] noto-sans bg-gray-100 dark:bg-rincon">
      <Navbar2 />
      <div className="w-full max-w-[500px] p-4 bg-gray-100 lg:border lg:border-gray-300 rounded-lg  sm:p-6 md:p-8 dark:bg-rincon dark:border-gray-700">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleInicioSesion();
          }}
          className="mt-8 dark:text-gray-100 text-rincon"
        >
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold ">
              Bienvenido al Rincon Tocopillano!
            </h1>
          </div>
          <label className="block mb-2 text-sm font-bold">Email:</label>
          <div className="relative mb-4">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 16"
              >
                <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
              </svg>
            </div>
            <input
              id="correo"
              type="email"
              className=" border border-gray-300 text-sm rounded-lg focus:ring-rincon focus:border-rincon block w-full ps-10 p-2.5 dark:border-gray-700 dark:placeholder-gray-400  dark:focus:ring-rincon"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Correo electrónico"
              autoComplete="current-email"
              placeholder="ejemplo@gmail.com"
            />
          </div>
          <div className="space-y-2 block text-xl mb-4">
            <label className="block mb-2 text-sm font-bold dark:text-white">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="border border-gray-300 text-sm rounded-lg focus:ring-rincon focus:border-rincon block w-full p-2.5 dark:border-gray-700 dark:placeholder-gray-400 dark:focus:ring-rincon"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full mb-4 text-white bg-rincon hover:bg-rinconHover  font-semibold rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Iniciar Sesión
          </button>
          <div className="flex flex-row gap-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            No tienes una cuenta?
            <Link
              to="/registro"
              className="text-rincon dark:text-gray-100 hover:underline font-semibold "
            >
              Registrate
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InicioSesion;
