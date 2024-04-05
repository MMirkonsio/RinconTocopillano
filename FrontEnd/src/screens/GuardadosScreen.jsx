import PublicacionGuardada from "../components/Guardados";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";

const Guardados = () => {
  const { usuario_id } = useParams();
  return (
    <div className="container mx-auto max-w-[1200px] flex justify-center gap-4 font-semibold noto-sans">
      <Navbar />
      <div className="flex-1 lg:mt-10 mt-20">
        <PublicacionGuardada usuario_id={usuario_id} />
      </div>
    </div>
  );
};

export default Guardados;
