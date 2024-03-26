import { useState, useEffect } from "react";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.css";
import { useAuth } from "../utils/auth"; // Importa el hook de autenticación
import { InformationCircleIcon } from "../IconsSVG/Icons";
import { FiSend } from "react-icons/fi";

function FormPublicacion() {
  const { user } = useAuth(); // Obtiene el usuario autenticado
  const [, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    imagePreview: null,
    errorMessage: "",
    precio: "",
    titulo: "",
    contenido: "",
    categoriaId: "",
    usuario_id: "",
    nombreCategoria: "",
  });

  useEffect(() => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }
  }, [user]);

  const formatCurrency = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    const formattedValue = new Intl.NumberFormat("es-CL").format(numericValue);
    return `${formattedValue}`;
  };

  const handlePrecioChange = (e) => {
    let inputValue = e.target.value;
    inputValue = inputValue.slice(0, 12);
    setFormData({
      ...formData,
      precio: formatCurrency(inputValue),
    });
  };

  const handleChange = (e) => {
    const { name, type, value } = e.target;

    if (type === "file") {
      const file = e.target.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setFormData({
            ...formData,
            imagePreview: file, // Cambia esto a 'file', no 'event.target.result'
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
        usuario_id: user.id, // Aquí estableces usuario_id con el ID del usuario actual
      });
    }
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      imagePreview: null,
    });
  };

  // Dentro de la función handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { titulo, contenido, precio, usuario_id, categoriaId, imagePreview } =
      formData;

    // Verificar si el usuario está autenticado
    if (!user) {
      // Mostrar una alerta si el usuario no está autenticado
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debes iniciar sesión antes de publicar",
      });
      return; // Detener el envío del formulario
    }

    // Verificar si se ha adjuntado una imagen
    if (!imagePreview) {
      // Mostrar una alerta si no se ha adjuntado una imagen
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor adjunta una imagen",
      });
      return; // Detener el envío del formulario
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("titulo", titulo);
      formDataToSend.append("contenido", contenido);
      formDataToSend.append("precio", precio.replace(/[^\d]/g, ""));
      formDataToSend.append("categoria_id", categoriaId);
      formDataToSend.append("nombre_categoria", formData.nombreCategoria); // Agregar el nombre de la categoría al formulario
      formDataToSend.append("imagen_contenido", imagePreview);
      formDataToSend.append("usuario_id", usuario_id); // Cambiar 'user_id' a 'id'

      const response = await fetch("http://localhost:3307/publicar", {
        method: "POST",
        body: formDataToSend,
        credentials: "include", // Incluir credenciales en la solicitud
      });

      if (response.ok) {
        // Mostrar una alerta de SweetAlert2 cuando la publicación sea exitosa
        Swal.fire({
          icon: "success",
          title: "Publicación exitosa",
          text: "Tu publicación ha sido creada exitosamente",
        });
      } else {
        // Manejar errores aquí
      }
    } catch (error) {
      console.error("Error al crear la publicación:", error);
    }
  };

  // Si el usuario no está autenticado, mostrar un mensaje de inicio de sesión en lugar del formulario
  if (!user) {
    return (
      <div className="flex justify-center mt-[30dvh]">
        <div role="alert" className="mr-2">
          <InformationCircleIcon />
        </div>
        <span className="text-2xl font-bold epilogue">
          Inicia sesión para poder publicar.
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col relative bg-gray-100 w-full rounded-lg epilogue text-gray-800 dark:bg-rincon dark:text-gray-100">
      <h2 className="text-2xl font-bold">Crea tu publicación!</h2>
      <div className="flex flex-col lg:flex-row mt-6">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="lg:w-1/2 lg:pr-5"
        >
          <div className="mb-4">
            <label htmlFor="titulo" className="block mb-1 font-bold">
              Título:
            </label>
            <textarea
              type="text"
              id="titulo"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
              value={formData.titulo}
              onChange={handleChange}
              name="titulo"
              placeholder="Maximo 75 caracteres"
              maxLength={75}
              style={{ maxHeight: "70px", minHeight: "70px" }}
            />
            <div className="text-sm">Caracteres: {formData.titulo.length}</div>
          </div>
          <div className="mb-4">
            <label htmlFor="contenido" className="block mb-1 font-bold">
              Descripción:
            </label>
            <textarea
              id="contenido"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
              value={formData.contenido}
              onChange={handleChange}
              name="contenido"
              placeholder="Máximo 255 caracteres"
              maxLength={255} // Limitar a 255 caracteres
              style={{ maxHeight: "150px", minHeight: "150px" }}
            ></textarea>
            <div className="text-sm">
              Caracteres: {formData.contenido.length}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="precio" className="block mb-1 font-bold">
              Precio:
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-800 sm:text-sm">$</span>
              </div>
              <input
                type="text"
                name="precio"
                id="precio"
                value={formData.precio}
                onChange={handlePrecioChange}
                className="block w-full rounded-md border-0 py-2 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="categoria_id" className="block mb-1 font-bold">
              Categoría del producto:
            </label>
            <select
              id="categoria_id"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
              value={formData.categoriaId}
              onChange={handleChange}
              name="categoriaId"
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              <option value="1">Comida</option>
              <option value="2">Ropa</option>
              <option value="3">Electrónicos</option>
              <option value="4">Juguetes y juegos</option>
              <option value="5">Productos para mascotas</option>
              <option value="6">Artículos deportivos</option>
              <option value="7">Otros</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="imagen_contenido" className="block mb-1 font-bold">
              Imagen de la publicación (Máximo: 1):
            </label>
            <input
              type="file"
              id="imagen_contenido"
              name="imagen_contenido"
              accept="image/*"
              onChange={handleChange}
              className="w-full py-2  dark:text-gray-400 rounded-xl"
            />
          </div>
          {formData.errorMessage && (
            <div className="mb-4 text-red-500">{formData.errorMessage}</div>
          )}
          <div className="flex  lg:justify-start">
            <button
              type="submit"
              className="flex flex-row items-center gap-1 bg-rincon font-bold text-gray-100 px-4 py-2 rounded-md hover:bg-rinconHover dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-gray-300"
            >
              <FiSend />
              Publicar
            </button>
          </div>
        </form>
        {formData.imagePreview && (
          <div className="lg:w-1/2 mt-6 lg:mt-0">
            <div className="mb-4">
              <label className="block mb-1">Vista previa de la imagen:</label>
              <div className="relative">
                <img
                  src={URL.createObjectURL(formData.imagePreview)}
                  alt={`Vista previa`}
                  className="w-120 h-120 rounded-md"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-md h-8 w-8"
                >
                  X
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormPublicacion;
