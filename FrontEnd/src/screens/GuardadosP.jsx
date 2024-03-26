import Guardados from "../components/Guardados";
import Navbar from "../components/Navbar";

const Guardado = () => {
  return (
    <div className="flex min-h-[100dvh] justify-center lg:gap-16 mx-auto w-3/4">
      <Navbar />
      <div className="flex-1 lg:mt-10 mt-28">
        <Guardados
          titulo="Título de la publicación guardada"
          imagen="/ruta/imagen.jpg"
          eliminarPublicacion={() => {}}
        />
      </div>
    </div>
  );
};

export default Guardado;
