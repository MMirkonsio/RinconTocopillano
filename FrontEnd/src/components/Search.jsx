import { useState } from 'react';
import PropTypes from 'prop-types';
import { IoSearch } from "react-icons/io5";

const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm.trim()); // Elimina espacios en blanco al inicio y al final
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="mb-12">
      <div className='rounded-lg bg-white shadow-md'>
        <div className='relative flex items-stretch'>
          <input
            type="text"
            placeholder="Buscar en tocopilla..."
            value={searchTerm}
            aria-label="Search components"
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="flex-grow appearance-none bg-transparent py-4 pl-4 pr-12 text-base text-slate-900 placeholder:text-slate-600 focus:outline-none sm:text-sm sm:leading-6"
          />
          <button
            onClick={handleSearch}
            className="flex items-center gap-1 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
          ><IoSearch />
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
};

Search.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default Search;
