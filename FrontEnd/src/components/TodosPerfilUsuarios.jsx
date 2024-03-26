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
    <div className="mt-8">
      <div className="flex flex-col mb-6 items-center gap-2 text-center">
        <div className="w-64 h-64 rounded-full overflow-hidden mb-3">
          {usuario && usuario.foto_perfil && (
            <img
              className="w-full h-full object-cover rounded-full ring ring-gray-300 dark:ring-gray-300"
              src={`${BASE_URL}${usuario.foto_perfil}`}
              alt={`Foto de perfil de ${usuario.nombre_usuario}`}
            />
          )}
        </div>

        <div className="grid gap-0.5">
          <h2 className="text-2xl font-bold">
            {usuario && usuario.nombre_usuario}
          </h2>
          <div className="grid grid-cols-1 text-sm mt-2 mb-5 text-gray-500 dark:text-gray-400">
            <span className="font-semibold">
              Teléfono: {usuario && usuario.telefono}
            </span>
            <span className="font-semibold">
              Dirección: {usuario && usuario.direccion}
            </span>
            <span className="font-semibold">
              Horario: {usuario && usuario.horario}
            </span>
          </div>
        </div>
        {user && user.id === usuario.id && (
          <div className="flex justify-center col-span-2">
            <button className="flex flex-row gap-1 px-4 py-2 text-sm font-bold bg-gray-200 hover:bg-gray-300 dark:text-gray-800 dark:bg-gray-100 rounded-md dark:hover:bg-gray-300 focus:outline-none">
              <PencilEdit01Icon />
              Editar
            </button>
          </div>
        )}
        {!user ||
          (user.id !== usuario.id && (
            <div className="flex justify-center col-span-2">
              <button className="flex flex-row gap-1 px-4 py-2 text-sm font-bold bg-gray-200 hover:bg-gray-300 dark:text-gray-800 dark:bg-gray-100 rounded-md dark:hover:bg-gray-300 focus:outline-none">
                <PlusSignSquareIcon />
                Seguir
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TodosUsuarios;
