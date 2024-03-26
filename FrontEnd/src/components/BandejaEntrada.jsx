import { useState, useEffect } from "react";
import { FiBell } from "react-icons/fi";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import { useAuth } from "../utils/auth";

const BASE_URL = "http://localhost:3307";

const BandejaEntrada = ({ usuario_id, actualizarNotificaciones }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const obtenerNotificaciones = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/notificaciones/${usuario_id}`
        );
        setNotificaciones(response.data);
        actualizarNotificaciones(response.data.length); // Actualizar el estado de las notificaciones en el Navbar
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Sesión expirada. Vuelve a iniciar sesión.");
        } else {
          setError(error.message || "Error al obtener las notificaciones");
        }
        setLoading(false);
      }
    };

    obtenerNotificaciones();
  }, [usuario_id, actualizarNotificaciones]);

  useEffect(() => {
    // Reiniciar notificacionesCount a cero al montar el componente
    actualizarNotificaciones(0);

    // Marcar todas las notificaciones como leídas en el backend
    async function marcarNotificacionesLeidas() {
      try {
        await axios.put(`${BASE_URL}/notificaciones/${usuario_id}`);
      } catch (error) {
        console.error("Error al marcar notificaciones como leídas:", error);
      }
    }

    marcarNotificacionesLeidas();
  }, [usuario_id, actualizarNotificaciones]);

  if (loading) {
    return <p>Cargando notificaciones...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (notificaciones.length === 0) {
    return <p>No se encontraron notificaciones.</p>;
  }

  return (
    <div className="flex flex-col relative bg-gray-100 w-full rounded-lg epilogue text-gray-800 dark:bg-rincon dark:text-gray-100">
      <h2 className="flex flex-row text-xl font-semibold mb-4 gap-2">
        <FiBell className="w-6 h-6 " />
        Notificaciones
      </h2>

      {notificaciones
        .filter((notificacion) => notificacion.tipo === "upvote")
        .map((notificacion, index) => (
          <div key={index} className="rounded-lg shadow-md mb-4 p-4">
            <div className="flex items-center justify-between mb-2">
              {user && (
                <div className="flex items-center space-x-3">
                  <Link
                    to={`/perfil/${notificacion.usuario_id}`}
                    className="flex items-center"
                  >
                    <img
                      className="w-10 h-10 rounded-full mr-2"
                      src={`${BASE_URL}/uploads/${notificacion.foto_perfil}`}
                      alt={`Foto de perfil de ${notificacion.nombre_usuario}`}
                    />
                    <span className="font-semibold">
                      {notificacion.nombre_usuario}
                    </span>
                  </Link>
                </div>
              )}
            </div>
            <span className="font-semibold">
              Ha dado like a tu publicación: {notificacion.titulo}
            </span>
          </div>
        ))}
    </div>
  );
};

BandejaEntrada.propTypes = {
  usuario_id: PropTypes.number.isRequired,
  actualizarNotificaciones: PropTypes.func.isRequired,
};

export default BandejaEntrada;
