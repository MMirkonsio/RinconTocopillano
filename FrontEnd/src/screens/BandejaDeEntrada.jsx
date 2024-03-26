import BandejaEntrada from "../components/BandejaEntrada";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useState } from "react";

const Bandeja = () => {
  const { usuario_id } = useParams();
  const usuarioIdNumber = parseInt(usuario_id); // Convertir a número

  // Definir la función para actualizar notificaciones en el Navbar
  const [notificacionesCount, setNotificacionesCount] = useState(0);
  const actualizarNotificaciones = (cantidad) => {
    setNotificacionesCount(cantidad);
  };

  return (
    <div className="flex min-h-[100dvh] justify-center lg:gap-16 mx-auto w-3/4">
      <Navbar notificacionesCount={notificacionesCount} />
      <div className="flex-1 lg:mt-10 mt-28">
        <BandejaEntrada
          usuario_id={usuarioIdNumber}
          actualizarNotificaciones={actualizarNotificaciones}
        />
      </div>
    </div>
  );
};

export default Bandeja;
