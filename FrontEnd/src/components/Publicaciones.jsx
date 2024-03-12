import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Post from "./LikesAndDislikes";
import { FaRegCommentAlt, FaRegShareSquare } from "react-icons/fa";
import { useAuth } from "../utils/auth";

function Publicaciones() {
  const [publicaciones, setPublicacion] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const BASE_URL = "http://localhost:3307";

  useEffect(() => {
    axios
      .get("http://localhost:3307/votos-totales-por-usuario")
      .then((response) => {
        const votosTotales = response.data.reduce((acc, voto) => {
          acc[voto.usuario_id] = voto.total_votos_usuario;
          return acc;
        }, {});
  
        setPublicacion((prevPublicaciones) =>
          prevPublicaciones.map((publicacion) => ({
            ...publicacion,
            total_votos_usuario: votosTotales[publicacion.usuario_id] || 0,
          }))
        );
      })
      .catch((error) => {
        console.error("Error al obtener votos totales por usuario:", error);
      });
  

    // Llamada para obtener las publicaciones
    axios
      .get("http://localhost:3307/publicaciones")
      .then((response) => {
        setPublicacion(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener publicaciones:", error);
        setError(error.message || "Error al obtener publicaciones");
      });
  }, []);

  const handleVote = async (publicacion_id, voto) => {
    try {
      if (user && user.id) {
        // Solo permitir votos si el usuario está autenticado
        const response = await axios.post(
          `${BASE_URL}/votos`,
          {
            publicacion_id,
            usuario_id: user.id,
            voto,
          },
          { withCredentials: true }
        );

        // Actualizar el estado de las publicaciones con los nuevos votos
        setPublicacion((prevPublicaciones) =>
          prevPublicaciones.map((publicacion) =>
            publicacion.publicacion_id === publicacion_id
              ? { ...publicacion, likes: response.data.likes }
              : publicacion
          )
        );
      } else {
        // El usuario no está autenticado, puedes redirigirlo a la página de inicio de sesión
      }
    } catch (error) {
      console.error("Error al manejar el voto:", error);
    }
  };

  return error ? (
    <p>Error: {error}</p>
  ) : !publicaciones ? (
    <p>Cargando...</p>
  ) : (
    <div className="mt-4">
      {publicaciones.map((publicacion) => (
        <div key={publicacion.publicacion_id} className="mb-4 epilogue">
          <div className="p-4 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 dark:text-gray-100 dark:bg-rincon dark:hover:bg-rinconHover">
            {/* Sección de foto de perfil y nombre */}
            <div className="flex items-center mb-2">
              <img
                className="w-10 h-10 rounded-full mr-2"
                src={`${BASE_URL}/uploads/${publicacion.foto_perfil}`}
                alt={`Foto de perfil de ${publicacion.nombre_usuario}`}
              />
              <span className="font-semibold">{publicacion.nombre_usuario}</span>
            </div>

            {/* Título y descripción de la publicación */}
            <h3 className="text-xl font-semibold mb-2 m-2">
              {publicacion.titulo}
            </h3>

            {/* Descripción de la publicación */}
            <p className="text-sm mb-2 m-2">{publicacion.contenido}</p>

            {/* Foto Publicación */}
            <div className="flex justify-center h-full w-full rounded-xl border border-gray-100 dark:border-gray-700 border-opacity-75 object-contain overflow-hidden relative">
              <img
                className="absolute left-0 w-full dark:opacity-30 opacity-full object-cover filter blur-[24px]"
                src={publicacion.imagen_contenido}
                alt="Contenido de la publicación"
              />
              <img
                className="h-full w-full object-contain relative max-w-[540px] max-h-[540px]"
                src={publicacion.imagen_contenido}
                alt="Contenido de la publicación"
              />
            </div>

            {/* Sección de Votos y Comentarios */}
            <div className="flex justify-content items-center mt-4 gap-3">
            <Post
              publicacion_id={publicacion.publicacion_id}
              post={{
                votes: publicacion.likes,
                total_votos_usuario: publicacion.total_votos_usuario,
              }}
              handleVote={handleVote}
            />

              <div className="flex flex-row items-center">
                <button className="button flex items-center gap-1 bg-gray-300 dark:bg-rincon2 dark:hover:bg-rincon hover:bg-gray-400 p-2 rounded-full">
                  <FaRegCommentAlt />
                  <span className="text-sm font-semibold mx-2">151</span>
                </button>
              </div>

              <button className="button flex items-center gap-1 bg-gray-300 dark:bg-rincon2 dark:hover:bg-rincon hover:bg-gray-400 p-2 rounded-full">
                <FaRegShareSquare />
                <span className="text-sm font-semibold mx-2">Compartir</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  handleVote: PropTypes.func.isRequired,
};

export default Publicaciones;
