import { IoFastFood } from 'react-icons/io5';
import { GiClothes, GiLaptop } from 'react-icons/gi';
import { MdToys, MdPets } from 'react-icons/md';
import { CgGym } from 'react-icons/cg';

const Categorias = () => {



  const categorias = [
    { id: 1, nombre: 'Comida', icono: <IoFastFood /> },
    { id: 2, nombre: 'Ropa', icono: <GiClothes /> },
    { id: 3, nombre: 'Electrónicos', icono: <GiLaptop /> },
    { id: 4, nombre: 'Juguetes y juegos', icono: <MdToys /> },
    { id: 5, nombre: 'Productos para mascotas', icono: <MdPets /> },
    { id: 6, nombre: 'Artículos deportivos', icono: <CgGym /> },
  ];




  return (
    <div className="mb-4 epilogue">
        <ul className={`flex flex-col gap-3`}>
          {categorias.map((categoria) => (
            <li key={categoria.id}>
              <a
                href={`/categoria/${categoria.id}`}
                className="text-sm hover:bg-gray-200 text-gray-800 py-2 px-8 rounded-lg flex items-center dark:bg-gray-10 dark:text-gray-100 dark:hover:bg-gray-800"
              >
                <div className="flex gap-1 items-center">
                  {categoria.icono}
                  {categoria.nombre}
                </div>
              </a>
            </li>
          ))}
        </ul>
    </div>
  );
};

export default Categorias;
