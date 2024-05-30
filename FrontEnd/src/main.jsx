import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Ajusta la ruta según tu estructura de archivos
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/inter';  
import "./index.css";
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
