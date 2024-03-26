import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../utils/auth";
import {
  PlusSignSquareIcon,
  InformationCircleIcon,
  PencilEdit01Icon,
} from "../IconsSVG/Icons";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const BASE_URL = "http://localhost:3307/uploads/";
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:3307/perfil/${user.id}`, { withCredentials: true })
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
  }, [user]);

  if (!user || !user.id) {
    return (
      <div
        role="alert"
        className="flex min-h-[100dvh] items-center justify-center"
      >
        <div className="mr-2">
          <InformationCircleIcon />
        </div>
        <span className="text-2xl font-bold">
          Inicia sesión para ver tu perfil.
        </span>
      </div>
    );
  }

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
        <div className="grid grid-cols-2 gap-4">
          <button className="flex flex-row gap-1 px-4 py-2 text-sm font-bold bg-gray-200 hover:bg-gray-300 dark:text-gray-800 dark:bg-gray-100 rounded-md dark:hover:bg-gray-300 focus:outline-none">
            <PlusSignSquareIcon />
            Seguir
          </button>
          <button className="flex flex-row gap-1  px-4 py-2 text-sm font-bold bg-gray-200 hover:bg-gray-300 dark:text-gray-800 dark:bg-gray-100 rounded-md dark:hover:bg-gray-300 focus:outline-none">
            <PencilEdit01Icon />
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
