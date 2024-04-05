import EditarPerfil from "../components/EditarPerfil";

const Editar = () => {
  return (
    <div className="container mx-auto max-w-[1200px] flex justify-center gap-4 font-semibold noto-sans">
      <div className="flex-1 lg:mt-10 mt-28 w-full">
        <EditarPerfil className="mb-4" />
      </div>
    </div>
  );
};

export default Editar;
