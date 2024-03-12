const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const session = require('express-session');
const app = express();
const port = 3307;



// Configura el middleware de sesión
app.use(session({
  secret: 'rinconTocopillanocomercio2024',
  resave: false,
  saveUninitialized: true,
}));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Utilizar file.originalname para guardar solo el nombre original
  },
});


const upload = multer({ storage: storage });

// Configuración de Express para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'Rincon2',
  password: 'rincon2',
  database: 'rinconbd2',
  multipleStatements: true,
});

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:5173', // Este debe ser el origen de tu aplicación React
  credentials: true, // Permite el envío de cookies
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Configuración de Express para analizar datos JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));






// Ruta para manejar cualquier otra solicitud (enviar el HTML del frontend)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });



  app.post('/login', async (req, res) => {
    const { correo, password } = req.body;
  
    // Realizar la verificación de las credenciales en la base de datos
    const user = await getUserByEmail(correo);
  
    if (user.length > 0) {
      const storedPassword = user[0].password;
  
      // Verificar la contraseña utilizando bcrypt
      const contrasenaValida = await bcrypt.compare(password, storedPassword);
  
      if (contrasenaValida) {
        // No envíes la contraseña en la respuesta, solo información necesaria
        const usuarioAutenticado = {
          usuario_id: user[0].id,
          correo: user[0].correo,
          nombre_usuario: user[0].nombre_usuario,
        };
  
        // Almacena la información del usuario en la sesión
        req.session.usuario = usuarioAutenticado;
  
        // Agregar mensaje a la consola
        console.log(`Usuario ${user[0].correo} ha iniciado sesión con éxito.`);
  
        return res.json(usuarioAutenticado);
      }
    }
  
    // Si las credenciales no son válidas o el usuario no existe, devolver un error
    res.status(401).json({ error: 'Credenciales inválidas' });
  });
  
  
  // Función para obtener un usuario por correo
  const getUserByEmail = (correo) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  };

  // En el servidor
app.get('/estado-sesion', (req, res) => {
  res.json({ estado: req.session.usuario ? 'Autenticado' : 'No autenticado' });
});


  app.get('/perfil', (req, res) => {
    // Verificar si hay un usuario autenticado en la sesión
    console.log(req.session);
    if (!req.session.usuario) {
      return res.status(401).json({ error: 'No hay usuario autenticado' });
    }
  
    // Obtener el perfil del usuario autenticado
    const usuarioAutenticado = req.session.usuario;
    connection.query('SELECT * FROM usuarios WHERE id = ?', [usuarioAutenticado.usuario_id], (error, results) => {
      if (error) {
        console.error('Error en la consulta:', error);
        res.status(500).json({ error: error.message });
        return;
      }
      res.json(results[0]); // Supongo que esperas un solo resultado
    });
  });
  

  
app.post("/registro", upload.single("foto_perfil"), async (req, res) => {
  try {
    const {
      nombre_usuario,
      correo,
      telefono,
      password,
    } = req.body;

    // Verificar si el nombre de usuario ya existe
    const nombreUsuarioExists = await checkIfFieldExists('nombre_usuario', nombre_usuario);
    if (nombreUsuarioExists) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }
  
    // Verificar si el correo ya existe
    const correoExists = await checkIfFieldExists('correo', correo);
    if (correoExists) {
      return res.status(400).json({ error: 'El correo ya está en uso' });
    }
  
    // Verificar si el teléfono ya existe
    const telefonoExists = await checkIfFieldExists('telefono', telefono);
    if (telefonoExists) {
      return res.status(400).json({ error: 'El teléfono ya está en uso' });
    }

    // Obtener la foto de perfil del objeto de archivo (si existe)
    const foto_perfil = req.file ? path.basename(req.file.path) : "default.webp";


    console.log('Datos recibidos en el servidor:', req.body);

    // Verificar que la contraseña sea una cadena de caracteres
    if (!password || typeof password !== 'string') {
      console.error('La contraseña no es una cadena de caracteres válida');
      return res.status(400).json({ error: 'Contraseña no válida' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Contraseña recibida:', password);
    console.log('Contraseña encriptada:', hashedPassword);

    const sqlQuery = "INSERT INTO usuarios (nombre_usuario, correo, telefono, password, foto_perfil) VALUES (?, ?, ?, ?, ?)";

    connection.query(
      sqlQuery,
      [nombre_usuario, correo, telefono, hashedPassword, foto_perfil],
      (error, results) => {
        if (error) {
          console.error("Error al insertar usuario:", error);
          return res.status(500).json({
            error: "Error interno del servidor al insertar usuario",
            details: error.message,
          });
        }
        res.json({ message: "Usuario registrado exitosamente" });
      }
    );
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
});

// Función para verificar si un campo ya existe en la base de datos
async function checkIfFieldExists(fieldName, value) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `SELECT COUNT(*) as count FROM usuarios WHERE ${fieldName} = ?`;
    connection.query(sqlQuery, [value], (error, results) => {
      if (error) {
        reject(error);
      } else {
        const count = results[0].count;
        resolve(count > 0);
      }
    });
  });
}
  



// Ruta para guardar el perfil
app.post('/guardar-perfil', (req, res) => {
  const nuevoPerfil = req.body; // Datos del perfil a guardar
  // Lógica para guardar el perfil en la base de datos (usando tu conexión MySQL)

  const sqlUpdate = 'UPDATE usuarios SET ? WHERE Id = ?';
  const formattedQuery = mysql.format(sqlUpdate, [nuevoPerfil, nuevoPerfil.Id]);

  connection.query(formattedQuery, (error, results) => {
    if (error) {
      console.error('Error al actualizar el perfil:', error);
      res.status(500).json({ error: 'Error al actualizar el perfil.' });
      return;
    }

    res.json({ message: 'Perfil actualizado correctamente.' });
  });
});

// Ruta para obtener datos del perfil
app.get('/publicaciones', (req, res) => {
  const sqlQuery = 'SELECT * FROM publicaciones INNER JOIN usuarios ON publicaciones.usuario_id = usuarios.Id';
  connection.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Error en la consulta:', error);
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(results);
    
  });
});

app.get('/votos-totales-por-usuario', async (req, res) => {
  try {
    const sqlQuery = `
      SELECT usuario_id, tipo, COUNT(*) as total_votos_usuario
      FROM votos
      WHERE tipo IN ('upvote', 'downvote')
      GROUP BY usuario_id, tipo`;

    connection.query(sqlQuery, (error, results) => {
      if (error) {
        console.error('Error en la consulta:', error);
        res.status(500).json({ error: error.message });
        return;
      }

      // Actualizar los resultados en base a la lógica de votos
      results.forEach(voto => {
        // Restar votos 'unvote' si existen
        const unvoteCount = results.filter(uv => uv.usuario_id === voto.usuario_id && uv.tipo === 'unvote').length;
        voto.total_votos_usuario -= unvoteCount;
      });

      res.json(results);
    });
  } catch (error) {
    console.error('Error en la consulta:', error);
    res.status(500).json({ error: error.message });
  }
});





app.get('/populares', (req, res) => {
  // Consulta SQL para obtener las publicaciones ordenadas por la suma de likes y dislikes de forma descendente y limitar a las primeras 10
  const sqlQuery = `
    SELECT p.*, 
           COALESCE(SUM(CASE WHEN v.tipo = 'upvote' THEN 1 WHEN v.tipo = 'downvote' THEN -1 ELSE 0 END), 0) as likes
    FROM publicaciones p
    LEFT JOIN votos v ON p.publicacion_id = v.publicacion_id
    GROUP BY p.publicacion_id
    ORDER BY likes DESC
    LIMIT 10`;

  connection.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Error en la consulta:', error);
      res.status(500).json({ error: error.message });
      return;
    }

    // Actualizar los resultados en base a la lógica de votos
    results.forEach(publicacion => {
      // Restar votos 'unvote' si existen
      const unvoteCount = results.filter(v => v.publicacion_id === publicacion.publicacion_id && v.tipo === 'unvote').length;
      publicacion.likes -= unvoteCount;
    });

    res.json(results);
  });
});





// Ruta para manejar los votos
app.post('/votos/:publicacion_id/:usuario_id/:tipo', async (req, res) => {
  const publicacion_id = req.params.publicacion_id;
  const usuario_id = req.params.usuario_id;
  const tipo = req.params.tipo;

  console.log('Publicación ID:', publicacion_id);
  console.log('Usuario ID:', usuario_id);
  console.log('Tipo de voto:', tipo);
  console.log('Valores a insertar:', publicacion_id, usuario_id, tipo);

  // Iniciar la transacción
  connection.beginTransaction(async (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    try {
      // Consulta SQL para verificar si el usuario ya ha votado en la publicación
      const sqlCheckVote = 'SELECT tipo FROM votos WHERE publicacion_id = ? AND usuario_id = ?';
      const checkVoteValues = [publicacion_id, usuario_id];

      // Ejecutar la consulta SQL para obtener el tipo de voto actual
      const resultCheckVote = await executeQuery(connection, sqlCheckVote, checkVoteValues);

      // Si el usuario ya ha votado, actualizar el tipo de voto existente
      if (resultCheckVote.length > 0) {
        const existingTipo = resultCheckVote[0].tipo;

        // Si el tipo de voto existente es diferente, actualizarlo
        if (existingTipo !== tipo) {
          const sqlUpdateVote = 'UPDATE votos SET tipo = ? WHERE publicacion_id = ? AND usuario_id = ?';
          const updateVoteValues = [tipo, publicacion_id, usuario_id];

          // Ejecutar la consulta SQL para actualizar el tipo de voto
          await executeQuery(connection, sqlUpdateVote, updateVoteValues);
        }
      } else {
        // Si el usuario no ha votado, insertar un nuevo registro
        const sqlInsert = 'INSERT INTO votos (publicacion_id, usuario_id, tipo) VALUES (?, ?, ?)';
        const insertValues = [publicacion_id, usuario_id, tipo];

        // Ejecutar la consulta SQL para insertar un nuevo registro
        await executeQuery(connection, sqlInsert, insertValues);
      }

      // Consulta SQL para obtener la diferencia entre likes y dislikes de la publicación
      const sqlSelect = 'SELECT (likes - dislikes) AS votos FROM publicaciones WHERE publicacion_id = ?';
      const selectValues = [publicacion_id];

      // Ejecutar la consulta SQL para obtener la diferencia entre likes y dislikes
      const result = await executeQuery(connection, sqlSelect, selectValues);

      if (result.length === 0) {
        // Rollback y responder con un mensaje de error si la publicación no se encuentra
        connection.rollback(() => {
          return res.status(404).send('Publicación no encontrada');
        });
      }

      const totalVotes = result[0].votos;

      // Commit si todo ha sido exitoso
      connection.commit((err) => {
        if (err) {
          return res.status(500).send(err.message);
        }
        return res.status(200).send(`Resultado final: ${totalVotes}`);
      });
    } catch (error) {
      // Rollback en caso de error
      connection.rollback(() => {
        console.error('Error en la transacción:', error);
        return res.status(500).send('Error en la transacción');
      });
    }
  });
});




// Ruta para obtener información del voto del usuario en una publicación
app.get('/votos/:publicacion_id/:usuario_id', async (req, res) => {
  try {
    const publicacion_id = req.params.publicacion_id;
    const usuario_id = req.params.usuario_id;

    

    // Consulta SQL para obtener el tipo de voto del usuario en la publicación
    const sqlSelectVoto = 'SELECT tipo FROM votos WHERE publicacion_id = ? AND usuario_id = ?';
    const selectVotoValues = [publicacion_id, usuario_id];

    // Ejecutar la consulta SQL para obtener el tipo de voto
    const resultVoto = await executeQuery(connection, sqlSelectVoto, selectVotoValues);

    // Si el usuario no ha votado, puedes devolver un valor predeterminado o manejarlo según tus necesidades
    if (resultVoto.length === 0) {
      return res.status(200).json({ tipo: null });
    }

    // Devolver el tipo de voto del usuario en la publicación
    const tipoVoto = resultVoto[0].tipo;
    return res.status(200).json({ tipo: tipoVoto });
  } catch (error) {
    console.error('Error al obtener el voto del usuario:', error);
    return res.status(500).send('Error al obtener el voto del usuario');
  }
});


// Función para ejecutar una consulta en la base de datos
const executeQuery = (connection, sql, values) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};






app.listen(port, () => console.log(`Servidor backend escuchando en el puerto ${port}`));
