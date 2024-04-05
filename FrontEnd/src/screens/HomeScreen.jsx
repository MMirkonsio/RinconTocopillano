import Publicaciones from "../components/Publicaciones";
import Search from "../components/Search";
import MasPopular from "../components/MasPopular";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";

const HomeScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [totalComentarios, setTotalComentarios] = useState(0); // Define el estado de totalComentarios
  const { publicacion_id } = useParams();

  return (
    <div className="container mx-auto max-w-[1200px] flex justify-center gap-4  noto-sans">
      <Navbar />
      <div className="flex-1 lg:mt-10 mt-20">
        <Search setSearchTerm={setSearchTerm} />
        
        <Publicaciones
          searchTerm={searchTerm}
          totalComentarios={totalComentarios} // Pasa totalComentarios como un prop
          setTotalComentarios={setTotalComentarios} // Pasa la función setter de totalComentarios como un prop
          publicacion_id={publicacion_id}
        />
        
      </div>
      <div className="hidden mt-28 lg:mt-10 lg:block">
        <MasPopular />
      </div>
    </div>
  );
};

export default HomeScreen;
