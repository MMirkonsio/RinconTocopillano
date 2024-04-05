import { Link } from "react-router-dom";
import { Home } from "feather-icons-react"; // Asegúrate de importar correctamente el icono Home
import DarkMode from "./DarkMode";

const Navbar2 = () => {
  return (
    <nav className="flex justify-center items-center h-16 w-full bg-gray-100 dark:bg-rincon border-b border-gray-300  dark:border-gray-700 text-rincon dark:text-gray-100 absolute top-0 z-10 ">
      <div className="w-full  flex justify-center items-center">
        <Link
          to="/"
          className="flex items-center text-xl font-bold hover:text-gray-700 dark:hover:text-gray-300"
        >
          <Home size={20} className="mr-1" />
        </Link>
        <DarkMode />
      </div>
    </nav>
  );
};

export default Navbar2;
