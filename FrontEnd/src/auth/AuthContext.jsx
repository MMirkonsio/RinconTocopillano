/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import axios from "axios";
import { API } from "../config";

// La sesión real vive en una cookie httpOnly del backend. Aquí (y en localStorage)
// solo guardamos una copia de los datos públicos del usuario para pintar la interfaz.

const AuthContext = createContext(null);

const leerUsuario = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.id && user?.nombre_usuario ? user : null;
  } catch {
    return null;
  }
};

const guardarUsuario = (user) => {
  if (user) localStorage.setItem("user", JSON.stringify(user));
  else localStorage.removeItem("user");
};

// Comprueba con el backend que la sesión sigue activa y sincroniza la copia local
export const verificarSesion = async () => {
  try {
    const { data } = await axios.get(`${API}/auth/me`);
    guardarUsuario({ id: data.usuario_id, correo: data.correo, nombre_usuario: data.nombre_usuario });
  } catch (error) {
    if (error.response?.status === 401) guardarUsuario(null);
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(leerUsuario);

  const iniciarSesion = useCallback(async (correo, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { correo, password });
    const nuevo = { id: data.usuario_id, correo: data.correo, nombre_usuario: data.nombre_usuario };
    guardarUsuario(nuevo);
    setUser(nuevo);
    return nuevo;
  }, []);

  const cerrarSesion = useCallback(async () => {
    guardarUsuario(null);
    setUser(null);
    try {
      await axios.post(`${API}/auth/logout`);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }, []);

  // Tras editar el perfil (nombre, correo o foto)
  const actualizarUsuario = useCallback((cambios) => {
    setUser((actual) => {
      const nuevo = { ...actual, ...cambios };
      guardarUsuario(nuevo);
      return nuevo;
    });
  }, []);

  // La foto de perfil se usa en la cabecera: se trae una vez por sesión
  const id = user?.id;
  const tieneFoto = Boolean(user?.foto_perfil);
  useEffect(() => {
    if (!id || tieneFoto) return;
    axios
      .get(`${API}/perfil`)
      .then(({ data }) => actualizarUsuario({ foto_perfil: data.foto_perfil }))
      .catch(() => {});
  }, [id, tieneFoto, actualizarUsuario]);

  return (
    <AuthContext.Provider value={{ user, iniciarSesion, cerrarSesion, actualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
