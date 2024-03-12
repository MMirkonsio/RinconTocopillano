import { useState } from "react";

function FormPublicacion() {
  const [imagePreview, setImagePreview] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [precio, setPrecio] = useState('');

  const formatCurrency = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    const formattedValue = new Intl.NumberFormat("es-CL").format(numericValue);
    return `$${formattedValue}`;
  };

  const handlePrecioChange = (e) => {
    let inputValue = e.target.value;

    // Limitar a 12 dígitos
    inputValue = inputValue.slice(0, 12);

    // Formatear como moneda
    setPrecio(formatCurrency(inputValue));
  };
  
  const handleImageChange = (e) => {
    const files = e.target.files;

    if (files.length + imagePreview.length <= 10) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview((prevImages) => [...prevImages, reader.result]);
        };
        reader.readAsDataURL(file);
      });

      setErrorMessage("");
    } else {
      setErrorMessage("Puedes agregar un máximo de 10 fotos.");
    }
  };

  const handleRemoveImage = (index) => {
    setImagePreview((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-screen relative mt-8 bg-gray-100 lg:ml-auto lg:mr-20 w-3/4 p-6 rounded-lg epilogue text-gray-800  dark:bg-rincon dark:text-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Crear Publicación</h2>
      <form>
        <div className="mb-4">
          <label htmlFor="titulo" className="block mb-1">
            Título:
          </label>
          <input
            type="text"
            id="titulo"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="descripcion" className="block mb-1">
            Descripción:
          </label>
          <textarea
            id="descripcion"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-sm font-medium leading-6"
          >
            Precio:
          </label>
          <div className="relative mt-2 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-800 sm:text-sm">$</span>
            </div>
            <input
              type="text"
              name="price"
              id="price"
              value={precio}
              onChange={handlePrecioChange}
              className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="0.00"
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="condicion" className="block mb-1">
            Condición del producto:
          </label>
          <select
            id="condicion"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
          >
            <option value="" disabled selected>
              Selecciona la condición
            </option>
            <option value="usado-como-nuevo">Usado - Como Nuevo</option>
            <option value="usado-buen-estado">Usado - Buen Estado</option>
            <option value="usado-aceptable">Usado - Aceptable</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="condicion" className="block mb-1">
            Categoría del producto:
          </label>
          <select
            id="condicion"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
          >
            <option value="" disabled selected>
              Selecciona una categoría
            </option>
            <option value="comida">Comida</option>
            <option value="ropa">Ropa</option>
            <option value="electronico">Electrónicos</option>
            <option value="juguetes">Juguetes y juegos</option>
            <option value="mascotas">Productos para mascotas</option>
            <option value="deportivos">Artículos deportivos</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="imagen" className="block mb-1">
            Imagen ({imagePreview.length}/10):
          </label>
          <input
            type="file"
            id="imagen"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full py-2"
            multiple
          />
        </div>

        {/* Mensaje de error */}
        {errorMessage && (
          <div className="mb-4 text-red-500">{errorMessage}</div>
        )}

        {/* Vista previa de las imágenes */}
        {imagePreview.length > 0 && (
          <div className="mb-4">
            <label className="block mb-1">Vista previa de las imágenes:</label>
            <div className="flex flex-wrap gap-2">
              {imagePreview.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Vista previa ${index + 1}`}
                    className="w-32 h-32 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-md h-8 w-8"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          type="submit"
          className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-gray-300"
        >
          Publicar
        </button>
      </form>
    </div>
  );
}

export default FormPublicacion;
