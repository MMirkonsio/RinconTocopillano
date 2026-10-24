import {
  LuUtensils,
  LuShirt,
  LuSmartphone,
  LuGamepad2,
  LuPawPrint,
  LuDumbbell,
  LuPackage,
} from "react-icons/lu";

// Mismos ids que la tabla `categorias` de la base de datos
export const CATEGORIAS = [
  { id: 1, nombre: "Comida", Icono: LuUtensils, color: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300" },
  { id: 2, nombre: "Ropa", Icono: LuShirt, color: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300" },
  { id: 3, nombre: "Electrónicos", Icono: LuSmartphone, color: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" },
  { id: 4, nombre: "Juguetes y juegos", Icono: LuGamepad2, color: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300" },
  { id: 5, nombre: "Mascotas", Icono: LuPawPrint, color: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" },
  { id: 6, nombre: "Deportes", Icono: LuDumbbell, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" },
  { id: 7, nombre: "Otros", Icono: LuPackage, color: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300" },
];

export const categoriaPorId = (id) => CATEGORIAS.find((c) => c.id === Number(id)) ?? CATEGORIAS[6];
