/*import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const PublicacionCollage = ({ usuarioId }) => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://65e774cb53d564627a8ed6aa.mockapi.io/rincon/publicaciones`);
        const data = await response.json();
        setPublicaciones(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [usuarioId]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex flex-col justify-center mx-auto items-center p-6">
        <div>
        </div>
    </div>
  );
};

PublicacionCollage.propTypes = {
  usuarioId: PropTypes.string,
};

export default PublicacionCollage;
*/