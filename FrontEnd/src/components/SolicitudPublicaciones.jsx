import { useState, useEffect } from 'react';
import axios from 'axios';
import Publicaciones from './Publicaciones';

function SolicitudPublicaciones() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Realizar la solicitud al servidor usando Axios
    axios.get('http://localhost:3307/publicaciones')
      .then(response => {
        setPublicaciones(response.data);
      })
      .catch(error => {
        console.error('Error al obtener publicaciones:', error);
        setError(error.message || 'Error al obtener publicaciones');
      });
  }, []);

  if (error) {
    // Mostrar un mensaje de error si algo salió mal
    return <p>Error: {error}</p>;
  }

  return (
    <Publicaciones publicaciones={publicaciones} />
  );
}

export default SolicitudPublicaciones;
