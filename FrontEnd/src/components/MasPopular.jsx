import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const MasPopular = () => {
  const [publicacionesPopulares, setPublicacionesPopulares] = useState([]);
  const BASE_URL = "http://localhost:3307";

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
    <div className="text-gray-800 dark:text-gray-100 block epilogue p-4 rounded-lg  dark:bg-rincon border border-gray-300 dark:border-gray-700 border-opacity-75">
      <h2 className="text-lg font-bold mb-4 uppercase">
        Publicaciones Populares
      </h2>
      <div className="space-y-4">
        {publicacionesPopulares.map((publicacion) => (
          <a
            key={publicacion.id ? publicacion.id : publicacion.publicacion_id} // Usar publicacion.id si está definido, de lo contrario, usar publicacion.publicacion_id
            href={`/publicaciones/${
              publicacion.id ? publicacion.id : publicacion.publicacion_id
            }`} // Establece la URL de destino
            className="block hover:no-underline"
          >
            <div className="flex items-center p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-rinconHover w-full">
              <img
                src={`${BASE_URL}/uploads/${publicacion.imagen_contenido}`}
                alt={publicacion.nombre_usuario}
                className="w-12 h-12 mr-4 rounded-full"
              />
              <div className="flex flex-col overflow-hidden">
                <h3 className="text-base font-semibold truncate">
                  {publicacion.titulo}
                </h3>
                <p className="text-sm text-green-500 font-semibold">
                  {publicacion.likes} Likes
                </p>
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
