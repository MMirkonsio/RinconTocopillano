import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { PlusSignSquareIcon, PencilEdit01Icon } from "../IconsSVG/Icons";
import PropTypes from 'prop-types';


const TodosUsuarios = (props) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const BASE_URL = "http://localhost:3000/uploads/";
  const { user, handleSignOut } = UserAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (user) {
          // Obtener el perfil del usuario actual desde Supabase
          const { data, error } = await supabase
            .from('usuarios')
            .select('nombre_usuario, foto_perfil')
            .eq('id', user.id)
            .single();

          if (error) {
            throw new Error(error.message);
          }

          setUsuario(data);
          setLoading(false);
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [props.user]);

  if (!user) {
    // Si el usuario no está disponible, muestra un mensaje de carga
    return <span className="loading loading-spinner loading-lg">Cargando...</span>;
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
            {user  && (
              <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-gray-200 hover:bg-gray-300 dark:text-gray-800 dark:bg-gray-100 rounded-md dark:hover:bg-gray-300 focus:outline-none">
                <PencilEdit01Icon className="h-4 w-4" />
                Editar
              </button>
            )}
            {/* Botón de seguir (si el usuario no es el propietario del perfil) */}
            {user  && (
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-gray-200 hover:bg-gray-300 dark:text-gray-800 dark:bg-gray-100 rounded-md dark:hover:bg-gray-300 focus:outline-none">
                  <PlusSignSquareIcon className="h-4 w-4" />
                  Seguir
                </button>
              )}
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

// Define PropTypes para el componente
TodosUsuarios.propTypes = {
  user: PropTypes.object.isRequired // Define la forma de la prop 'user'
};

export default TodosUsuarios;
