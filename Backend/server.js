// backend/server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5173;

// Configura el middleware para el manejo de JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configura la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'Rincontocopillano',
  password: 'Eltocopillanoarrinconao12',
  database: 'rinconbd',
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos MySQL');
  }
});

db.on('error', (err) => {
  console.error('Error en la conexión a la base de datos:', err);
});



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
