import Perfil from "../components/Perfil";
{/*import Publicacion from "../components/PublicacionesSubidas";*/}

const PerfilUsuario = () => {
  return (
    <div className="flex flex-col items-center h-screen lg:ml-80 mx-auto lg:mr-auto dark:bg-rincon dark:text-gray-100 epilogue text-gray-800 ">
      <div className="p-4 rounded-lg mt-14 ">
        <Perfil />
        {/*<Publicacion />*/}
      </div>
        
    </div>
  );
};

export default PerfilUsuario;
  