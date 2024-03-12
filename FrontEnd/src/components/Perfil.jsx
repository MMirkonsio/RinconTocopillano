import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "../utils/auth";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState(null);
  const BASE_URL = 'http://localhost:3307/uploads/';
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.id) {
      return;
    }

    // Realizar la solicitud al servidor para obtener el perfil del usuario autenticado
    axios.get('http://localhost:3307/perfil', { withCredentials: true })
      .then(response => {
        setUsuario(response.data); // No es necesario el [0] si recibes un solo usuario
      })
      .catch(error => {
        console.error('Error al obtener el perfil:', error);
        setError(error.message || 'Error al obtener el perfil');
      });
  }, [user]);

  if (error) {
    // Mostrar un mensaje de error si algo salió mal
    return <p>Error: {error}</p>;
  }

  if (!usuario) {
    // Puedes mostrar un loader o un mensaje de carga mientras se obtienen los datos
    return <p>Cargando...</p>;
  }

  return (
    <div className="flex flex-col p-6 rounded-lg">
      <div className="flex items-center mb-4 text-gray-100">
        <img
          className="w-40 h-40 rounded-full mr-2"
          src={`${BASE_URL}${usuario.foto_perfil}`}
          alt={`Foto de perfil de ${usuario.nombre_usuario}`}
        />
        
      </div>
      <div className="mb-2">
          <h2 className="text-xl font-semibold">{usuario.nombre_usuario}</h2>
      </div>
      <div className="mb-2">
        <span className="font-semibold">Correo:</span> {usuario.correo}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Dirección:</span> {usuario.direccion || ''}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Teléfono:</span> {usuario.telefono || ''}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Horario:</span> {usuario.horario || ''}
      </div>
      <Link to="/editar-perfil" className="flex mt-4 bg-rinconClaro text-white px-4 w-auto py-2 rounded-md hover:bg-rinconHover">Editar perfil</Link>
    </div>
  );
};

export default Perfil;
