import React, { useState, useEffect } from 'react';
import { IoFastFood } from "react-icons/io5";
import { GiClothes, GiLaptop } from "react-icons/gi";
import { MdToys, MdPets } from "react-icons/md";
import { CgGym } from "react-icons/cg";

const Categorias = () => {
  const [categoriaActual, setCategoriaActual] = useState('Categoría');
  const [publicaciones, setPublicaciones] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const handleCategoriaClick = (categoria) => {
    setCategoriaActual(categoria.nombre);
    // Filtrar las publicaciones según la categoría seleccionada
    const publicacionesFiltradas = publicaciones.filter(publicacion => publicacion.categoria === categoria.nombre);
    // Actualizar el estado de las publicaciones con las filtradas
    setPublicaciones(publicacionesFiltradas);
  };

  const categorias = [
    { id: 1, nombre: 'Comida', icono: <IoFastFood /> },
    { id: 2, nombre: 'Ropa', icono: <GiClothes /> },
    { id: 3, nombre: 'Electrónicos', icono: <GiLaptop /> },
    { id: 4, nombre: 'Juguetes y juegos', icono: <MdToys /> },
    { id: 5, nombre: 'Productos para mascotas', icono: <MdPets /> },
    { id: 6, nombre: 'Artículos deportivos', icono: <CgGym /> },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640); // Cambia 640 por el ancho que prefieras
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Simulación de obtener las publicaciones (puedes reemplazarlo con tu lógica real)
    const obtenerPublicaciones = () => {
      // Supongamos que estas son todas tus publicaciones
      const todasLasPublicaciones = [
        { id: 1, titulo: 'Publicación 1', categoria: 'Comida' },
        { id: 2, titulo: 'Publicación 2', categoria: 'Ropa' },
        { id: 3, titulo: 'Publicación 3', categoria: 'Comida' },
        // Agrega más publicaciones según sea necesario
      ];
      return todasLasPublicaciones;
    };

    const publicacionesObtenidas = obtenerPublicaciones();
    setPublicaciones(publicacionesObtenidas);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="mb-4 epilogue">
      <h2 className="text-2xl bg-slate-900 text-gray-100 py-2 px-4 rounded-lg w