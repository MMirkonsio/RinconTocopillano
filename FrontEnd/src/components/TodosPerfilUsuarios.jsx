import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../utils/auth";
import { PlusSignSquareIcon, PencilEdit01Icon } from "../IconsSVG/Icons";

const TodosUsuarios = () => {
  const { usuario_id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const BASE_URL = "http://localhost:3307/uploads/";
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3307/perfil/${usuario_id}`, {})
      .then((response) => {
        setUsuario(response.data);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.error("Sesión expirada. Vuelve a iniciar sesión.");
        } else {
          setError(error.message || "Error al obtener el perfil");
        }
        setLoading(false);
      });
  }, [usuario_id]);

  if (loading) {
    return (
      <span className="loading loading-spinner loading-lg">Cargando...</span>
    );
  }

  return (
    <div className="flex flex-col items-left gap-2 text-center p-4 border-b dark:border-gray-700 border-gray-300">
      <div className="flex flex-row items-center gap-4">
        {/* Contenedor de la foto de perfil */}
        <div className="flex-shrink-0 w-32 h-32 rounded-full overflow-hidden mb-4">
          {usuario && usuario.foto_perfil && (
            <img
              className="w-full h-full object-cover"
              src={`${BASE_URL}${usuario.foto_perfil}`}
              alt={`Foto de perfil de ${usuario.nombre_usuario}`}
            />
          )}
        </div>

        {/* Contenedor del nombre y botones */}
        <div className="flex flex-col items-start text-left">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">
              {usuario && usuario.nombre_usuario}
            </h2>
            {/* Botón de editar (si el usuario es el propietario del perfil) */}
            {user && user.id === usuario.id && (
              <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-gray-200 hover:bg-gray-300 dark:text-gray-800 dark:bg-gray-100 rounded-md dark:hover:bg-gray-300 focus:outline-none">
                <PencilEdit01Icon className="h-4 w-4" />
                Editar
              </button>
            )}
            {/* Botón de seguir (si el usuario no es el propietario del perfil) */}
            {!user ||
              (user.id !== usuario.id && (
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-gray-200 hover:bg-gray-300 dark:text-gray-800 dark:bg-gray-100 rounded-md dark:hover:bg-gray-300 focus:outline-none">
                  <PlusSignSquareIcon className="h-4 w-4" />
                  Seguir
                </button>
              ))}
          </div>
          <div className="flex flex-col gap-1 text-sm text-gray-500 dark:text-gray-400 mt-3">
            <span>
              <strong>Teléfono:</strong> {usuario && usuario.telefono}
            </span>
            <span>
              <strong>Dirección:</strong> {usuario && usuario.direccion}
            </span>
            <span>
              <strong>Horario:</strong> {usuario && usuario.horario}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodosUsuarios;
