import { useEffect } from "react";

const SITIO = "Rincón Tocopillano";

// Título de la pestaña del navegador: "Guardados · Rincón Tocopillano"
export function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} · ${SITIO}` : SITIO;
  }, [titulo]);
}
