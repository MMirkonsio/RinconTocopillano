import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useAuth } from "../utils/auth";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.css";

function Post(props) {
  const [voteState, setVoteState] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0); // Estado local para los votos totales
  const { user } = useAuth();

  useEffect(() => {
    // Obtener datos del usuario y votos al cargar la página
    if (user) {
      axios
        .get(`http://localhost:3307/votos-totales-por-usuario`)
        .then((response) => {
          const userVotes = response.data; // Obtenemos todos los votos

          // Procesamiento adicional de los votos para calcular el total de votos positivos y negativos
          const totalVotesByTypeAndPost = userVotes.reduce((acc, voto) => {
            const key = `${voto.publicacion_id}_${voto.tipo}`;
            acc[key] = acc[key]
              ? acc[key] + voto.total_votos_usuario
              : voto.total_votos_usuario;
            return acc;
          }, {});
          const upvotes =
            totalVotesByTypeAndPost[`${props.publicacion_id}_upvote`] || 0;
          const downvotes =
            totalVotesByTypeAndPost[`${props.publicacion_id}_downvote`] || 0;

          // Calcular el total de votos teniendo en cuenta los votos positivos y negativos
          const totalVotes = upvotes - downvotes;

          setTotalVotes(totalVotes);

          // Buscar el voto del usuario autenticado (si existe)
          const userVote = userVotes.find(
            (v) =>
              v.publicacion_id === props.publicacion_id &&
              v.usuario_id === user.id
          );

          // Actualizar el estado voteState dependiendo del voto del usuario
          setVoteState(userVote ? userVote.tipo : null);
        })
        .catch((error) => {
          console.error("Error al obtener votos totales por usuario:", error);
        });
    } else {
      // Obtener el total de votos de la publicación sin autenticar al usuario
      axios
        .get(
          `http://localhost:3307/votos-totales-por-publicacion/${props.publicacion_id}`
        )
        .then((response) => {
          setTotalVotes(response.data.totalVotes);
        })
        .catch((error) => {
          console.error("Error al obtener la suma real de votos:", error);
        });
    }
  }, [user, props.publicacion_id]);

  const handleVote = (type) => {
    if (user) {
      axios
        .post(
          `http://localhost:3307/votos/${props.publicacion_id}/${user.id}/${type}`
        )
        .then(() => {
          // Actualizar el estado voteState dependiendo del tipo de voto
          if (type === "unvote") {
            // Si es un "unvote", establecer voteState en null
            setVoteState(null);
          } else {
            // Si es un "upvote" o "downvote", establecer voteState en el tipo correspondiente
            setVoteState(type);
          }

          // Recuperar la suma real de votos después de cada acción de voto
          axios
            .get(
              `http://localhost:3307/votos-totales-por-publicacion/${props.publicacion_id}`
            )
            .then((response) => {
              setTotalVotes(response.data.totalVotes);
            })
            .catch((error) => {
              console.error("Error al obtener la suma real de votos:", error);
            });
        })
        .catch((error) => {
          console.error(`Error al dar ${type}:`, error);
          console.log(error.response);
          if (error.response && error.response.status === 401) {
            showAuthenticationAlert();
          }
        });
    } else {
      showAuthenticationAlert();
    }
  };

  const showAuthenticationAlert = () => {
    Swal.fire({
      title: "¡Error!",
      text: "Debes iniciar sesión para votar.",
      icon: "info",
      confirmButtonText: "OK",
    });
  };

  return (
    <div className="flex flex-row items-center bg-gray-300 dark:bg-rincon2 rounded-full">
      <button
        onClick={() => handleVote(voteState === "upvote" ? "unvote" : "upvote")}
        className={`button flex items-center gap-1 bg-gray-300 dark:bg-rincon2 dark:hover:bg-rincon hover:bg-gray-400 p-2 rounded-full ${
          voteState === "upvote" && "text-green-500"
        }`}
      >
        <FaArrowUp />
      </button>
      <span className="votes">{totalVotes}</span>
      <button
        onClick={() =>
          handleVote(voteState === "downvote" ? "unvote" : "downvote")
        }
        className={`button flex items-center gap-1 bg-gray-300 dark:bg-rincon2 dark:hover:bg-rincon hover:bg-gray-400 p-2 rounded-full ${
          voteState === "downvote" && "text-purple-500"
        }`}
      >
        <FaArrowDown />
      </button>
    </div>
  );
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  publicacion_id: PropTypes.number.isRequired,
};

export default Post;
