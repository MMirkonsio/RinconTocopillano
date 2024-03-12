import EditarPerfil from "../components/EditarPerfil";

const Editar = () => {
    return (
      <div className="flex lg:ml-96 md:gap-16 lg:w-3/4 mx-4 transition-gap duration-500 ease-in-out"> 
        <div className="flex-1 lg:mt-10 mt-28 w-full"> 
        <EditarPerfil className="mb-4"/>
        </div>
      </div>

    );
  };
  
  export default Editar;
  