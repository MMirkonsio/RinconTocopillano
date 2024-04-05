import FormPublicacion from "../components/FormPublicacion";
import Navbar from "../components/Navbar";

const PublicacionScreen = () => {
  return (
    <div className="container mx-auto max-w-[1200px] flex justify-center gap-4  noto-sans">
      <Navbar />
      <div className="flex-1 lg:mt-10 mt-28">
        <FormPublicacion />
      </div>
    </div>
  );
};

export default PublicacionScreen;
