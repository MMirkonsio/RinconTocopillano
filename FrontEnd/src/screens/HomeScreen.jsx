import { useSearchParams } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Feed from "../components/posts/Feed";
import { useTitulo } from "../lib/useTitulo";

// Portada: / (con ?q= para buscar, ?orden= y ?estado= para filtrar)
const HomeScreen = () => {
  const [params] = useSearchParams();
  const q = params.get("q");
  useTitulo(q ? `Buscar «${q}»` : params.get("orden") === "populares" ? "Populares" : null);

  return (
    <AppLayout>
      <Feed />
    </AppLayout>
  );
};

export default HomeScreen;
