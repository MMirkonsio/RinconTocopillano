import { Home, Heart, Inbox, HelpCircle, Send } from "feather-icons-react";
import MenuIcon from "./MenuIcon";
import { useState, useEffect } from "react";
import Darkmode from "./DarkMode";
import Categorias from "./Categorias";
import { BiCategory } from "react-icons/bi";
import { IoIosLogOut } from "react-icons/io";
import { UserAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCategoriasExpanded, setIsCategoriasExpanded] = useState(false);
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);
  const { user, handleSignOut } = UserAuth();
  const [notificacionesCount] = useState(0);



  useEffect(() => {
    const handleResize = () => {
      setMenuOpen(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);

    handleResize();

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

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav
      className={`bg-gray-100 lg:mt-10 p-4 z-10 lg:rounded-lg lg:border-2 border-slate-400/10 text-gray-800 lg:relative fixed block lg:w-auto lg:h-fit dark:bg-rincon dark:text-gray-100 ${
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
            <div className="font-semibold py-2 px-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                {/* Foto de perfil y nombre de usuario registrado con Google */}
                {user && (
                  <div className="font-semibold rounded-lg flex items-center">
                  <Link
                    to={`/perfil/${user.id}`}
                    className="flex items-center space-x-2"
                  >
                    <img
                      className="w-8 h-8 object-cover rounded-full"
                      src={user.user_metadata.avatar_url}
                      alt={
                        user.app_metadata.provider === 'facebook'
                          ? user.user_metadata.nickname
                          : user.user_metadata.full_name}
                    />
                    <span className="font-semibold text-gray-800 dark:text-gray-100">
                      {user.app_metadata.provider === 'facebook'
                        ? user.user_metadata.nickname
                        : user.user_metadata.full_name}
                    </span>
                  </Link>
                </div>
                
                )}
              </div>

              <button
                className="text-rincon text-2xl rounded-lg ml-4 dark:text-gray-100"
                onClick={handleSignOut}
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
            className=" hover:bg-gray-200 font-semibold dark:hover:bg-rinconHover py-2 px-4 rounded-lg flex items-center"
          >
            <Home className="mr-2" size={18} />
            Inicio
          </a>
        </li>
        <li>
          <a
            href={user ? `/guardados/${user.id}` : "/guardados"}
            onClick={handleLinkClick}
            className="hover:bg-gray-200 font-semibold dark:hover:bg-rinconHover py-2 px-4 rounded-lg flex items-center"
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
            className="hover:bg-gray-200 font-semibold dark:hover:bg-rinconHover py-2 px-4 rounded-lg flex items-center"
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
            className="hover:bg-gray-200 font-semibold dark:hover:bg-rinconHover py-2 px-4 rounded-lg flex items-center"
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
            <span className="flex-1 ms-3 font-semibold text-left rtl:text-right whitespace-nowrap">
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
            className={`py-2 space-y-2 font-semibold ${
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
