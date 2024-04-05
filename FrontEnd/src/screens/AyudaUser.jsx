import Ayuda from "../components/Ayuda";
import Navbar from "../components/Navbar";

const AyudaUser = () => {
  return (
    <div className="container mx-auto max-w-[1200px] flex justify-center gap-4  noto-sans">
      <Navbar />
      <div className="flex-1 lg:mt-10 mt-28">
        <Ayuda className="mb-4" />
      </div>
    </div>
  );
};

export default AyudaUser;
