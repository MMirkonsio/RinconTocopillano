import { Home, Heart, User, Inbox, HelpCircle, Send } from 'feather-icons-react';
import MenuIcon from './MenuIcon';
import { useState, useEffect } from 'react';
import Darkmode from './DarkMode'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);


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
    <nav className={`bg-gray-100 p-4 z-10 text-gray-700 fixed left-0 top-0 flex flex-col lg:w-72 justify-between lg:shadow dark:bg-gray-900 dark:text-gray-100 ${menuOpen ? 'h-auto w-screen' : 'h-screen w-screen'}`}>
      <div className="epilogue">
        {/* Hamburger Menu Icon for Mobile */}
        <div className="lg:hidden mb-5">
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
              <span className="text-sm bg-slate-900 p-1 rounded-md text-gray-100 dark:bg-slate-100 dark:text-gray-900">Tocopillano</span>
            </span>
          </a>
        </div>
          <li>
            <a href="/inicio" className=" dark:hover:bg-gray-800 py-2 px-4 rounded-full flex items-center">
              <Home className="mr-2" size={18} />
              Inicio
            </a>
          </li>
          <li>
            <a href="/guardados" className="dark:hover:bg-gray-800 py-2 px-4 rounded-full flex items-center">
              <Heart className="mr-2" size={18} />
              Guardados
            </a>
          </li>
          <li>
            <a href="/perfil" className="dark:hover:bg-gray-800 py-2 px-4 rounded-full flex items-center">
              <User className="mr-2" size={18} />
              Perfil
            </a>
          </li>
          <li>
            <a href="/bandeja-de-entrada" className="dark:hover:bg-gray-800 py-2 px-4 rounded-full flex items-center">
              <Inbox className="mr-2" size={18} />
              Bandeja de entrada
            </a>
          </li>
          <li>
            <a href="/ayuda" className="dark:hover:bg-gray-800 py-2 px-4 rounded-full flex items-center">
              <HelpCircle className="mr-2" size={18} />
              Ayuda
            </a>
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
