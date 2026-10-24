import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import Logo from "./Logo";
import ToggleTema from "../ui/ToggleTema";

// Pantalla dividida para login y registro: foto de Tocopilla a la izquierda, formulario a la derecha
export default function AuthLayout({ titulo, subtitulo, children }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img src="/images/tocopilla.jpg" alt="Tocopilla vista desde el cerro" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-mar-950/90 via-mar-950/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10 text-white">
          <p className="text-sm font-semibold tracking-widest text-arena-200 uppercase">Rincón Tocopillano</p>
          <p className="mt-3 max-w-md text-3xl leading-tight font-bold">Compra, vende y descubre lo que ofrecen tus vecinos.</p>
          <p className="mt-3 max-w-md text-white/75">Comida casera, ropa, tecnología y mucho más, todo en Tocopilla.</p>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <Logo />
          <ToggleTema />
        </div>
        <main className="flex flex-1 items-center justify-center px-4 pb-12">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{titulo}</h1>
            {subtitulo && <p className="mt-2 text-sm text-suave">{subtitulo}</p>}
            <div className="mt-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Campo con etiqueta, ícono opcional y mensaje de ayuda
export function Campo({ id, etiqueta, Icono, ayuda, children }) {
  return (
    <div>
      <label htmlFor={id} className="etiqueta">
        {etiqueta}
      </label>
      <div className="relative">
        {Icono && <Icono className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-suave" />}
        {children}
      </div>
      {ayuda && <p className="mt-1.5 text-xs text-suave">{ayuda}</p>}
    </div>
  );
}

export function CampoPassword({ id, value, onChange, autoComplete, Icono }) {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <input
        id={id}
        name={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required
        className={`campo pr-11 ${Icono ? "pl-10" : ""}`}
        placeholder={autoComplete === "new-password" ? "Crea una contraseña" : "Tu contraseña"}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-suave hover:bg-superficie-2 hover:text-texto"
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        {visible ? <LuEyeOff className="size-4" /> : <LuEye className="size-4" />}
      </button>
    </>
  );
}
