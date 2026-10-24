import { useState } from "react";
import { LuChevronLeft, LuChevronRight, LuImagePlus, LuPlus, LuStar, LuX } from "react-icons/lu";

const MAX_FOTOS = 8;
const TIPOS_IMAGEN = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Hasta 8 fotos para una publicación: la primera es la portada; se pueden reordenar y quitar.
// `fotos` es una lista de { id, archivo, url } (url = vista previa local).
export default function SelectorFotos({ fotos, setFotos, setError }) {
  const [arrastrando, setArrastrando] = useState(false);

  const agregar = (lista) => {
    const nuevas = [];
    const rechazadas = [];
    for (const file of lista) {
      if (fotos.length + nuevas.length >= MAX_FOTOS) {
        rechazadas.push(`máximo ${MAX_FOTOS} fotos`);
        break;
      }
      if (!TIPOS_IMAGEN.includes(file.type)) rechazadas.push(`«${file.name}» no es JPG, PNG, WEBP o GIF`);
      else if (file.size > 5 * 1024 * 1024) rechazadas.push(`«${file.name}» pesa más de 5 MB`);
      else nuevas.push({ id: crypto.randomUUID(), archivo: file, url: URL.createObjectURL(file) });
    }
    setError(rechazadas.length ? `No se agregaron algunas fotos: ${rechazadas.join(", ")}.` : "");
    if (nuevas.length) setFotos((actuales) => [...actuales, ...nuevas]);
  };

  const quitar = (id) =>
    setFotos((actuales) => {
      const foto = actuales.find((f) => f.id === id);
      if (foto) URL.revokeObjectURL(foto.url);
      return actuales.filter((f) => f.id !== id);
    });

  const mover = (indice, paso) =>
    setFotos((actuales) => {
      const destino = indice + paso;
      if (destino < 0 || destino >= actuales.length) return actuales;
      const copia = [...actuales];
      [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
      return copia;
    });

  const eventosArrastre = {
    onDragOver: (e) => {
      e.preventDefault();
      setArrastrando(true);
    },
    onDragLeave: () => setArrastrando(false),
    onDrop: (e) => {
      e.preventDefault();
      setArrastrando(false);
      agregar([...e.dataTransfer.files]);
    },
  };

  const entrada = (
    <input
      type="file"
      multiple
      accept={TIPOS_IMAGEN.join(",")}
      onChange={(e) => {
        agregar([...e.target.files]);
        e.target.value = ""; // permite volver a elegir el mismo archivo
      }}
      className="sr-only"
    />
  );

  const botonMini =
    "flex size-7 items-center justify-center rounded-full bg-slate-950/65 text-white backdrop-blur-sm transition hover:bg-slate-950/85 disabled:invisible";

  if (fotos.length === 0) {
    return (
      <label
        {...eventosArrastre}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          arrastrando ? "border-mar-500 bg-mar-50 dark:bg-mar-500/10" : "border-borde bg-superficie-2 hover:border-mar-300"
        }`}
      >
        <span className="flex size-12 items-center justify-center rounded-2xl bg-superficie text-mar-600 shadow-tarjeta dark:text-mar-300">
          <LuImagePlus className="size-6" />
        </span>
        <span className="mt-3 text-sm font-semibold">Arrastra tus fotos o haz clic para elegirlas</span>
        <span className="mt-1 text-xs text-suave">Hasta {MAX_FOTOS} fotos · JPG, PNG, WEBP o GIF · máx. 5 MB cada una</span>
        {entrada}
      </label>
    );
  }

  return (
    <div {...eventosArrastre} className={`rounded-2xl transition ${arrastrando ? "ring-4 ring-mar-500/30" : ""}`}>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {fotos.map((foto, i) => (
          <li key={foto.id} className="relative aspect-square overflow-hidden rounded-xl border border-borde bg-superficie-2">
            <img src={foto.url} alt={`Foto ${i + 1}`} className="size-full object-cover" />
            {i === 0 && (
              <span className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded-full bg-mar-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase shadow-sm">
                <LuStar className="size-3 fill-current" /> Portada
              </span>
            )}
            <button
              type="button"
              onClick={() => quitar(foto.id)}
              className={`${botonMini} absolute top-1.5 right-1.5`}
              aria-label={`Quitar foto ${i + 1}`}
            >
              <LuX className="size-3.5" />
            </button>
            <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between">
              <button
                type="button"
                onClick={() => mover(i, -1)}
                disabled={i === 0}
                className={botonMini}
                aria-label={`Mover foto ${i + 1} antes`}
              >
                <LuChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => mover(i, 1)}
                disabled={i === fotos.length - 1}
                className={botonMini}
                aria-label={`Mover foto ${i + 1} después`}
              >
                <LuChevronRight className="size-4" />
              </button>
            </div>
          </li>
        ))}
        {fotos.length < MAX_FOTOS && (
          <li>
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-borde text-suave transition hover:border-mar-300 hover:text-mar-600">
              <LuPlus className="size-5" />
              <span className="text-xs font-semibold">Agregar</span>
              {entrada}
            </label>
          </li>
        )}
      </ul>
      <p className="mt-2 text-xs text-suave">
        {fotos.length}/{MAX_FOTOS} fotos · La primera es la portada; usa las flechas para cambiar el orden.
      </p>
    </div>
  );
}
