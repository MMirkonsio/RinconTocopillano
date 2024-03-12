import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const MasPopular = () => {
  const [publicacionesPopulares, setPublicacionesPopulares] = useState([]);

  useEffect(() => {
    // Obtener las publicaciones populares del servidor
    axios
      .get("http://localhost:3307/populares")
      .then((response) => {
        setPublicacionesPopulares(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener publicaciones populares:", error);
      });
  }, []);

  return (
    <div className="text-gray-800 dark:text-gray-100 bg-gray-100 border dark:border-gray-100 border-gray-300 max-w-max epilogue p-4 rounded-lg shadow-md dark:bg-rincon">
      <h2 className="text-lg font-semibold mb-4 uppercase">
        Publicaciones Populares
      </h2>
      <div className="space-y-4">
        {publicacionesPopulares.map((publicacion) => (
          <a
            key={`${publicacion.id}-${publicacion.usuario_id}`}
            href={`/publicaciones/${publicacion.id}`} // Establece la URL de destino
            className="block hover:no-underline"
          >
            <div className="flex items-center p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-rinconHover">
              <img
                src={publicacion.imagen_perfil}
                alt={publicacion.nombre_usuario}
                className="w-12 h-12 mr-4 rounded-full"
              />
              <div>
                <h3 className="text-base font-semibold">{publicacion.titulo}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-100">{publicacion.likes} Likes</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

MasPopular.propTypes = {
  publicacionesPopulares: PropTypes.array,
};

export default MasPopular;