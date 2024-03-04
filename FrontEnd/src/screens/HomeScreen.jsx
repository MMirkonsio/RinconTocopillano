import Publicaciones from "../components/Publicaciones";
import Search from "../components/Search";
import MasPopular from "../components/MasPopular";

const HomeScreen = () => {
  return (
    <div className="flex lg:ml-96 md:gap-16 lg:w-3/4 mt-24 mx-auto transition-gap duration-500 ease-in-out"> {/* Agrega flex y mx-auto al contenedor principal */}
      <div className="flex-1 w-full"> {/* Esto hará que Publicaciones ocupe el espacio disponible y esté centrado */}
      <Search className="mb-4" />
        <Publicaciones className="mb-4" />
      </div>
      <div className="hidden  md:block"> {/* Ajusta la cantidad de margen izquierdo según tus necesidades */}
        {/* Contenedor del componente MasPopular */}
        <MasPopular />
      </div>
    </div>
  );
};

export default HomeScreen;
