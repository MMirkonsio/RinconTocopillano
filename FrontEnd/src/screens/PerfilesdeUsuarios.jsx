import TodasPublicacionesUsu from "../components/TodasPubliUsuarios";
import TodosUsuarios from "../components/TodosPerfilUsuarios";
import Navbar from "../components/Navbar";

const PerfilUsuario = () => {
  return (
    <div className="container mx-auto max-w-[1200px] flex justify-center gap-4 font-semibold noto-sans">
      <Navbar />
      <div className="flex-1 lg:mt-10 mt-28">
        <TodosUsuarios />
        <TodasPublicacionesUsu />
      </div>
    </div>
  );
};

export default PerfilUsuario;
