// Publicaciones.jsx
import PropTypes from "prop-types";
import { IoSearch } from "react-icons/io5";

const Search = ({ setSearchTerm }) => {
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="lg:w-full relative rounded-lg bg-gray-100 dark:bg-rincon lg:mb-6 lg:m-0 m-6">
      <IoSearch className="absolute inset-y-0 left-0 m-4 dark:text-gray-800 text-gray-800 " />
      <input
        type="text"
        placeholder="Buscar en Tocopilla..."
        aria-label="Search components"
        onChange={handleInputChange}
        className="w-full py-4 pl-12 pr-4 text-base rounded-lg text-gray-800 dark:text-gray-800 font-semibold dark:placeholder:text-gray-400 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
      />
    </div>
  );
};

Search.propTypes = {
  setSearchTerm: PropTypes.func.isRequired,
};

export default Search;
