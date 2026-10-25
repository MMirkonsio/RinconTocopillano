import { useState } from "react";
import { LuMoon, LuSun } from "react-icons/lu";

// Alterna entre modo claro y oscuro (el tema inicial lo aplica index.html antes de pintar)
export default function ToggleTema() {
  const [oscuro, setOscuro] = useState(() => document.documentElement.classList.contains("dark"));

  const alternar = () => {
    const nuevo = !oscuro;
    const html = document.documentElement;
    // Cambiar de tema sin que cada botón y tarjeta anime su color por separado
    html.classList.add("sin-transiciones");
    html.classList.toggle("dark", nuevo);
    requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove("sin-transiciones")));
    try {
      localStorage.setItem("color-theme", nuevo ? "dark" : "light");
    } catch {
      // Sin localStorage el tema dura solo esta visita
    }
    setOscuro(nuevo);
  };

  return (
    <button
      type="button"
      onClick={alternar}
      className="btn-icono"
      aria-label={oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={oscuro ? "Modo claro" : "Modo oscuro"}
    >
      {oscuro ? <LuSun className="size-5" /> : <LuMoon className="size-5" />}
    </button>
  );
}
