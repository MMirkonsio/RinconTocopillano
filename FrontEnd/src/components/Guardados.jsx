import { useState } from 'react';
import PropTypes from 'prop-types';
import { FiTrash } from 'react-icons/fi'; // Importa el icono de eliminar

const PublicacionGuardada = ({ titulo, imagen, eliminarPublicacion }) => {
  const [contador, setContador] = useState(0);

  const incrementarContador = () => {
    setContador(contador + 1);
  };

  return (
    <div className="mb-4 epilogue">
      <div className="flex flex-col h-screen items-center relative mt-8 bg-gray-100 lg:ml-auto lg:mr-20 w-full p-6 rounded-lg epilogue text-gray-800  dark:bg-rincon dark:text-gray-100">
        <div className="flex items-center mb-2">
          <img
            className="w-10 h-10 rounded-full mr-2"
            src={imagen}
            alt="Imagen de la publicación guardada"
          />
          {titulo && <h3 className="text-lg font-semibold">{titulo}</h3>}
        </div>
        {/* Agrega aquí el resto de los elementos de la publicación guardada */}
        <button onClick={incrementarContador} className="text-gray-500 hover:text-gray-700 focus:outline-none">
          Incrementar contador: {contador}
        </button>
        <button onClick={eliminarPublicacion} className="text-gray-500 hover:text-gray-700 focus:outline-none">
          <FiTrash className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

PublicacionGuardada.propTypes = {
  titulo: PropTypes.string, // No es requerido
  imagen: PropTypes.string,
  eliminarPublicacion: PropTypes.func,
};

export default PublicacionGuardada;
