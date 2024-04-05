import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FiTrash } from "react-icons/fi";
import { FaRegEye } from "react-icons/fa";
import axios from "axios";
import moment from "moment/moment";
import { Link } from "react-router-dom";
import "moment/locale/es";
import { InformationCircleIcon } from "../IconsSVG/Icons";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.css";
import { useAuth } from "../utils/auth";

const PublicacionGuardada = ({ usuario_id }) => {
  const [publicacionesGuardadas, setPublicacionesGuardadas] = useState([]);
  const { user } = useAuth(); // Obtiene el usuario autenticado

  useEffect(() => {
    const fetchPublicacionesGuardadas = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3307/obtener-guardados/${usuario_id}`
        );
        setPublicacionesGuardadas(response.data);
      } catch (error) {
        console.error("Error al obtener las publicaciones guardadas:", error);
      }
    };

    fetchPublicacionesGuardadas();
  }, [usuario_id]);

  const eliminarPublicacion = async (publicacion_id) => {
    // Mostrar una alerta de confirmación antes de eliminar la publicación
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    // Si el usuario confirma la eliminación, proceder con la eliminación
    if (confirmacion.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:3307/eliminar-publicacion/${publicacion_id}`,
          { data: { usuario_id } }
        );
        setPublicacionesGuardadas((prevPublicaciones) =>
          prevPublicaciones.filter(
            (pub) => pub.publicacion_id !== publicacion_id
          )
        );
        // Mostrar una alerta de éxito después de eliminar la publicación
        Swal.fire(
          "Eliminado",
          "La publicación ha sido eliminada correctamente",
          "success"
        );
      } catch (error) {
        console.error("Error al eliminar la publicación:", error);
        // Mostrar una alerta de error si ocurre un error al eliminar la publicación
        Swal.fire(
          "Error",
          "Ha ocurrido un error al eliminar la publicación",
          "error"
        );
      }
    }
  };

  const renderTiempoPublicacion = (tiempo) => {
    return moment(tiempo).format("MM/DD/YYYY");
  };

  // Si el usuario no está autenticado, mostrar un mensaje en lugar del contenido de la publicación
  if (!user) {
    return (
      <div className="flex justify-center mt-[30dvh]">
        <div role="alert" className="mr-2">
          <InformationCircleIcon />
        </div>
        <span className="text-2xl font-bold break-words">
          Inicia sesión para poder ver tus publicaciones guardadas.
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh]">
      {publicacionesGuardadas.length === 0 ? (
        <div className="flex  mx-10 mt-28 justify-center items-center">
          <div role="alert" className="mr-2">
            <InformationCircleIcon className="mr-2" />
          </div>
          <span className="text-2xl font-bold ">
            No tienes publicaciones guardadas.
          </span>
        </div>
      ) : (
        publicacionesGuardadas.map((publicacion, index) => (
          <div
            key={`${publicacion}_${index}`}
            className="bg-gray-100 w-full rounded-lg text-gray-800 dark:bg-rincon dark:text-gray-100 mb-3"
          >
            <div className="border lg:m-0 m-4 border-gray-300 dark:border-gray-700 border-opacity-75 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6 px-4 py-6 md:gap-8 md:px-6">
                <div className="flex items-center">
                  <img
                    className="w-20 h-20 rounded-full mr-2 object-cover"
                    src={`http://localhost:3307/uploads/${publicacion.imagen_contenido}`}
                    alt="Contenido de la publicación"
                  />
                  <div>
                    <h2 className="text-xl font-semibold">
                      {publicacion.titulo}
                    </h2>
                    <span className="text-gray-500 text-sm">
                      Publicado el{" "}
                      {renderTiempoPublicacion(publicacion.tiempo_publicacion)}
                    </span>
                  </div>
                </div>
                <div className="flex lg:justify-end items-center gap-1.5">
                  <Link
                    to={`/publicacion/${publicacion.publicacion_id}/comments`}
                  >
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 h-8">
                      <FaRegEye className="h-5 w-5" />
                    </button>
                  </Link>
                  <button
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 h-8"
                    onClick={() =>
                      eliminarPublicacion(publicacion.publicacion_id)
                    }
                  >
                    <FiTrash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

PublicacionGuardada.propTypes = {
  usuario_id: PropTypes.string,
};

export default PublicacionGuardada;
