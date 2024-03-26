import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Importar el hook useParams
import Fade from "react-reveal/Fade"; // Cambiar la importación

const TodasPublicacionesUsu = () => {
  const { usuario_id } = useParams(); // Obtener el usuario_id de los parámetros de la URL
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!usuario_id) {
      // Verificar si hay un usuario_id disponible
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:3307/publicaciones/${usuario_id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setPublicaciones(response.data);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setErrorMessage(
            "La sesión ha expirado o el usuario no está autenticado"
          );
        } else if (error.response && error.response.status === 403) {
          setErrorMessage(
            "No tienes permiso para ver las publicaciones de este usuario"
          );
        } else {
          setErrorMessage("Error al obtener las publicaciones");
        }
        setLoading(false);
      });
  }, [usuario_id]); // Agregar usuario_id como dependencia

  if (loading) {
    return (
      <span className="loading loading-spinner loading-lg">Cargando...</span>
    );
  }

  if (errorMessage) {
    return (
      <div role="alert" className="text-red-600">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="grid lg:grid-cols-3 gap-4 p-4">
        {publicaciones.map((publicacion, index) => (
          <Fade key={`${publicacion.id}_${index}`}>
            <div
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
          </Fade>
        ))}
      </div>
    </div>
  );
};

export default TodasPublicacionesUsu;
