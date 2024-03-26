import { Link } from "react-router-dom";
import { Home } from "feather-icons-react"; // Asegúrate de importar correctamente el icono Home

const Navbar2 = () => {
  return (
    <nav className="flex justify-center items-center h-16 w-full text-gray-100 dark:text-gray-100 epilogue absolute z-10">
      <div className="w-full max-w-screen-xl flex justify-center items-center">
        <Link
          to="/"
          className="flex items-center text-xl font-bold hover:text-gray-700 dark:hover:text-gray-300 epilogue"
        >
          <Home size={34} className="mr-1" />
          INICIO
        </Link>
      </div>
    </nav>
  );
};

export default Navbar2;
