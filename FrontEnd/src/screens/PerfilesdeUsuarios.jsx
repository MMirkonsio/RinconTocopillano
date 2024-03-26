import TodasPublicacionesUsu from "../components/TodasPubliUsuarios";
import TodosUsuarios from "../components/TodosPerfilUsuarios";
import Navbar from "../components/Navbar";

const PerfilUsuario = () => {
  return (
    <div className="flex min-h-[100dvh] justify-center lg:gap-16 mx-auto w-3/4">
      <Navbar />
      <div className="flex-1 lg:mt-10 mt-28">
        <TodosUsuarios />
        <TodasPublicacionesUsu />
      </div>
    </div>
  );
};

export default PerfilUsuario;
