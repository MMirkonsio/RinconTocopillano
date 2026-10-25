import { useParams } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Feed from "../components/posts/Feed";
import { categoriaPorId } from "../lib/categorias";
import { categoriaIdPorSlug } from "../lib/rutas";
import { useTitulo } from "../lib/useTitulo";
import NoEncontrado from "./NoEncontrado";

const DESCRIPCIONES = {
  1: "Completos, empanadas, colaciones, pasteles y todo lo rico que se cocina en Tocopilla.",
  2: "Ropa nueva y usada, calzado y accesorios.",
  3: "Celulares, computadores, consolas, audio y reparaciones.",
  4: "Juguetes, juegos de mesa y videojuegos para todas las edades.",
  5: "Alimento, accesorios, adopciones y servicios para mascotas.",
  6: "Bicicletas, equipamiento, clases y artículos deportivos.",
  7: "Todo lo que no cabe en otra categoría: servicios, hogar, vehículos y más.",
};

// /categoria/comida, /categoria/juguetes-y-juegos…
function PaginaCategoria({ id }) {
  const { nombre, Icono, color } = categoriaPorId(id);
  useTitulo(nombre);

  return (
    <AppLayout>
      <div className="space-y-4">
        <header className="tarjeta flex items-center gap-4 p-4 sm:p-5">
          <span className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${color}`}>
            <Icono className="size-7" />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{nombre}</h1>
            <p className="mt-0.5 text-sm text-suave">{DESCRIPCIONES[id]}</p>
          </div>
        </header>
        <Feed categoriaId={id} />
      </div>
    </AppLayout>
  );
}

const CategoriasScreen = () => {
  const { slug } = useParams();
  const id = categoriaIdPorSlug(slug);
  return id ? <PaginaCategoria key={id} id={id} /> : <NoEncontrado />;
};

export default CategoriasScreen;
