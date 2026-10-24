import { Link } from "react-router-dom";
import { LuChevronDown, LuMail, LuShieldCheck } from "react-icons/lu";
import AppLayout from "../components/layout/AppLayout";
import { useTitulo } from "../lib/useTitulo";
import { rutas } from "../lib/rutas";

const PREGUNTAS = [
  {
    pregunta: "¿Cómo publico algo para vender?",
    respuesta:
      "Inicia sesión y toca «Publicar». Agrega una foto, un título, una descripción, el precio y la categoría. Tu publicación aparece de inmediato en el inicio.",
  },
  {
    pregunta: "¿Cómo contacto a quien vende?",
    respuesta:
      "En cada publicación verás el botón «Contactar por WhatsApp» (si la persona registró su teléfono). También puedes dejar una pregunta en los comentarios.",
  },
  {
    pregunta: "¿Para qué sirven los votos?",
    respuesta:
      "Los votos a favor ayudan a que las mejores publicaciones suban en «Populares» y en «Lo más votado». Puedes cambiar o quitar tu voto cuando quieras.",
  },
  {
    pregunta: "¿Cómo guardo una publicación para verla después?",
    respuesta: "Toca «Guardar» en la publicación. La encontrarás en la sección «Guardados» del menú.",
  },
  {
    pregunta: "¿Cómo cambio mis datos o mi horario de atención?",
    respuesta:
      "Abre el menú de tu foto (arriba a la derecha) y elige «Editar perfil». Ahí puedes cambiar tu nombre, teléfono, dirección, horario y descripción.",
  },
  {
    pregunta: "¿Cómo elimino una publicación o un comentario?",
    respuesta:
      "En tus propias publicaciones verás el botón «…» con la opción «Eliminar publicación». En tus comentarios aparece la opción «Eliminar».",
  },
];

const CONSEJOS = [
  "Revisa el producto antes de pagar.",
  "Coordina la entrega en lugares públicos y concurridos.",
  "Desconfía de precios demasiado bajos o de pedidos de pago por adelantado.",
  "Nunca compartas contraseñas ni códigos que te lleguen por SMS.",
];

const AyudaUser = () => {
  useTitulo("Ayuda");
  return (
  <AppLayout>
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Centro de ayuda</h1>
        <p className="text-sm text-suave">Respuestas rápidas para usar Rincón Tocopillano.</p>
      </header>

      <section className="tarjeta divide-y divide-borde overflow-hidden">
        {PREGUNTAS.map(({ pregunta, respuesta }) => (
          <details key={pregunta} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 font-semibold transition hover:bg-superficie-2 [&::-webkit-details-marker]:hidden">
              {pregunta}
              <LuChevronDown className="size-5 shrink-0 text-suave transition group-open:rotate-180" />
            </summary>
            <p className="px-4 pb-4 text-sm leading-relaxed text-suave">{respuesta}</p>
          </details>
        ))}
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="tarjeta p-5">
          <h2 className="flex items-center gap-2 font-bold">
            <LuShieldCheck className="size-5 text-mar-600 dark:text-mar-300" /> Compra segura
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-suave">
            {CONSEJOS.map((c) => (
              <li key={c} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-mar-500" /> {c}
              </li>
            ))}
          </ul>
        </section>
        <section className="tarjeta p-5">
          <h2 className="flex items-center gap-2 font-bold">
            <LuMail className="size-5 text-arena-500" /> ¿Necesitas más ayuda?
          </h2>
          <p className="mt-3 text-sm text-suave">
            Escríbenos y te responderemos lo antes posible. También puedes reportar publicaciones que no cumplan las reglas.
          </p>
          <a href="mailto:TocoTurbo@gmail.com" className="btn-secundario mt-4">
            <LuMail className="size-4" /> TocoTurbo@gmail.com
          </a>
        </section>
      </div>

      <p className="text-center text-sm text-suave">
        ¿Listo para empezar?{" "}
        <Link to={rutas.publicar} className="font-semibold text-mar-600 hover:underline dark:text-mar-300">
          Crea tu primera publicación
        </Link>
      </p>
    </div>
  </AppLayout>
  );
};

export default AyudaUser;
