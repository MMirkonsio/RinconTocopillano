import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Post from "./LikesAndDislikes";
import { FaEllipsisH } from "react-icons/fa";
import { GoComment } from "react-icons/go";
import { Bookmark, Share } from "feather-icons-react";
import { CiTrash } from "react-icons/ci";
import { IoIosLink } from "react-icons/io";
import moment from "moment/moment";
import "moment/locale/es";
moment.locale("es");
import { useAuth } from "../utils/auth";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { MdOutlineSearchOff } from "react-icons/md";
import { Toaster, toast } from "sonner";

function Publicaciones({ searchTerm }) {
  const [publicaciones, setPublicaciones] = useState([]);
  const [error, setError] = useState(null);
  const [totalVotesMap, setTotalVotesMap] = useState({});
  const [menuOpen, setMenuOpen] = useState([]);
  const { user } = useAuth();
  const BASE_URL = "http://localhost:3307";
  const menuRef = useRef(null);
  const [publicacionesGuardadas, setPublicacionesGuardadas] = useState(
    new Set()
  );
  const [copyMenuOpen, setCopyMenuOpen] = useState(null); // Cambiado a null para almacenar el id de la publicación seleccionada
  const [, setCopiedMap] = useState({});

  const handleCopyLink = (publicacion_id) => {
    const link = `${window.location.origin}/publicacion/${publicacion_id}/comments`;
    navigator.clipboard.writeText(link);
    setCopiedMap((prevMap) => ({
      ...prevMap,
      [publicacion_id]: true, // Establecer la publicación seleccionada como copiada
    }));
    setTimeout(() => {
      setCopiedMap((prevMap) => ({
        ...prevMap,
        [publicacion_id]: false, // Restaurar el estado de "Enlace copiado" después de un tiempo
      }));
    }, 3000);
  };

  useEffect(() => {
    const fetchPublicacionesGuardadas = async () => {
      try {
        if (!user || !user.id) return;
        const response = await axios.get(
          `${BASE_URL}/obtener-guardados/${user.id}`
        );
        const guardadas = new Set(
          response.data.map((publicacion) => publicacion.publicacion_id)
        );
        setPublicacionesGuardadas(guardadas);
      } catch (error) {
        console.error("Error al obtener las publicaciones guardadas:", error);
      }
    };

    fetchPublicacionesGuardadas();
  }, [user]);

  // Actualiza el estado de publicacionesGuardadas al guardar o eliminar una publicación
  const handleGuardarPublicacion = async (publicacion_id) => {
    try {
      if (!user || !user.id) {
        console.error(
          "Usuario no autenticado. Debes iniciar sesión para guardar publicaciones."
        );
        return;
      }

      const response = await axios.post(`${BASE_URL}/guardados`, {
        usuario_id: user.id,
        publicacion_id,
        tipo: "guardado",
      });

      // Actualizar el estado de publicacionesGuardadas
      if (response.data.message === "Publicación guardada exitosamente") {
        setPublicacionesGuardadas((prevGuardadas) =>
          new Set(prevGuardadas).add(publicacion_id)
        );
      } else if (
        response.data.message === "Publicación eliminada de guardados"
      ) {
        setPublicacionesGuardadas((prevGuardadas) => {
          const newGuardadas = new Set(prevGuardadas);
          newGuardadas.delete(publicacion_id);
          return newGuardadas;
        });
      }

      console.log(response.data); // Manejar la respuesta del servidor si es necesario
    } catch (error) {
      console.error("Error al guardar la publicación:", error);
    }
  };

  useEffect(() => {
    const fetchPublicacion = async () => {
      try {
        const publicacionesData = await axios.get(
          `${BASE_URL}/buscar-publicaciones?search=${searchTerm}`
        );
        const publicaciones = publicacionesData.data;

        for (const publicacion of publicaciones) {
          const comentariosResponse = await axios.get(
            `${BASE_URL}/comentarios/${publicacion.publicacion_id}`
          );
          const totalComentarios = comentariosResponse.data.totalComentarios;
          publicacion.totalComentarios = totalComentarios;
        }

        setPublicaciones(publicaciones); // Actualizar el estado de las publicaciones
      } catch (error) {
        console.error("Error al obtener publicaciones o comentarios:", error);
      }
    };

    fetchPublicacion();
  }, [searchTerm]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(Array(publicaciones.length).fill(false));
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [publicaciones]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (copyMenuOpen !== null && !menuRef.current.contains(event.target)) {
        setCopyMenuOpen(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [copyMenuOpen]);

  useEffect(() => {
    setMenuOpen(Array(publicaciones.length).fill(false));
  }, [publicaciones]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/buscar-publicaciones?search=${searchTerm}`)
      .then((response) => {
        const publicaciones = response.data;
        setPublicaciones(publicaciones);

        publicaciones.forEach((publicacion) => {
          axios
            .get(
              `${BASE_URL}/votos-totales-por-publicacion/${publicacion.publicacion_id}`
            )
            .then((response) => {
              const totalVotes = response.data.totalVotes || 0;

              setTotalVotesMap((prevMap) => ({
                ...prevMap,
                [publicacion.publicacion_id]: totalVotes,
              }));
            })
            .catch((error) => {
              console.error(
                "Error al obtener votos totales por publicación:",
                error
              );
            });
        });
      })
      .catch((error) => {
        console.error("Error al obtener publicaciones:", error);
        setError(error.message || "Error al obtener publicaciones");
      });
  }, [searchTerm]);

  const handleDelete = async (publicacion_id, index, usuario_id) => {
    try {
      if (!user || !user.id) {
        console.error(
          "Usuario no autenticado. No tienes permiso para borrar esta publicación."
        );
        return;
      }

      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede revertir",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, borrar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await axios.delete(`${BASE_URL}/publicaciones/${publicacion_id}`, {
          data: { usuario_id },
        });

        setPublicaciones(
          publicaciones.filter(
            (publicacion) => publicacion.publicacion_id !== publicacion_id
          )
        );

        setMenuOpen((prevMenuOpen) => {
          const updatedMenuOpen = [...prevMenuOpen];
          updatedMenuOpen[index] = false;
          return updatedMenuOpen;
        });

        Swal.fire("¡Borrado!", "La publicación ha sido eliminada", "success");
      }
    } catch (error) {
      console.error("Error al borrar la publicación:", error);
      Swal.fire(
        "Error",
        "Hubo un error al intentar borrar la publicación",
        "error"
      );
    }
  };

  const renderTiempoPublicacion = (tiempo, precision) => {
    switch (precision) {
      case "day":
        return moment(tiempo).startOf("day").fromNow(true);
      case "hour":
        return moment(tiempo).startOf("hour").fromNow(true);
      case "minute":
        return moment(tiempo).startOf("minute").fromNow(true);
      default:
        return moment(tiempo).fromNow(true);
    }
  };

  const handleVote = async (publicacion_id, tipo) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/votos/${publicacion_id}/${tipo}`,
        null,
        { withCredentials: true }
      );

      setPublicaciones((prevPublicaciones) =>
        prevPublicaciones.map((publicacion) => {
          if (publicacion.publicacion_id === publicacion_id) {
            return {
              ...publicacion,
              total_votos_usuario: {
                upvote: response.data.total_votos_usuario.upvote || 0,
                downvote: response.data.total_votos_usuario.downvote || 0,
              },
            };
          }
          return publicacion;
        })
      );
    } catch (error) {
      console.error("Error al manejar el voto:", error);
    }
  };

  return (
    <div className="min-h-[100dvh]">
      {error ? (
        <p>Error: {error}</p>
      ) : !publicaciones ? (
        <p>Cargando...</p>
      ) : (
        <>
          {publicaciones.length === 0 ? (
            <div className="flex flex-row mb-4 noto-sans relative gap-2 items-center">
              <MdOutlineSearchOff className="h-12 w-12" />
              <p className="font-semibold text-red-500">
                No se encontraron resultados.
              </p>
            </div>
          ) : (
            publicaciones.map((publicacion, index) => (
              <div key={`${publicacion.id}_${index}`}>
                <div className="p-4 rounded-md  bg-gray-100  text-rincon dark:text-gray-100 dark:bg-rincon ">
                  <div className="flex justify-between">
                    {/* Botón de perfil usuario */}
                    <div className="flex items-center">
                      <Link to={`/perfil/${publicacion.usuario_id}`}>
                        <img
                          className="w-10 h-10 rounded-full mr-2"
                          src={`${BASE_URL}/uploads/${publicacion.foto_perfil}`}
                          alt={`Foto de perfil de ${publicacion.nombre_usuario}`}
                        />
                      </Link>
                      <div className="flex flex-col text-left">
                        <Link to={`/perfil/${publicacion.usuario_id}`}>
                          <span className="font-semibold text-">
                            {publicacion.nombre_usuario}
                          </span>
                        </Link>
                        <span className="text-gray-500 text-sm">
                          {renderTiempoPublicacion(
                            publicacion.tiempo_publicacion,
                            publicacion.precisionTiempo
                          )}
                        </span>
                      </div>
                    </div>
                    {/* Botón de opciones */}
                    {publicacion.usuario_id === user?.id && (
                      <div className="p-2 rounded-full focus:outline-none relative">
                        <button
                          aria-haspopup="true"
                          onClick={() =>
                            setMenuOpen((prevMenuOpen) => {
                              const updatedMenuOpen = [...prevMenuOpen];
                              updatedMenuOpen[index] = !updatedMenuOpen[index];
                              return updatedMenuOpen;
                            })
                          }
                        >
                          <FaEllipsisH className="h-5 w-5 text-gray-400" />
                        </button>
                        {menuOpen[index] && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 mt-1 bg-red-800 text-gray-100 font-semibold rounded-md z-10"
                          >
                            <button
                              onClick={() =>
                                handleDelete(
                                  publicacion.publicacion_id,
                                  index,
                                  publicacion.usuario_id
                                )
                              }
                              className="px-3 py-2 text-sm hover:bg-red-700 flex items-center rounded-md"
                            >
                              <CiTrash className="mr-1 h-5 w-5" /> Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold mb-2 mt-2 break-words">
                    {publicacion.titulo}
                  </h3>
                  <p className="text-sm mb-2 break-words">
                    {publicacion.contenido}
                  </p>
                  <div className="flex justify-center h-full w-full rounded-xl border border-gray-100 dark:border-gray-700 border-opacity-75 object-contain overflow-hidden relative">
                    <img
                      className="absolute left-0 w-full dark:opacity-30 opacity-full object-cover filter blur-[24px] "
                      src={`${BASE_URL}/uploads/${publicacion.imagen_contenido}`}
                      alt="Contenido de la publicación"
                    />
                    <img
                      className="h-full w-full object-contain relative max-w-[540px] max-h-[540px]"
                      src={`${BASE_URL}/uploads/${publicacion.imagen_contenido}`}
                      alt="Contenido de la publicación"
                    />
                  </div>
                  <div className="flex justify-content items-center mt-4 gap-2 mx-auto max-w-full overflow-x-auto ">
                    <Post
                      publicacion_id={publicacion.publicacion_id}
                      post={publicacion}
                      totalVotes={totalVotesMap[publicacion.publicacion_id]}
                      handleVote={handleVote}
                    />
                    <div className="flex flex-row items-center">
                      <Link
                        to={{
                          pathname: `/publicacion/${publicacion.publicacion_id}/comments`,
                          state: {
                            publicacion_id: publicacion.publicacion_id,
                            usuario_id: publicacion.usuario_id,
                          },
                        }}
                        className="cursor-pointer"
                      >
                        <button className="flex px-4 items-center gap-1 bg-gray-200 dark:bg-rincon2 dark:hover:bg-rinconHover hover:bg-gray-300 p-2 rounded-full">
                          <GoComment className="h-4 w-4" />
                          <span className="text-xs font-semibold">
                            {publicacion.totalComentarios}
                          </span>
                        </button>
                      </Link>
                    </div>
                    <div className="flex flex-row items-center">
                      {/* Botón de compartir con menú */}
                      <div className="relative inline-block">
                        <button
                          onClick={() =>
                            setCopyMenuOpen(publicacion.publicacion_id)
                          }
                          className="flex px-4 items-center gap-1 bg-gray-200 dark:bg-rincon2 dark:hover:bg-rinconHover hover:bg-gray-300 p-2 rounded-full"
                        >
                          <Share className="h-4 w-4" />
                          <span className="text-xs font-semibold">
                            Compartir
                          </span>
                        </button>
                      </div>
                      {/* Menú de copiar enlace */}
                      {copyMenuOpen === publicacion.publicacion_id && (
                        <div
                          ref={menuRef}
                          className="absolute z-10 mt-24 px-3 py-2 shadow-lg w-auto bg-gray-100 dark:bg-rincon2 border border-gray-200 dark:border-rincon hover:bg-gray-200 dark:hover:bg-rinconHover rounded-lg"
                        >
                          <button
                            onClick={() => {
                              handleCopyLink(publicacion.publicacion_id);
                              setCopyMenuOpen(null); // Cerrar el menú después de copiar el enlace
                              toast.success("Enlace copiado"); // Mostrar la notificación al copiar el enlace
                            }}
                            className="flex flex-row items-center w-full text-left px-2 py-2 text-sm text-rincon dark:text-gray-200 rounded-lg"
                          >
                            <IoIosLink className="mr-1 h-4 w-4" />
                            Copiar enlace
                          </button>
                        </div>
                      )}
                      {/* Componente Toastify para mostrar las notificaciones */}
                      <Toaster richColors position="bottom-center" />

                      {/* Mostrar la notificación de éxito al copiar el enlace */}
                    </div>

                    <button
                      className={`flex items-center px-4 gap-1 bg-gray-200 dark:bg-rincon2  hover:bg-gray-300 p-2 rounded-full ${
                        publicacionesGuardadas.has(publicacion.publicacion_id)
                          ? "bg-yellow-300 dark:bg-yellow-500 hover:bg-yellow-400 dark:hover:bg-yellow-400"
                          : "dark:hover:bg-rinconHover"
                      }`}
                      onClick={() =>
                        handleGuardarPublicacion(
                          publicacion.publicacion_id,
                          publicacion.usuario_id
                        )
                      }
                    >
                      <Bookmark className="h-4 w-4" />
                      <span className="text-xs font-semibold">Guardar</span>
                    </button>
                  </div>
                </div>
                <hr className="dark:bg-rincon border border-gray-300 dark:border-gray-700 border-opacity-75" />
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

Publicaciones.propTypes = {
  searchTerm: PropTypes.string.isRequired,
};

export default Publicaciones;
