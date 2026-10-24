import { Link } from "react-router-dom";
import { LuStore } from "react-icons/lu";

export default function Logo({ conTexto = true }) {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="Rincón Tocopillano, inicio">
      <span className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-mar-500 to-mar-700 text-white shadow-sm shadow-mar-700/30">
        <LuStore className="size-5" />
      </span>
      {conTexto && (
        <span className="hidden leading-none sm:block">
          <span className="block text-[15px] font-extrabold tracking-tight">Rincón</span>
          <span className="block text-xs font-semibold text-arena-600 dark:text-arena-300">Tocopillano</span>
        </span>
      )}
    </Link>
  );
}
