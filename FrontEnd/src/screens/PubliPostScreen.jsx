import { useState } from "react";
import Navbar from "../components/Navbar";
import PubliComments from "../components/PubliComments";
import InsertarComentario from "../components/ComentariosPubli";
import ComentariosUsuarios from "../components/ComentariosUsuarios";
import { useParams } from "react-router-dom";
import { useAuth } from "../utils/auth";

const PubliPostScreen = () => {
  const { user } = useAuth();
  const { publicacion_id } = useParams();
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Estado para actualizar comentarios
  const [totalComentarios] = useState(0); // Estado para almacenar el número total de comentarios

  // Verificar si user es null antes de acceder a su propiedad id
  const userId = user?.id;

  const handleRefreshComments = () => {
    // Incrementar el valor de refreshTrigger para forzar la actualización de comentarios
    setRefreshTrigger((prevTrigger) => prevTrigger + 1);
  };

  return (
    <div className="container mx-auto max-w-[1200px] flex justify-center gap-4  noto-sans">
      <Navbar />
      <div className="flex-1 lg:mt-10 mt-28">
        <PubliComments
          publicacion_id={publicacion_id}
          user={userId} // Usar userId en lugar de user.id
          totalComentarios={totalComentarios}
        />

        <InsertarComentario
          publicacion_id={publicacion_id}
          user={userId} // Usar userId en lugar de user.id
          onCommentAdded={handleRefreshComments} // Pasar función para actualizar comentarios
        />

        <ComentariosUsuarios
          publicacion_id={publicacion_id}
          refreshTrigger={refreshTrigger} // Pasar refreshTrigger
        />
      </div>
    </div>
  );
};

export default PubliPostScreen;
