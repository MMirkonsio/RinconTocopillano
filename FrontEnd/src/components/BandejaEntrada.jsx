import { useState } from 'react';
import { FiBell } from 'react-icons/fi'; // Importa el icono de la campana

const BandejaDeEntrada = () => {
  const [notificaciones, setNotificaciones] = useState([
    { id: 1, titulo: 'Nueva notificación', descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 2, titulo: 'Otra notificación', descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    // Agrega más notificaciones según sea necesario
  ]);

  const marcarComoLeida = (id) => {
    // Lógica para marcar la notificación como leída
    // Puedes implementar esta función según tus requerimientos específicos
    console.log(`Notificación marcada como leída: ${id}`);
  };

  const eliminarNotificacion = (id) => {
    // Lógica para eliminar la notificación
    setNotificaciones(notificaciones.filter(notif => notif.id !== id));
  };

  return (
    <div className="flex flex-col h-screen items-center relative mt-8 bg-gray-100 lg:ml-auto lg:mr-20 w-full p-6 rounded-lg epilogue text-gray-800  dark:bg-rincon dark:text-gray-100">
      <h2 className="text-xl font-semibold mb-4">Bandeja de entrada</h2>
      {notificaciones.length === 0 ? (
        <p className="text-gray-600">No tienes notificaciones.</p>
      ) : (
        notificaciones.map(notificacion => (
          <div key={notificacion.id} className="bg-white rounded-lg shadow-md mb-4 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{notificacion.titulo}</h3>
              <button onClick={() => eliminarNotificacion(notificacion.id)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                Eliminar
              </button>
            </div>
            <p className="text-sm text-gray-600">{notificacion.descripcion}</p>
            <button onClick={() => marcarComoLeida(notificacion.id)} className="text-gray-500 hover:text-gray-700 text-xs mt-2 focus:outline-none">
              Marcar como leída
            </button>
          </div>
        ))
      )}
      <div className="flex justify-center">
        <FiBell className="text-gray-500 w-8 h-8" />
      </div>
    </div>
  );
};

export default BandejaDeEntrada;