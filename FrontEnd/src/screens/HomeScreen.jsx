import Publicaciones from '../components/Publicaciones';
import Search from '../components/Search';
import MasPopular from '../components/MasPopular';

const HomeScreen = () => {
  return (
    <div className="bg-gray-100 dark:bg-rincon h-screen flex justify-center lg:ml-auto lg:mr-48 md:gap-16 lg:w-2/3  transition-gap duration-500 ease-in-out">
      <div className="flex-1 lg:mt-10 mt-28  ml-4 mr-4 w-full">
        <Search className="mb-4" />
        <Publicaciones />
      </div>
      <div className="hidden mt-28 lg:mt-10 md:block">
        <MasPopular />
      </div>
    </div>
  );
};

export default HomeScreen;
