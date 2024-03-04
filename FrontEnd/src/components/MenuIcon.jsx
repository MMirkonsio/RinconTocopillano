// Archivo: HamburgerIcon.jsx
import PropTypes from 'prop-types';

const MenuIcon  = ({ menuOpen, toggleMenu }) => {
  return (
    <button
      onClick={toggleMenu}
      className="text-gray-500 focus:outline-none focus:ring focus:border-blue-300"
    >
      <svg
        className={`w-10 h-10 ${menuOpen ? 'block' : 'hidden'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16M4 12h16m-7 6h7"
        ></path>
      </svg>
      <svg
        className={`w-10 h-10 ${menuOpen ? 'hidden' : 'block'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        ></path>
      </svg>
    </button>
  );
};

MenuIcon.propTypes = {
  menuOpen: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};

export default MenuIcon;
