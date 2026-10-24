// Mensaje centrado con ícono para listas vacías, errores o pantallas sin sesión
export default function EstadoVacio({ Icono, titulo, texto, children }) {
  return (
    <div className="tarjeta flex flex-col items-center px-6 py-14 text-center">
      {Icono && (
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-mar-50 text-mar-600 dark:bg-mar-500/10 dark:text-mar-300">
          <Icono className="size-7" />
        </div>
      )}
      <h2 className="text-lg font-bold">{titulo}</h2>
      {texto && <p className="mt-1 max-w-sm text-sm text-suave">{texto}</p>}
      {children && <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  );
}
