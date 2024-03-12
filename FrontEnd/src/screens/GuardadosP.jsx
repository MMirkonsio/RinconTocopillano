import Guardados from "../components/Guardados";

const Guardado = () => {
    return (
      <div>
        {/* Asegúrate de pasar la prop titulo */}
        <Guardados
          titulo="Título de la publicación guardada"
          imagen="/ruta/imagen.jpg"
          eliminarPublicacion={() => {}}
        />
      </div>
    );
  };
  
  export default Guardado;
  