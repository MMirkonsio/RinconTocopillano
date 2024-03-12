import { useState, useEffect } from 'react';
import axios from 'axios';

const EditarPerfil = () => {
  const [perfil, setPerfil] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    // Agrega más campos según tu modelo de datos
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    // Realizar la solicitud al servidor para obtener los datos del perfil
    axios.get('http://localhost:3307/perfil')
      .then(response => {
        setPerfil(response.data[0] || {});
      })
      .catch(error => {
        console.error('Error al obtener perfil:', error);
        setError(error.message || 'Error al obtener perfil');
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfil({
      ...perfil,
      [name]: value,
    });
  };

  const guardarPerfil = async () => {
    try {
      const response = await axios.post('http://localhost:3307/api/guardar-perfil', perfil);
      console.log(response.data); // Manejar la respuesta del servidor
    } catch (error) {
      console.error('Error al enviar la solicitud POST:', error);
      setError(error.message || 'Error al guardar el perfil');
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    guardarPerfil();
  };

  if (error) {
    // Mostrar un mensaje de error si algo salió mal al obtener el perfil o al guardar
    return <p>Error: {error}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md dark:bg-gray-900">
      <div className="mb-4">
        <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700">Nombre:</label>
        <input type="text" id="nombre" name="nombre" value={perfil.nombre_usuario || ''} onChange={handleChange} className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" />
      </div>
      <div className="mb-4">
        <label htmlFor="correo" className="block text-sm font-semibold text-gray-700">Correo electrónico:</label>
        <input type="text" id="correo" name="correo" value={perfil.correo || ''} onChange={handleChange} className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" />
      </div>
      <div className="mb-4">
        <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700">Teléfono:</label>
        <input type="text" id="telefono" name="telefono" value={perfil.telefono || ''} onChange={handleChange} className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" />
      </div>
      {/* Agrega más campos según tu modelo de datos */}
      <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600">Guardar cambios</button>
    </form>
  );
};

export default EditarPerfil;
