import Ayuda from "../components/Ayuda";
import Navbar from "../components/Navbar";

const AyudaUser = () => {
  return (
    <div className="flex min-h-[100dvh] justify-center lg:gap-16 mx-auto w-3/4">
      <Navbar />
      <div className="flex-1 lg:mt-10 mt-28">
        <Ayuda className="mb-4" />
      </div>
    </div>
  );
};

export default AyudaUser;
