import { useCallback, useRef, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { imagenUrl } from "../../lib/formato";

// Galería deslizable de fotos. En móvil se desliza con el dedo (scroll-snap);
// en escritorio aparecen flechas al pasar el mouse. Teclado: ← y → con el foco en la galería.
export default function Carrusel({ imagenes, titulo, alto = "aspect-[4/3]", gris = false, alAbrir, etiquetaAbrir }) {
  const pista = useRef(null);
  const [indice, setIndice] = useState(0);
  // Foto a la que se está yendo con un botón; mientras dura la animación se ignoran
  // los eventos de scroll intermedios para que el contador no salte
  const destinoRef = useRef(null);
  const temporizador = useRef(null);
  const total = imagenes.length;

  const irA = useCallback((i) => {
    const el = pista.current;
    if (!el) return;
    const destino = Math.max(0, Math.min(i, el.children.length - 1));
    setIndice(destino);
    destinoRef.current = destino;
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => (destinoRef.current = null), 800);
    el.scrollTo({ left: destino * el.clientWidth, behavior: "smooth" });
  }, []);

  const alDesplazar = () => {
    const el = pista.current;
    if (!el) return;
    const actual = Math.round(el.scrollLeft / el.clientWidth);
    if (destinoRef.current !== null) {
      if (actual === destinoRef.current) destinoRef.current = null;
      return;
    }
    setIndice(actual); // deslizamiento con el dedo o el trackpad
  };

  const alTecla = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      irA(indice + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      irA(indice - 1);
    }
  };

  const flecha = "absolute top-1/2 z-10 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-md transition hover:bg-white sm:flex sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 disabled:invisible";

  return (
    <div className="group relative" role="region" aria-roledescription="carrusel" aria-label={`Fotos de ${titulo}`}>
      <div
        ref={pista}
        onScroll={alDesplazar}
        onKeyDown={total > 1 ? alTecla : undefined}
        tabIndex={total > 1 ? 0 : undefined}
        className={`flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain sin-scrollbar focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-mar-500 ${alto}`}
      >
        {imagenes.map((archivo, i) => {
          const src = imagenUrl(archivo);
          return (
            <div
              key={`${archivo}-${i}`}
              className="relative h-full w-full shrink-0 snap-center overflow-hidden bg-superficie-2"
              aria-roledescription="foto"
              aria-label={`${i + 1} de ${total}`}
            >
              {/* Fondo desenfocado para que las fotos verticales no queden con bordes vacíos */}
              <img
                src={src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className={`absolute inset-0 size-full scale-110 object-cover opacity-60 blur-2xl ${gris ? "grayscale" : ""}`}
              />
              <button
                type="button"
                onClick={() => alAbrir?.(i)}
                className="relative flex size-full cursor-zoom-in items-center justify-center"
                aria-label={etiquetaAbrir ?? `Ampliar foto ${i + 1}`}
                tabIndex={-1}
              >
                <img
                  src={src}
                  alt={total > 1 ? `${titulo} (foto ${i + 1} de ${total})` : titulo}
                  loading={i === 0 ? "eager" : "lazy"}
                  draggable="false"
                  className={`max-h-full max-w-full object-contain ${gris ? "grayscale" : ""}`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {total > 1 && (
        <>
          <button type="button" onClick={() => irA(indice - 1)} disabled={indice === 0} className={`${flecha} left-3`} aria-label="Foto anterior">
            <LuChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => irA(indice + 1)}
            disabled={indice === total - 1}
            className={`${flecha} right-3`}
            aria-label="Foto siguiente"
          >
            <LuChevronRight className="size-5" />
          </button>
          <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-slate-950/60 px-2 py-0.5 text-xs font-semibold text-white tabular-nums backdrop-blur-sm">
            {indice + 1}/{total}
          </span>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {imagenes.map((archivo, i) => (
              <button
                key={`punto-${archivo}-${i}`}
                type="button"
                onClick={() => irA(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === indice}
                className={`h-1.5 rounded-full shadow-sm transition-all ${i === indice ? "w-5 bg-white" : "w-1.5 bg-white/60 hover:bg-white/90"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
