import { imagenUrl } from "../../lib/formato";

const TAMANOS = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-14",
  xl: "size-28",
};

// Foto de perfil redonda; si falla la imagen, muestra la por defecto
export default function Avatar({ foto, nombre, tamano = "md", className = "" }) {
  return (
    <img
      src={imagenUrl(foto)}
      alt={nombre ? `Foto de ${nombre}` : ""}
      loading="lazy"
      onError={(e) => {
        if (!e.currentTarget.src.endsWith("/default.webp")) e.currentTarget.src = imagenUrl("default.webp");
      }}
      className={`${TAMANOS[tamano]} shrink-0 rounded-full bg-superficie-2 object-cover ring-1 ring-black/5 dark:ring-white/10 ${className}`}
    />
  );
}
