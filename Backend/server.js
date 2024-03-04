const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5173;

// Servir archivos estáticos desde la carpeta "dist"
app.use(express.static(path.join(__dirname, 'dist')));

// Configuración de rutas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Arranca el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
