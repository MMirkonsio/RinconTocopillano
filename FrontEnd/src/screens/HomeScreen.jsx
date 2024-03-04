import Publicaciones from "../components/Publicaciones";
import Search from "../components/Search";
import MasPopular from "../components/MasPopular";

const HomeScreen = () => {
  return (
    <div className="epilogue flex lg:gap-36 md:gap-16 p-4 lg:w-5/6 mx-auto transition-gap duration-500 ease-in-out"> {/* Agrega flex y mx-auto al contenedor principal */}
      <div className="flex-1 px-2 "> {/* Esto hará que Publicaciones ocupe el espacio disponible y esté centrado */}
        <Search />
        <Publicaciones />
      </div>
      <div className="ml-auto mr-14 hidden md:block"> {/* Ajusta la cantidad de margen izquierdo según tus necesidades */}
        {/* Contenedor del componente MasPopular */}
        <MasPopular />
      </div>
    </div>
  );
};

export default HomeScreen;
