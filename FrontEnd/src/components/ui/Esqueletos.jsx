// Marcadores de carga con la forma del contenido final

export function PostEsqueleto() {
  return (
    <div className="tarjeta p-4 sm:p-5" aria-hidden="true">
      <div className="flex items-center gap-3">
        <div className="esqueleto size-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="esqueleto h-3 w-32" />
          <div className="esqueleto h-3 w-20" />
        </div>
      </div>
      <div className="esqueleto mt-4 h-5 w-3/4" />
      <div className="esqueleto mt-2 h-4 w-1/2" />
      <div className="esqueleto mt-4 aspect-[16/10] w-full rounded-xl" />
    </div>
  );
}

export function ListaEsqueletos({ cantidad = 3 }) {
  return (
    <div className="space-y-4" role="status" aria-label="Cargando">
      {Array.from({ length: cantidad }, (_, i) => (
        <PostEsqueleto key={i} />
      ))}
    </div>
  );
}

export function GrillaEsqueletos({ cantidad = 6 }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3" role="status" aria-label="Cargando">
      {Array.from({ length: cantidad }, (_, i) => (
        <div key={i} className="tarjeta overflow-hidden" aria-hidden="true">
          <div className="esqueleto aspect-square rounded-none" />
          <div className="space-y-2 p-3">
            <div className="esqueleto h-4 w-3/4" />
            <div className="esqueleto h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
