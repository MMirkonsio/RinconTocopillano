import { useEffect, useRef } from "react";

// Llama a `alCerrar` al hacer clic fuera del elemento o al pulsar Escape (menús y popovers)
export function useClickFuera(abierto, alCerrar) {
  const ref = useRef(null);

  useEffect(() => {
    if (!abierto) return;
    const alClic = (e) => {
      if (ref.current && !ref.current.contains(e.target)) alCerrar();
    };
    const alTecla = (e) => e.key === "Escape" && alCerrar();
    document.addEventListener("mousedown", alClic);
    document.addEventListener("keydown", alTecla);
    return () => {
      document.removeEventListener("mousedown", alClic);
      document.removeEventListener("keydown", alTecla);
    };
  }, [abierto, alCerrar]);

  return ref;
}
