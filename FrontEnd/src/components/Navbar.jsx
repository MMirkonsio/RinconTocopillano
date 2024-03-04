import { Home, Heart, User, Inbox, HelpCircle, Send } from 'feather-icons-react';
import MenuIcon from './MenuIcon';
import { useState, useEffect } from 'react';
import Darkmode from './DarkMode'
import Categorias from './Categorias';
import { BiCategory } from "react-icons/bi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCategoriasExpanded, setIsCategoriasExpanded] = useState(false);

  const handleToggleCategorias = () => {
    setIsCategoriasExpanded((prev) => !prev);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  

  useEffect(() => {
    // Al cargar el componente, verificamos el tamaño de la pantalla
    const handleResize = () => {
      setMenuOpen(window.innerWidth < 1024); // Cambia 1024 por el ancho que prefieras para la transición entre móvil y escritorio
    };

    // Agregamos un listener para el evento resize
    window.addEventListener('resize', handleResize);

    // Llamamos a handleResize al cargar el componente
    handleResize();

    // Limpiamos el listener al desmontar el componente
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // El segundo argumento vacío asegura que useEffect solo se ejecute al montar y desmontar

  return (
    <nav className={`bg-gray-100 p-4 z-10 text-gray-700 fixed left-0 top-0 flex flex-col lg:w-80 justify-between lg:shadow dark:bg-gray-900 dark:text-gray-100 ${menuOpen ? 'h-auto w-screen' : 'h-screen w-screen'}`}>
      <div className="epilogue">
        {/* Hamburger Menu Icon for Mobile */}
        <div className="lg:hidden">
          <MenuIcon menuOpen={menuOpen} toggleMenu={toggleMenu} />
        </div>
          
        {/* Responsive Navigation */}
        <ul className={`flex flex-col space-y-2 ${menuOpen ? 'hidden' : 'block'}`}>
          {/* Logo and Branding */}
          <div className="flex items-center mb-5">
          <a href="/" className="flex items-center">
            <img src="/images/logo2.png" alt="Logo" className="h-8 mr-4" />
            <span className="font-semibold text-lg flex gap-1 items-center">
              <span className="text-lg">Rincon</span>
              <span className="text-sm bg-slate-900 p-1 rounded-lg text-gray-100 dark:bg-slate-100 dark:text-gray-900">Tocopillano</span>
            </span>
          </a>
        </div>
          <li>
            <a href="/inicio" className=" hover:bg-gray-200 dark:hover:bg-gray-800 py-2 px-4 rounded-lg flex items-center">
              <Home className="mr-2" size={18} />
              Inicio
            </a>
          </li>
          <li>
            <a href="/guardados" className="hover:bg-gray-200 dark:hover:bg-gray-800 py-2 px-4 rounded-lg flex items-center">
              <Heart className="mr-2" size={18} />
              Guardados
            </a>
          </li>
          <li>
            <a href="/perfil" className="hover:bg-gray-200 dark:hover:bg-gray-800 py-2 px-4 rounded-lg flex items-center">
              <User className="mr-2" size={18} />
              Perfil
            </a>
          </li>
          <li>
            <a href="/bandeja-de-entrada" className="hover:bg-gray-200 dark:hover:bg-gray-800 py-2 px-4 rounded-lg flex items-center">
              <Inbox className="mr-2" size={18} />
              Bandeja de entrada
            </a>
          </li>
          <li>
            <a href="/ayuda" className="hover:bg-gray-200 dark:hover:bg-gray-800 py-2 px-4 rounded-lg flex items-center">
              <HelpCircle className="mr-2" size={18} />
              Ayuda
            </a>
          </li>
          <li>
            <button
              type="button"
              className="flex py-2 px-4 items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-200 dark:text-gray-100 dark:hover:bg-gray-800"
              onClick={handleToggleCategorias}
            >
              <BiCategory />
              <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Categorías</span>
              <svg
                className={`w-3 h-3 ${isCategoriasExpanded ? 'rotate-180' : ''}`}
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
            <ul id="categorias-dropdown" className={`py-2 space-y-2 ${isCategoriasExpanded ? 'block' : 'hidden'}`}>
              <Categorias />
            </ul>
          </li>

          {/* Botón de Publicar fuera de la lista */}
          <div className='epilogue'>
          <a href="/publicar" className="bg-slate-900 hover:bg-slate-800 text-gray-100 py-2 px-4 rounded-lg w-full flex items-center justify-center dark:bg-slate-100 dark:text-gray-900 dark:hover:bg-slate-300">
            <Send className="mr-2" size={18} />Publicar
          </a>
          </div>
                
        </ul>
        <div className="absolute bottom-4 right-4">
          <Darkmode />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
