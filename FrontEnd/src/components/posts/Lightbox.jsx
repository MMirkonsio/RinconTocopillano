import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LuChevronLeft, LuChevronRight, LuX } from "react-icons/lu";

// Fotos a pantalla completa. Escape cierra; ← y → cambian de foto.
export default function Lightbox({ imagenes, inicio = 0, alt, alCerrar }) {
  const [indice, setIndice] = useState(inicio);
  const total = imagenes.length;
  const mover = (paso) => setIndice((i) => (i + paso + total) % total);

  useEffect(() => {
    const alTecla = (e) => {
      if (e.key === "Escape") alCerrar();
      else if (e.key === "ArrowRight" && total > 1) setIndice((i) => (i + 1) % total);
      else if (e.key === "ArrowLeft" && total > 1) setIndice((i) => (i - 1 + total) % total);
    };
    document.addEventListener("keydown", alTecla);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alTecla);
      document.body.style.overflow = "";
    };
  }, [alCerrar, total]);

  const boton = "flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20";

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex animate-aparecer items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm sm:px-20"
      onClick={alCerrar}
      role="dialog"
      aria-modal="true"
      aria-label="Fotos ampliadas"
    >
      <button type="button" onClick={alCerrar} className={`${boton} absolute top-4 right-4`} aria-label="Cerrar">
        <LuX className="size-5" />
      </button>
      {total > 1 && (
        <>
          <span className="absolute top-6 left-1/2 -translate-x-1/2 text-sm font-semibold text-white/80 tabular-nums">
            {indice + 1} / {total}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              mover(-1);
            }}
            className={`${boton} absolute left-3 sm:left-6`}
            aria-label="Foto anterior"
          >
            <LuChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              mover(1);
            }}
            className={`${boton} absolute right-3 sm:right-6`}
            aria-label="Foto siguiente"
          >
            <LuChevronRight className="size-6" />
          </button>
        </>
      )}
      <img
        key={imagenes[indice]}
        src={imagenes[indice]}
        alt={total > 1 ? `${alt} (foto ${indice + 1} de ${total})` : alt}
        className="max-h-full max-w-full animate-aparecer rounded-xl object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body
  );
}
