import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../utils/auth";

const PublicacionCollage = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(""); // Nuevo estado para el mensaje de error
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:3307/publicaciones/${user.id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setPublicaciones(response.data);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // Si recibimos un estado de error 401, actualizamos el estado del mensaje
          setErrorMessage(
            "La sesión ha expirado o el usuario no está autenticado"
          );
        } else if (error.response && error.response.status === 403) {
          // Si recibimos un estado de error 403, actualizamos el estado del mensaje
          setErrorMessage(
            "No tienes permiso para ver las publicaciones de este usuario"
          );
        } else {
          // En caso de otros errores, mostramos el mensaje de error genérico
          setErrorMessage("Error al obtener las publicaciones");
        }
        setLoading(false);
      });
  }, [user]);

  if (!user || !user.id) {
    return null; // Otra opción podría ser redirigir al usuario a iniciar sesión
  }

  if (loading) {
    return (
      <span className="loading loading-spinner loading-lg">Cargando...</span>
    );
  }

  // Si hay un mensaje de error, mostrarlo en lugar de las publicaciones
  if (errorMessage) {
    return (
      <div role="alert" className="text-red-600">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="grid lg:w-2/3 md:grid-cols-3 gap-4 p-4">
        {publicaciones.map((publicacion, index) => (
          <div
            key={`${publicacion.id}_${index}`}
            className="relative overflow-hidden rounded-lg border transition duration-300"
            style={{ cursor: "pointer" }}
          >
            <img
              alt="Publicación"
              src={`http://localhost:3307/uploads/${publicacion.imagen_contenido}`}
              className="w-full h-full object-cover"
              style={{ width: "600px", height: "300px" }}
            />
            {/* Mostrar el precio al hacer hover */}
            <div className="absolute inset-0 bg-black opacity-0 hover:opacity-60 transition duration-300 flex justify-center items-center">
              <div className="px-4 py-2 text-gray-50 text-center opacity-100 text-opacity-100 font-semibold text-2xl hover:opacity-100  rounded-lg">
               {publicacion.titulo}
               <br />
               Precio: ${publicacion.precio}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicacionCollage;
