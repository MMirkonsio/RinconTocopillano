import FormPublicacion from "../components/FormPublicacion";
import Navbar from "../components/Navbar";

const PublicacionScreen = () => {
  return (
    <div className="flex min-h-[100dvh] justify-center lg:gap-16 mx-auto w-3/4">
      <Navbar />
      <div className="flex-1 lg:mt-10 mt-28">
        <FormPublicacion />
      </div>
    </div>
  );
};

export default PublicacionScreen;
