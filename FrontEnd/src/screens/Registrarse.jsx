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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-rincon dark:text-gray-100 noto-sans">
      <Navbar2 />
      <div className="w-full max-w-[500px] p-4 bg-gray-100 lg:border lg:border-gray-300 rounded-lg  sm:p-6 md:p-8 dark:bg-rincon dark:border-gray-700 ">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold ">Registrate!</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mt-8 dark:text-gray-100 text-rincon"
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  focus:ring-rincon focus:border-rincon dark:focus:ring-gray-100"
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  focus:ring-rincon focus:border-rincon dark:focus:ring-gray-100"
              required
            />
          </div>

          {/* Fila 3 */}
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  focus:ring-rincon focus:border-rincon dark:focus:ring-gray-100"
              required
            />
          </div>

          {/* Fila 4 */}
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  focus:ring-rincon focus:border-rincon dark:focus:ring-gray-100"
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
              className="block w-full text-sm text-rincon border border-gray-300  rounded-md cursor-pointer bg-gray-100 dark:text-rincon focus:outline-none dark:placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            className="w-full mb-4 text-white bg-rincon hover:bg-rinconHover  font-semibold rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Registrarse
          </button>
          <div className="max-w-[400px]">
            <p className="flex flex-row gap-1 text-right text-sm text-gray-500 dark:text-gray-300">
              Ya tienes una cuenta?
              <Link
                to="/login"
                className="hover:underline text-rincon dark:text-gray-100 font-semibold"
              >
                Inicia Sesión!
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;
