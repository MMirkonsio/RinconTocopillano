//Registrarse.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import "../App.css";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.css";
import Navbar2 from "../components/Navbar2";

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    correo: "",
    telefono: "",
    password: "",
    foto_perfil: null, // Inicializar a null
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = e.target.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFormData({
            ...formData,
            [name]: file,
          });

          Swal.fire({
            title: "Tu foto de perfil",
            imageUrl: event.target.result,
            imageAlt: "Tu foto se ha registrado",
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar que la contraseña sea una cadena de caracteres
    if (
      !formData.password ||
      typeof formData.password !== "string" ||
      !formData.password.trim()
    ) {
      setError("La contraseña no es válida");
      return;
    }

    try {
      const formDataToSend = new FormData();

      for (const key in formData) {
        if (key === "password") {
          formDataToSend.append("password", formData["password"]);
        } else if (key === "foto_perfil" && formData[key] !== null) {
          formDataToSend.append("foto_perfil", formData["foto_perfil"]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }

      const response = await fetch("http://localhost:3307/registro", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        console.log("Usuario registrado con éxito");

        // Muestra la alerta SweetAlert2
        Swal.fire({
          title: "Datos registrados",
          text: "Tu registro ha sido exitoso.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        // Puedes redirigir a la página de inicio u realizar otras acciones después del registro
      } else {
        const responseData = await response.json();
        setError(
          responseData.error || "Error desconocido al registrar usuario"
        );
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setError("Error de red al intentar registrar usuario");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-rincon dark:text-gray-100 epilogue">
      <div className="absolute w-full top-0">
        <Navbar2 />
      </div>
      <div className="p-8 text-left">
        <h2 className="text-4xl font-bold mb-6 ">Registro</h2>

        <form
          onSubmit={handleSubmit}
          className="sm:grid sm:grid-cols-3 sm:gap-4   sm:max-w-[500px]"
          acceptCharset="UTF-8"
        >
          {/* Fila 1 */}
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="nombre_usuario"
            >
              Nombre de usuario
            </label>
            <input
              type="text"
              id="nombre_usuario"
              name="nombre_usuario"
              value={formData.nombre_usuario}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Fila 2 */}
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="correo">
              Correo
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Fila 3 */}
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="telefono">
              Teléfono
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Fila 4 */}
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          {/* Mensaje de error */}
          {error && (
            <div className="col-span-3 text-red-500 text-sm mb-4">{error}</div>
          )}
          {/* Fila 5 */}
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="foto_perfil"
            >
              Foto de perfil
            </label>
            <input
              type="file"
              name="foto_perfil"
              onChange={handleChange}
              className="shadow appearance-none  rounded w-[330px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="col-span-3 flex items-center justify-between mt-6">
            <button
              type="submit"
              className="bg-rinconClaro hover:bg-rinconHover text-white py-2 px-4 rounded-md focus:outline-none focus:shadow-outline font-bold"
            >
              Registrarse
            </button>
            <div className="grid max-w-[400px]">
              <p className="flex flex-col gap-1 text-right text-sm text-gray-500 dark:text-gray-300">
                Ya tienes una cuenta?
                <Link
                  to="/login"
                  className="underline text-rincon dark:text-gray-100"
                >
                  Inicia Sesión!
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;
