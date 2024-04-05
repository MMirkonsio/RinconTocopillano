import { useState } from "react";
import PropTypes from "prop-types"; // Importar PropTypes

const InsertarComentario = ({ publicacion_id, user }) => {
  // Desestructurar los props directamente
  const [contenido, setContenido] = useState("");
  const [showTextArea, setShowTextArea] = useState(false);
  const [descripcionLength, setDescripcionLength] = useState(0);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contenido") {
      setContenido(value);
      setDescripcionLength(value.length);
      setError("");
    }
  };

  const handleAddComment = () => {
    setShowTextArea(true);
  };

  const handleCancelComment = () => {
    setShowTextArea(false);
    setContenido("");
    setDescripcionLength(0);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3307/insertar-comentarios",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contenido,
            publicacion_id,
            usuario_id: user, // Pasar directamente user.id
          }),
        }
      );

      if (response.ok) {
        console.log("Comentario insertado correctamente");
        setShowTextArea(false);
        setContenido("");
        setDescripcionLength(0);
        setError("");
        window.location.reload();
      } else {
        console.error("Error al insertar el comentario");
        setError("Error al enviar el comentario");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setError("Error de red. Inténtalo de nuevo más tarde.");
    }
  };

  return (
    <div className="mt-8 lg:p-0 p-4 text-gray-800 dark:text-gray-800 dark:bg-rincon">
      {!showTextArea && (
        <button
          onClick={handleAddComment}
          className="border border-gray-300 w-full rounded-lg text-left text-sm text-gray-500 px-4 py-2  dark:hover:bg-rinconHover hover:bg-gray-200"
        >
          Añadir comentario...
        </button>
      )}

      {showTextArea && (
        <form onSubmit={handleSubmit}>
          <div className="relative flex flex-col">
            <textarea
              id="contenido"
              name="contenido"
              value={contenido}
              onChange={handleChange}
              className="p-2 bg-gray-100 rounded-md rounded-b-none text-sm flex-grow lg:min-h-[60px] lg:max-h-[60px] min-h-[110px] max-h-[110px] relative"
              required
              placeholder="Añadir comentario..."
              maxLength={150}
              style={{ overflowY: "hidden" }}
            />

            <div className="flex justify-between p-2   rounded-md rounded-t-none ">
              <div
                className={`text-sm mt-1 ${
                  descripcionLength >= 150
                    ? "text-red-500 font-semibold"
                    : "text-gray-400 font-semibold"
                }`}
              >
                {descripcionLength}/150
              </div>
              <div className="flex justify-end gap-2 font-semibold">
                <button
                  type="submit"
                  className="bg-rincon text-gray-100 px-2 py-1 text-sm rounded-md hover:bg-rinconHover"
                >
                  Comentar
                </button>
                <button
                  type="button"
                  onClick={handleCancelComment}
                  className="bg-red-500 text-rincon text-sm px-2 py-1 rounded-md hover:bg-red-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      )}
    </div>
  );
};

InsertarComentario.propTypes = {
  publicacion_id: PropTypes.string.isRequired,
  user: PropTypes.number, // Ajustar el tipo de dato a PropTypes.number
};

export default InsertarComentario;
