import PublicacionesXCategoria from "../components/PublicacionesXCategoria";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const CategoriasScreen = () => {
  const { categoria_id } = useParams();

  return (
    <div className="flex min-h-[100dvh] justify-center lg:gap-16 mx-auto w-3/4">
      <Navbar />
      <div className="flex-1 lg:mt-10 mt-28">
        <PublicacionesXCategoria categoria_id={categoria_id} />
      </div>
    </div>
  );
};

export default CategoriasScreen;
