import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App.jsx'
import { AuthProvider, verificarSesion } from './auth/AuthContext'
import './index.css'

// Enviar siempre la cookie de sesión al backend
axios.defaults.withCredentials = true;

// Si el backend dice que la sesión expiró, limpiar la copia local y pedir login
axios.interceptors.response.use(undefined, (error) => {
  // /auth/me se usa al cargar y /auth/login responde 401 con credenciales malas: ahí no se redirige
  const url = error.config?.url ?? '';
  const ignorar = url.endsWith('/auth/me') || url.endsWith('/auth/login');
  if (error.response?.status === 401 && localStorage.getItem('user') && !ignorar) {
    localStorage.removeItem('user');
    window.location.assign('/iniciar-sesion');
  }
  return Promise.reject(error);
});

verificarSesion().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <App />
    </AuthProvider>
  )
});
