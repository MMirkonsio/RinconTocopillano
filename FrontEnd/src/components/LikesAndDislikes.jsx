import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useAuth } from "../utils/auth";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/dist/sweetalert2.css';

function Post(props) {
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const { user } = useAuth();

  

  const handleVote = (type) => {
    if (user) {
      const voteType = upvoted ? 'upvote' : downvoted ? 'downvote' : 'unvote';
      if (type === voteType) {
        console.log('Ya has votado en esta publicación');
        return;
      }
      axios
        .post(`http://localhost:3307/votos/${props.publicacion_id}/${user.id}/${type}`)
        .then((response) => {
          console.log(response.data);
          // Puedes actualizar el estado local o realizar otras acciones según sea necesario
          console.log(`Votos actualizados para la publicación ${props.publicacion_id}: ${props.post.total_votos_usuario}`);
        })
        .catch((error) => {
          console.error(`Error al dar ${type}:`, error);
          console.log(error.response);
          // Muestra la alerta si el usuario no está autenticado
          if (error.response && error.response.status === 401) {
            showAuthenticationAlert();
          }
        });
      // Actualizar el estado local basado en el tipo de voto
      if (type === 'upvote') {
        setUpvoted(true);
        setDownvoted(false);
      } else if (type === 'downvote') {
        setUpvoted(false);
        setDownvoted(true);
      } else if (type === 'unvote') {
        setUpvoted(false);
        setDownvoted(false);
      }
    } else {
      // Actualizar el estado local para quitar el voto si el usuario no está autenticado
      setUpvoted(false);
      setDownvoted(false);
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


  useEffect(() => {
  // Verificar si el usuario ha votado en esta publicación al cargar la página
  if (user) {
    axios
      .get(`http://localhost:3307/votos-totales-por-usuario`)
      .then((response) => {
        const userVotesData = response.data;
        console.log('Votos totales por usuario:', userVotesData);

        // Elimina esta línea si no necesitas almacenar 'userVotes' en el estado
        // setUserVotes(userVotesData);

        const voto = userVotesData.find((v) => v.usuario_id === user.id);

        if (voto) {
          console.log('Voto del usuario:', voto);

          if (voto.tipo === 'upvote') {
            setUpvoted(true);
            setDownvoted(false);
          } else if (voto.tipo === 'downvote') {
            setUpvoted(false);
            setDownvoted(true);
          } else if (voto.tipo === 'unvote') {
            setUpvoted(false);
            setDownvoted(false);
          }
        }
      })
      .catch((error) => {
        console.error('Error al obtener votos totales por usuario:', error);
      });
  }
}, [props.publicacion_id, user]);

  return (
    <div className="flex flex-row items-center bg-gray-300 dark:bg-rincon2 rounded-full">
      <button
        onClick={() => {
          setUpvoted(!upvoted);
          setDownvoted(false);
          handleVote(upvoted ? 'unvote' : 'upvote');
        }}
        className={`button flex items-center gap-1 bg-gray-300 dark:bg-rincon2 dark:hover:bg-rincon hover:bg-gray-400 p-2 rounded-full ${upvoted && 'text-green-500'}`}
      >
        <FaArrowUp />
      </button>
      <span className="votes">
        {upvoted ? props.post.votes + 1 : downvoted ? props.post.votes - 1 : props.post.votes}
      </span>
      <button
        onClick={() => {
          setDownvoted(!downvoted);
          setUpvoted(false);
          handleVote(downvoted ? 'unvote' : 'downvote');
        }}
        className={`button flex items-center gap-1 bg-gray-300 dark:bg-rincon2 dark:hover:bg-rincon hover:bg-gray-400 p-2 rounded-full ${downvoted && 'text-purple-500'}`}
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
