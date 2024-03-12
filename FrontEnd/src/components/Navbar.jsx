import { Home, Heart, User, Inbox, HelpCircle, Send } from "feather-icons-react";
import MenuIcon from "./MenuIcon";
import { useState, useEffect } from "react";
import Darkmode from "./DarkMode";
import Categorias from "./Categorias";
import { BiCategory } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, logout} from "../utils/auth";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCategoriasExpanded, setIsCategoriasExpanded] = useState(false);
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (!user) {
      updateUser();
    } // Actualiza el estado del usuario al montar el componente
const handleResize = () => {
      setMenuOpen(window.innerWidth < 1024);
    };
  
    window.addEventListener("resize", handleResize);
    handleResize();
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };

  }, [user, updateUser]);



  const handleToggleCategorias = () => {
    setIsCategoriasExpanded((prev) => !prev);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
}



  return (
    <nav
      className={`bg-gray-100 p-4 z-10 lg:border-r dark:border-gray-100 border-rincon2 border-opacity-25 text-gray-800 fixed left-0 top-0 flex flex-col lg:w-80 justify-between shadow dark:bg-rincon dark:text-gray-100 ${
        menuOpen
          ? "h-auto w-screen transition-all duration-300 ease-in-out"
          : "h-screen w-screen"
      }`}
    >
      <div className="epilogue">
        {/* Hamburger Menu Icon for Mobile */}
        <div className="lg:hidden">
          <MenuIcon menuOpen={menuOpen} toggleMenu={toggleMenu} />
        </div>

        {/* Responsive Navigation */}
        <ul className={`flex flex-col space-y-2 ${menuOpen ? 'hidden' : 'block'}`}>

          {/* Logo and Branding */}
          <div className="flex items-center mt-5 mb-5 lg:gap-10 gap-28">
            <Link to="/" className="flex items-center">
              <img
                src="/images/logo2.png"
                alt="Logo"
                className="h-8"
              />
              <span className="font-semibold text-lg flex gap-1 items-center">
                <span className="text-lg">Rincon</span>
                <span className="text-sm bg-rincon p-1 rounded-lg text-gray-100 dark:bg-slate-100 dark:text-rincon">
                  Tocopillano
                </span>
              </span>
            </Link>
            <Darkmode />
          </div>

          <li>
            <Link
              to="/inicio"
              className=" hover:bg-gray-200 dark:hover:bg-rinconHover font-semibold py-2 px-4 rounded-lg flex items-center"
            >
              <Home className="mr-2" size={18} />
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/guardados"
              className="hover:bg-gray-200 dark:hover:bg-rinconHover py-2 px-4 rounded-lg flex items-center"
            >
              <Heart className="mr-2" size={18} />
              Guardados
            </Link>
          </li>
          <li>
            <Link
              to="/perfil"
              className="hover:bg-gray-200 dark:hover:bg-rinconHover py-2 px-4 rounded-lg flex items-center"
            >
              <User className="mr-2" size={18} />
              Perfil
            </Link>
          </li>
          <li>
            <Link
              to="/bandeja-de-entrada"
              className="hover:bg-gray-200 dark:hover:bg-rinconHover py-2 px-4 rounded-lg flex items-center"
            >
              <Inbox className="mr-2" size={18} />
              Bandeja de entrada
            </Link>
          </li>
          <li>
            <Link
              to="/ayuda"
              className="hover:bg-gray-200 dark:hover:bg-rinconHover py-2 px-4 rounded-lg flex items-center"
            >
              <HelpCircle className="mr-2" size={18} />
              Ayuda
            </Link>
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
                className={`w-3 h-3 ${
                  isCategoriasExpanded ? "rotate-180" : ""
                }`}
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
              <Categorias />
            </ul>
          </li>

          {/* Botón de Publicar fuera de la lista */}
          <Link
            to="/publicar"
            className="bg-rincon hover:bg-rinconHover text-gray-100 py-2 px-4 rounded-lg w-full flex items-center justify-center dark:bg-slate-100 dark:text-gray-900 dark:hover:bg-slate-300"
          >
            <Send className="mr-2" size={18} />
            Publicar
          </Link>

          {!user && (
            <div className="flex bg-gray-100 dark:bg-rincon flex-col items-center justify-center absolute bottom-4 left-0 w-full mb-5 p-4">
              <Link
                to="/login"
                className="text-sm bg-gray-400 hover:bg-gray-500 text-gray-100 font-bold py-2 px-4 rounded-lg mb-2 w-full text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-gray-100"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/registro"
                className="text-sm bg-rincon hover:bg-rinconHover text-gray-100 font-bold py-2 px-4 rounded-lg w-full text-center dark:bg-slate-100 dark:text-gray-900 dark:hover:bg-slate-300"
              >
                Registrarse
              </Link>
            </div>
          )}

          {user && (
            <div className="flex bg-gray-100 dark:bg-rincon flex-col items-center justify-center absolute bottom-4 left-0 w-full mb-5 p-4">
              <p className="text-gray-800 dark:text-gray-100 font-semibold mb-2">
                ¡Hola, {user.nombre_usuario}!
              </p>
              <button
                className="text-sm bg-rincon hover:bg-rinconHover text-gray-100 font-bold py-2 px-4 rounded-lg w-full text-center dark:bg-slate-100 dark:text-gray-900 dark:hover:bg-slate-300"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
