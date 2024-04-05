import { Home, Heart, Inbox, HelpCircle, Send } from "feather-icons-react";
import MenuIcon from "./MenuIcon";
import { useState, useEffect } from "react";
import Darkmode from "./DarkMode";
import Categorias from "./Categorias";
import { BiCategory } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useAuth, logout } from "../utils/auth";
import { IoIosLogOut } from "react-icons/io";
import axios from "axios";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCategoriasExpanded, setIsCategoriasExpanded] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);
  const { user } = useAuth();
  const BASE_URL = "http://localhost:3307/uploads/";
  const [notificacionesCount] = useState(0);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:3307/perfil/${user.id}`, {
          withCredentials: true,
        })
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
    }
  }, [user]);

  {
    /*  useEffect(() => {
   const obtenerCantidadNotificaciones = async () => {
      if (user && user.id) {
        try {
          const response = await axios.get(
            `http://localhost:3307/notificaciones/count/${user.id}`
          );
          setNotificacionesCount(response.data.total_notificaciones); // Ajuste aquí
        } catch (error) {
          console.error(
            "Error al obtener la cantidad de notificaciones:",
            error
          );
        }
      }
    };

    if (user) {
      obtenerCantidadNotificaciones();
    }
  }, [user]);
*/
  }
  useEffect(() => {
    const handleResize = () => {
      // Actualizar el estado del menú basado en el ancho de la ventana
      setMenuOpen(window.innerWidth < 1024);
    };

    // Manejar el evento de redimensionamiento de la ventana
    window.addEventListener("resize", handleResize);

    // Llamar a la función de manejo del redimensionamiento al montar el componente
    handleResize();

    // Limpiar el event listener al desmontar el componente
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleToggleCategorias = () => {
    setIsCategoriasExpanded((prev) => !prev);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Manejar clic en un enlace para cerrar el menú
  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav
      className={`bg-gray-100 noto-sans lg:mt-10 p-4 z-10 lg:rounded-lg lg:border-2 border-slate-400/10   text-gray-800 lg:relative fixed  block lg:w-auto lg:h-fit  dark:bg-rincon dark:text-gray-100 ${
        menuOpen ? "h-auto w-screen" : "h-screen w-screen"
      }`}
    >
      {/* Hamburger Menu Icon for Mobile */}
      <div className="lg:hidden">
        <MenuIcon menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>

      {/* Responsive Navigation */}
      <ul
        className={`flex flex-col space-y-2 ${menuOpen ? "hidden" : "block"}`}
      >
        {/* Logo and Branding */}
        <div className="flex items-center mb-5 lg:gap-10 gap-28">
          <a href="/" className="flex items-center">
            <img src="/images/logo2.png" alt="Logo" className="h-8" />
            <span className="font-semibold text-lg flex gap-1 items-center">
              <span className="text-lg">Rincon</span>
              <span className="text-sm bg-rincon p-1 rounded-lg text-gray-100 dark:bg-slate-100 dark:text-rincon">
                Tocopillano
              </span>
            </span>
          </a>
          <Darkmode />
        </div>
        <li>
          {!user && (
            <div className="flex dark:bg-rincon flex-col justify-center w-full mb-5 ">
              <a
                href="/login"
                className="text-sm mb-2 bg-rincon hover:bg-rinconHover text-gray-100 font-bold py-2 px-4 rounded-lg w-full text-center dark:bg-slate-100 dark:text-gray-900 dark:hover:bg-slate-300"
              >
                Iniciar Sesión
              </a>
              <a
                href="/registro"
                className="text-sm bg-rincon hover:bg-rinconHover text-gray-100 font-bold py-2 px-4 rounded-lg w-full text-center dark:bg-slate-100 dark:text-gray-900 dark:hover:bg-slate-300"
              >
                Registrarse
              </a>
            </div>
          )}
          {user && (
            <div className="font-semibold py-2 px-4 rounded-lg flex items-center justify-between mb-6">
              <div className="flex items-center">
                {usuario && usuario.foto_perfil && (
                  <a href={`/perfil/${user.id}`}>
                    <img
                      className="w-8 h-8 object-cover rounded-full mr-2"
                      src={`${BASE_URL}${usuario.foto_perfil}`}
                      alt={`Foto de perfil de ${usuario.nombre_usuario}`}
                    />
                  </a>
                )}
                <a
                  href={`/perfil/${user.id}`}
                  className="text-gray-800 dark:text-gray-100 font-bold"
                >
                  {user.nombre_usuario}
                </a>
              </div>
              <button
                className="text-rincon text-2xl rounded-lg dark:text-gray-100"
                onClick={handleLogout}
              >
                <IoIosLogOut />
              </button>
            </div>
          )}
        </li>
        <li>
          <a
            href="/inicio"
            onClick={handleLinkClick}
            className=" hover:bg-gray-200 dark:hover:bg-rinconHover  py-2 px-4 rounded-lg flex items-center"
          >
            <Home className="mr-2" size={18} />
            Inicio
          </a>
        </li>
        <li>
          <a
            href={user ? `/guardados/${user.id}` : "/guardados"}
            onClick={handleLinkClick}
            className="hover:bg-gray-200 dark:hover:bg-rinconHover py-2 px-4 rounded-lg flex items-center"
          >
            <Heart className="mr-2" size={18} />
            Guardados
          </a>
        </li>

        <li>
          <a
            href={
              user ? `/bandeja-de-entrada/${user.id}` : "/bandeja-de-entrada"
            }
            onClick={handleLinkClick}
            className="hover:bg-gray-200 dark:hover:bg-rinconHover py-2 px-4 rounded-lg flex items-center"
          >
            <Inbox className="mr-2" size={18} />
            Bandeja de entrada
            {notificacionesCount > 0 && (
              <span className="text-red-500 font-bold ml-2">
                +{notificacionesCount}
              </span>
            )}
          </a>
        </li>

        <li>
          <a
            href="/ayuda"
            onClick={handleLinkClick}
            className="hover:bg-gray-200 dark:hover:bg-rinconHover py-2 px-4 rounded-lg flex items-center"
          >
            <HelpCircle className="mr-2" size={18} />
            Ayuda
          </a>
        </li>
        <li>
          <button
            type="button"
            className="flex py-2 px-4 items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-200 dark:text-gray-100 dark:hover:bg-rinconHover"
            onClick={handleToggleCategorias}
          >
            <BiCategory />
            <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
              Categorías
            </span>
            <svg
              className={`w-3 h-3 ${isCategoriasExpanded ? "rotate-180" : ""}`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          <ul
            id="categorias-dropdown"
            className={`py-2 space-y-2 ${
              isCategoriasExpanded ? "block" : "hidden"
            }`}
          >
            <Categorias handleLinkClick={handleLinkClick} />
          </ul>
        </li>
        {/* Botón de Publicar fuera de la lista */}
        <a
          href="/publicar"
          onClick={handleLinkClick}
          className="bg-rincon font-bold hover:bg-rinconHover text-gray-100 py-2 px-4 rounded-lg w-full flex items-center justify-center dark:bg-slate-100 dark:text-gray-900 dark:hover:bg-slate-300"
        >
          <Send className="mr-2" size={18} />
          Publicar
        </a>
      </ul>
    </nav>
  );
};

export default Navbar;
