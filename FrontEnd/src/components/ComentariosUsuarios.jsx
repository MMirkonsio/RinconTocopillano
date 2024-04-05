import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import moment from "moment/moment";
import "moment/locale/es";
import { Link } from "react-router-dom";
import { FaEllipsisH } from "react-icons/fa";

const ComentariosUsuarios = ({ publicacion_id }) => {
  const [comentarios, setComentarios] = useState([]);
  const BASE_URL = "http://localhost:3307";

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3307/comentarios/${publicacion_id}`
        );
        setComentarios(response.data.comentarios);
      } catch (error) {
        console.error("Error al obtener los comentarios:", error);
      }
    };

    fetchComentarios();
  }, [publicacion_id]);

  return (
    <div className="mt-8 lg:p-0 p-4 text-rincon dark:text-gray-100">
      {comentarios.map((comentario, index) => (
        <div
          key={`${comentario.id}_${index}`}
          className="flex flex-col text-sm mb-6"
        >
          <div className="flex items-center mb-2">
            <Link to={`/perfil/${comentario.usuario_id}`}>
              <img
                className="w-10 h-10 rounded-full"
                src={`${BASE_URL}/uploads/${comentario.foto_perfil}`}
                alt={`Foto de perfil de ${comentario.nombre_usuario}`}
              />
            </Link>
            <div className="flex flex-col ml-2">
              <Link to={`/perfil/${comentario.usuario_id}`}>
                <p className="text-lg font-semibold">
                  {comentario.nombre_usuario}
                </p>
              </Link>
              <span className="text-xs text-gray-500">
                {moment(comentario.tiempo_comentario).fromNow()}
              </span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col text-sm mb-1">
              <p className="text-sm mb-2 break-words">{comentario.contenido}</p>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-xs">Responder</button>
              <button className="text-xs">Compartir</button>
              <FaEllipsisH className="h-5 w-5 text-gray-500" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

ComentariosUsuarios.propTypes = {
  publicacion_id: PropTypes.string.isRequired,
};

export default ComentariosUsuarios;
