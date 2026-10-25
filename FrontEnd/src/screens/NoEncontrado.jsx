import { Link } from "react-router-dom";
import { LuMapPin } from "react-icons/lu";
import AppLayout from "../components/layout/AppLayout";
import EstadoVacio from "../components/ui/EstadoVacio";
import { rutas } from "../lib/rutas";
import { useTitulo } from "../lib/useTitulo";

const NoEncontrado = () => {
  useTitulo("Página no encontrada");
  return (
  <AppLayout>
    <EstadoVacio Icono={LuMapPin} titulo="Esta página no existe" texto="Puede que el enlace esté mal escrito o que el contenido se haya eliminado.">
      <Link to={rutas.inicio} className="btn-primario">
        Volver al inicio
      </Link>
    </EstadoVacio>
  </AppLayout>
  );
};

export default NoEncontrado;
