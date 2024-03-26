import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MdOutlineSearchOff } from "react-icons/md";
import Fade from "react-reveal/Fade"; // Importar el componente Fade

const PublicacionesXCategoria = () => {
  const { categoria_id } = useParams();
  const [publicaciones, setPublicaciones] = useState([]);
  const [nombreCategoria, setNombreCategoria] = useState("");
  const BASE_URL = "http://localhost:3307";

  useEffect(() => {
    axios
      .get(`http://localhost:3307/categorias/${categoria_id}`)
      .then((response) => {
        if (response.data.length > 0) {
          setNombreCategoria(response.data[0].nombre_categoria);
          setPublicaciones(response.data.filter((item) => item.publicacion_id));
        }
      })
      .catch((error) => {
        console.error(
          "Error al obtener la categoría y las publicaciones:",
          error
        );
      });
  }, [categoria_id]);

  return (
    <div className="epilogue">
      {nombreCategoria && ( // Verificar si nombreCategoria está presente
        <h2 className="mb-4 font-bold text-2xl">
          Publicaciones de {nombreCategoria}
        </h2>
      )}
      {publicaciones.length === 0 && (
        <div className="flex flex-row  mb-4 epilogue relative gap-2 items-center">
          <MdOutlineSearchOff className="h-12 w-12 " />
          <p className="font-semibold text-red-500">
            No hay publicaciones disponibles en esta categoría
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {publicaciones.map((publicacion, index) => (
          <Fade key={`${publicacion.id}_${index}`}>
            {/* Agregar el componente Fade */}
            <div className="dark:hover:bg-rinconHover hover:bg-gray-200 p-4 shadow-md rounded-lg cursor-pointer">
              <img
                src={`${BASE_URL}/uploads/${publicacion.imagen_contenido}`}
                alt="Imagen de la publicación"
                className="w-full h-auto object-cover rounded-lg mb-2"
                style={{ width: "600px", height: "300px" }}
              />
              <p className="dark:text-gray-100 text-gray-800 font-semibold text-xl">
                {publicacion.titulo}
              </p>
              <p className="dark:text-gray-300 text-gray-600">
                Precio: ${publicacion.precio}
              </p>
            </div>
          </Fade>
        ))}
      </div>
    </div>
  );
};

export default PublicacionesXCategoria;
