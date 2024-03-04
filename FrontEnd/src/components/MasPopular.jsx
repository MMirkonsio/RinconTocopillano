import { useState } from 'react';

const MasPopular = () => {
  // Datos ficticios de comunidades populares
  const [comunidades] = useState([
    { id: 1, nombre: 'TocoTurbo' },
    { id: 2, nombre: 'DragonRoll' },
    { id: 3, nombre: 'Stori Voris' },
    { id: 4, nombre: 'Ligo Leyen' },
    { id: 5, nombre: 'Churros con Manjar' },
    { id: 6, nombre: 'Marble Falls' },
    { id: 7, nombre: 'New Community 1' },
    { id: 8, nombre: 'New Community 2' },
    { id: 9, nombre: 'New Community 3' },
    { id: 10, nombre: 'New Community 1111111' },
    { id: 11, nombre: 'New Community 222222222' },
    { id: 12, nombre: 'New Community 333333333' },
    // Añade más comunidades según sea necesario
  ]);

  // Filtrar las 10 comunidades con más likes
  const topComunidades = comunidades.slice(0, 10);

  // Función para cambiar el estado de mostrarTodo

  return (
    <div className="bg-gray-100 max-w-max p-4 rounded-lg shadow-md dark:border dark:border-gray-300 dark:bg-gray-900">
      <h2 className="text-xl font-semibold mb-4">Comunidades Populares</h2>
      <div>
        <ul className="divide-y divide-gray-200">
          {topComunidades.map((comunidad) => (
            <li key={comunidad.id} className="py-2">
              <a href="#" className="hover:underline">
                {comunidad.nombre}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MasPopular;