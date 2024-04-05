import PropTypes from "prop-types";
import { IoSearch } from "react-icons/io5";

const Search = ({ setSearchTerm }) => {
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="lg:w-full relative rounded-lg bg-gray-100 dark:bg-rincon lg:mb-6 lg:m-0 m-6 flex items-center">
      <input
        type="text"
        placeholder="Buscar en Tocopilla..."
        aria-label="Search components"
        onChange={handleInputChange}
        className="w-full py-4  rounded-lg border border-gray-300 dark:border-gray-700 border-opacity-75 text-rincon focus:ring-rincon focus:border-rincon placeholder:text-gray-400 text-sm"
      />
      <IoSearch className="absolute right-4 top-0 bottom-0 m-auto  text-rincon flex-shrink-0" />
    </div>
  );
};

Search.propTypes = {
  setSearchTerm: PropTypes.func.isRequired,
};

export default Search;
