import PublicacionesXCategoria from "../components/PublicacionesXCategoria";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const CategoriasScreen = () => {
  const { categoria_id } = useParams();

  return (
    <div className="container mx-auto max-w-[1200px] flex justify-center gap-4  noto-sans">
      <Navbar />
      <div className="flex-1 lg:mt-10 mt-28">
        <PublicacionesXCategoria categoria_id={categoria_id} />
      </div>
    </div>
  );
};

export default CategoriasScreen;
