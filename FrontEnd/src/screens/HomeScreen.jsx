import Publicaciones from "../components/Publicaciones";
import Search from "../components/Search";
import MasPopular from "../components/MasPopular";
import { useState } from "react";
import Navbar from "../components/Navbar";

const HomeScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex min-h-[100dvh] justify-center lg:gap-16 mx-auto lg:w-3/4">
      <Navbar />
      <div className="flex-1 lg:mt-10 mt-28">
        <Search setSearchTerm={setSearchTerm} />
        <Publicaciones searchTerm={searchTerm} />
      </div>
      <div className="hidden mt-28 lg:mt-10 lg:block">
        <MasPopular />
      </div>
    </div>
  );
};

export default HomeScreen;
