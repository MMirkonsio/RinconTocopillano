import { useState, useEffect } from 'react';
import { IoSearch } from 'react-icons/io5';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (showResults) {
      // Aquí puedes realizar la lógica de búsqueda y actualizar searchResults
      // Por ahora, solo simularé algunos resultados de búsqueda.
      const results = ['Resultado 1', 'Resultado 2', 'Resultado 3'].filter(result =>
        result.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSearchResults(results);
    }
  }, [searchTerm, showResults]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFocus = () => {
    setShowResults(true);
  };

  const handleBlur = () => {
    // Retrasar el ocultar los resultados por si el usuario hace clic en un resultado
    setTimeout(() => setShowResults(false), 100);
  };

  const handleResultClick = (result) => {
    // Puedes manejar la acción cuando el usuario hace clic en un resultado
    console.log(`Clic en el resultado: ${result}`);
    // Aquí puedes redirigir a una página, ejecutar una acción, etc.
  };

  return (
    <div className="mb-12">
      <div className='rounded-lg bg-gray-200 dark:bg-gray-100 text-gray-800'>
        <div className='relative  flex items-stretch '>
          <IoSearch className="absolute  inset-y-0 left-0 m-4 dark:text-gray-800 text-gray-800 " />

          <input
            type="text"
            placeholder="Buscar en Tocopilla..."
            value={searchTerm}
            aria-label="Search components"
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="flex-grow  appearance-none bg-transparent py-4 pl-12 pr-4 text-base hover:bg-gray-300 rounded-lg text-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 placeholder:text-gray-800 focus:outline-none sm:text-sm sm:leading-6"
          />

          {/* Resultados de búsqueda */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute mt-11 w-full  dark:bg-gray-100 dark:text-gray-100 text-gray-800 shadow-lg rounded-b-lg">
              <ul className="dark:bg-gray-100 dark:text-gray-800 bg-gray-200 text-gray-800 rounded-b-lg">
                {searchResults.map((result, index) => (
                  <li
                    key={index}
                    className="p-3 hover:bg-gray-300 dark:hover:bg-gray-300 cursor-pointer rounded-b-lg"
                    onClick={() => handleResultClick(result)}
                  >
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
