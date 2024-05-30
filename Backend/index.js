const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://nnbbsaidwgehcewuocrb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uYmJzYWlkd2dlaGNld3VvY3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE2MzY1MjgsImV4cCI6MjAyNzIxMjUyOH0.C6No6vqndRHL5MJu9bVILYQrUqqwhHAFnPUc3bjCvrc",
);

const app = express();
const port = process.env.PORT || 3000;




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Utilizar file.originalname para guardar solo el nombre original
  },
});

const upload = multer({ storage: storage });

// Configuración de Express para servir archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configuración de CORS
const corsOptions = {
  origin: "http://localhost:5173", // Este debe ser el origen de tu aplicación React
  credentials: true, // Permite el envío de cookies
};
app.use(cors(corsOptions));






  // POST endpoint para el inicio de sesión
  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Obtener el usuario por su email
      const { data: user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error || !user) {
        // Si hay un error al autenticar, devolver un mensaje de error
        return res.status(401).json({ error: "Credenciales inválidas" });
      }
  
  
      return res.json(userData);
    } catch (error) {
      // Si hay un error, devolver un mensaje de error
      console.error("Error al iniciar sesión:", error.message);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  app.get("/perfil/:user_id", async (req, res) => {
    const user_id = req.params.user_id;
  
    try {
      // Obtener el perfil del usuario especificado por user_id
      const { data, error } = await supabase
        .from('usuarios')
        .select('nombre_usuario, foto_perfil')
        .eq('id', user_id)
        .single();
  
      if (error) {
        console.error("Error en la consulta:", error);
        return res.status(500).json({ error: error.message });
      }
  
      if (!data) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      // Enviar el perfil del usuario como respuesta
      res.json(data);
    } catch (error) {
      console.error("Error en la consulta:", error.message);
      res.status(500).json({ error: error.message });
    }
  });
  

{/* 

app.post("/login", async (req, res) => {
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

      return res.json(usuarioAutenticado);
    }
  }

  // Si las credenciales no son válidas o el usuario no existe, devolver un error
  res.status(401).json({ error: "Credenciales inválidas" });
});

// Función para obtener un usuario por correo
const getUserByEmail = (correo) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM usuarios WHERE correo = ?",
      [correo],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
};


app.get("/perfil/:usuario_id", (req, res) => {
  const usuario_id = req.params.usuario_id;

  // Obtener el perfil del usuario especificado por usuario_id
  connection.query(
    "SELECT * FROM usuarios WHERE id = ?",
    [usuario_id],
    (error, results) => {
      if (error) {
        console.error("Error en la consulta:", error);
        res.status(500).json({ error: error.message });
        return;
      }

      // Verificar si se encontró un usuario con el usuario_id especificado
      if (results.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Si se encontró el usuario, enviar su perfil como respuesta
      res.json(results[0]); // Supongo que esperas un solo resultado
    }
  );
});

app.post("/registro", upload.single("foto_perfil"), async (req, res) => {
  try {
    const { nombre_usuario, correo, telefono, password } = req.body;

    // Verificar si el nombre de usuario ya existe
    const nombreUsuarioExists = await checkIfFieldExists(
      "nombre_usuario",
      nombre_usuario
    );
    if (nombreUsuarioExists) {
      return res
        .status(400)
        .json({ error: "El nombre de usuario ya está en uso" });
    }

    // Verificar si el correo ya existe
    const correoExists = await checkIfFieldExists("correo", correo);
    if (correoExists) {
      return res.status(400).json({ error: "El correo ya está en uso" });
    }

    // Verificar si el teléfono ya existe
    const telefonoExists = await checkIfFieldExists("telefono", telefono);
    if (telefonoExists) {
      return res.status(400).json({ error: "El teléfono ya está en uso" });
    }

    // Obtener la foto de perfil del objeto de archivo (si existe)
    const foto_perfil = req.file
      ? path.basename(req.file.path)
      : "default.webp";


    // Verificar que la contraseña sea una cadena de caracteres
    if (!password || typeof password !== "string") {
      console.error("La contraseña no es una cadena de caracteres válida");
      return res.status(400).json({ error: "Contraseña no válida" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sqlQuery =
      "INSERT INTO usuarios (nombre_usuario, correo, telefono, password, foto_perfil) VALUES (?, ?, ?, ?, ?)";

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
    res
      .status(500)
      .json({ error: "Error interno del servidor", details: error.message });
  }
});

// Función para verificar si un campo específico ya existe en la base de datos
const checkIfFieldExists = async (fieldName, value) => {
  try {
    const [rows, fields] = await connection.promise().query(`SELECT COUNT(*) AS count FROM usuarios WHERE ${fieldName} = ?`, [value]);
    return rows[0].count > 0;
  } catch (error) {
    console.error("Error al verificar si el campo existe:", error);
    throw error; // Reenviar el error para que sea manejado por el código que llama a esta función
  }
};


app.post("/publicar", upload.single("imagen_contenido"), async (req, res) => {
  try {
    const {
      titulo,
      contenido,
      precio,
      categoria_id,
      usuario_id,
    } = req.body;
    const nombre_categoria = req.body.nombre_categoria; // Obtener el nombre de la categoría del cuerpo de la solicitud
    const imagenContenido = req.file ? req.file.filename : null; // Obtén el nombre del archivo si existe, de lo contrario, establece como null

    // Verificar si la categoría ya existe en la tabla de categorías
    const [existingCategory] = await connection
      .promise()
      .query("SELECT * FROM categorias WHERE categoria_id = ?", [categoria_id]);

    if (!existingCategory.length) {
      // Si la categoría no existe, la insertamos en la tabla de categorías
      const [result] = await connection
        .promise()
        .query(
          "INSERT INTO categorias (categoria_id, nombre_categoria) VALUES (?, ?)",
          [categoria_id, nombre_categoria]
        );
    }

    // Insertar la publicación en la tabla de publicaciones (sin nombre_categoria)
    const sql_publicacion = `INSERT INTO publicaciones (usuario_id, categoria_id, titulo, contenido, precio, tiempo_publicacion, imagen_contenido) 
                         VALUES (?, ?, ?, ?, ?, NOW(), ?)`;
    const values = [
      usuario_id,
      categoria_id,
      titulo,
      contenido,
      precio,
      imagenContenido,
    ];

    await connection.promise().query(sql_publicacion, values);

    res.status(200).send("Publicación exitosa");
  } catch (error) {
    console.error("Error al insertar publicación:", error);
    res.status(500).send("Error al procesar la publicación");
  }
});


// Ruta para guardar el perfil
app.post("/guardar-perfil", (req, res) => {
  const nuevoPerfil = req.body; // Datos del perfil a guardar
  // Lógica para guardar el perfil en la base de datos (usando tu conexión MySQL)

  const sqlUpdate = "UPDATE usuarios SET ? WHERE Id = ?";
  const formattedQuery = mysql.format(sqlUpdate, [nuevoPerfil, nuevoPerfil.Id]);

  connection.query(formattedQuery, (error, results) => {
    if (error) {
      console.error("Error al actualizar el perfil:", error);
      res.status(500).json({ error: "Error al actualizar el perfil." });
      return;
    }

    res.json({ message: "Perfil actualizado correctamente." });
  });
});

app.get("/publicaciones", (req, res) => {
  const sqlQuery =
    "SELECT * FROM publicaciones INNER JOIN usuarios ON publicaciones.usuario_id = usuarios.Id ORDER BY tiempo_publicacion DESC";
  connection.query(sqlQuery, (error, results) => {
    if (error) {
      console.error("Error en la consulta:", error);
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(results);
  });
});
app.get("/publicacion/:publicacion_id/comments", (req, res) => {
  let publicacionId = req.params.publicacion_id;

  const sqlQuery = `
    SELECT p.*, u.* 
    FROM publicaciones p 
    JOIN usuarios u ON p.usuario_id = u.id 
    WHERE p.publicacion_id = ?
  `;

  connection.query(sqlQuery, [publicacionId], (error, results) => {
    if (error) {
      console.error("Error en la consulta:", error);
      res.status(500).json({ error: error.message });
      return;
    }
    if (results.length === 0) {
      // Si no se encuentra ninguna publicación con el publicacion_id especificado
      res.status(404).json({ error: "Publicación no encontrada" });
      return;
    }
    res.json(results[0]);
  });
});
app.post("/insertar-comentarios", async (req, res) => {
  try {
    const { publicacion_id, usuario_id, contenido } = req.body;

    if (!contenido) {
      return res.status(400).json({ error: "El contenido del comentario es requerido" });
    }

    // Suponiendo que tienes los valores de publicacion_id, usuario_id y tiempo_comentario disponibles en req.body
    // Si no están disponibles, deberás proporcionar valores por defecto o manejar estos casos según sea necesario

    const sqlQuery = "INSERT INTO comentarios (publicacion_id, usuario_id, contenido, tiempo_comentario) VALUES (?, ?, ?, NOW())";

    connection.query(sqlQuery, [publicacion_id, usuario_id, contenido], (error, results) => {
      if (error) {
        console.error("Error al insertar el comentario:", error);
        return res.status(500).json({ error: "Error interno del servidor al insertar el comentario" });
      }
      res.status(200).json({ message: "Comentario insertado correctamente", comentario_id: results.insertId });
    });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor al procesar la solicitud" });
  }
});

// Ruta POST para insertar una respuesta a un comentario
app.post("/comentarios/:comentario_id/respuestas", async (req, res) => {
  try {
    const comentario_id = req.params.comentario_id;
    const { usuario_id, contenido, usuario_reply_id } = req.body;

    if (!contenido) {
      return res.status(400).json({ error: "El contenido de la respuesta es requerido" });
    }

    // Insertar la respuesta con el usuario_reply_id proporcionado
    const sqlInsertQuery = "INSERT INTO comentarios (publicacion_id, usuario_id, usuario_reply_id, contenido, tiempo_comentario) VALUES (?, ?, ?, ?, NOW())";
    connection.query(sqlInsertQuery, [comentario_id, usuario_id, usuario_reply_id, contenido], (error, results) => {
      if (error) {
        console.error("Error al insertar la respuesta:", error);
        return res.status(500).json({ error: "Error interno del servidor al insertar la respuesta" });
      }

      // Enviar la respuesta insertada y las respuestas actualizadas
      const sqlSelectQuery = "SELECT c.comentario_id, c.publicacion_id, c.usuario_id, c.contenido, c.tiempo_comentario, c.usuario_reply_id, u.nombre_usuario, u.foto_perfil FROM comentarios c JOIN usuarios u ON c.usuario_id = u.id WHERE c.comentario_id = ?"; // Cambiar c.publicacion_id por c.comentario_id para obtener solo la respuesta insertada
      connection.query(sqlSelectQuery, [results.insertId], (error, respuestas) => {
        if (error) {
          console.error("Error al obtener la respuesta:", error);
          return res.status(500).json({ error: "Error interno del servidor al obtener la respuesta" });
        }
        res.status(200).json({ message: "Respuesta insertada correctamente", comentario_id: results.insertId, respuesta: respuestas[0] });
      });
    });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor al procesar la solicitud" });
  }
});




app.get("/comentarios/:comentario_id/respuestas", async (req, res) => {
  try {
    const comentario_id = req.params.comentario_id;
    const sqlSelectQuery = `
      SELECT 
        c.comentario_id, 
        c.publicacion_id, 
        c.usuario_id, 
        c.contenido, 
        c.tiempo_comentario, 
        c.usuario_reply_id, 
        u1.nombre_usuario AS nombre_usuario,
        u1.id AS usuario_id,
        u1.foto_perfil AS foto_perfil,
        u2.nombre_usuario AS nombre_usuario_reply,
        u2.foto_perfil AS foto_perfil_reply
      FROM comentarios c 
      JOIN usuarios u1 ON c.usuario_id = u1.id 
      LEFT JOIN usuarios u2 ON c.usuario_reply_id = u2.id 
      WHERE c.usuario_reply_id = ? 
      ORDER BY c.comentario_id ASC
    `;

    connection.query(sqlSelectQuery, [comentario_id], (error, respuestas) => {
      if (error) {
        console.error("Error al obtener las respuestas:", error);
        return res.status(500).json({ error: "Error interno del servidor al obtener las respuestas" });
      }
      res.status(200).json({ respuestas });
    });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor al procesar la solicitud" });
  }
});








app.get("/comentarios/:publicacion_id", async (req, res) => {
  try {
    const { publicacion_id } = req.params;

    // Consulta para obtener los comentarios
    const sqlQuery = `
  SELECT comentarios.*, usuarios.nombre_usuario, usuarios.foto_perfil
  FROM comentarios
  INNER JOIN usuarios ON comentarios.usuario_id = usuarios.id
  WHERE comentarios.publicacion_id = ?
  ORDER BY comentarios.tiempo_comentario DESC
`;


    // Consulta para contar los comentarios
    const countQuery = `
      SELECT COUNT(*) AS totalComentarios
      FROM comentarios
      WHERE publicacion_id = ?
    `;
    
    // Realizar ambas consultas en paralelo
    const [commentsResult, countResult] = await Promise.all([
      new Promise((resolve, reject) => {
        connection.query(sqlQuery, [publicacion_id], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      }),
      new Promise((resolve, reject) => {
        connection.query(countQuery, [publicacion_id], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      })
    ]);

    // Extraer el conteo de comentarios
    const totalComentarios = countResult[0].totalComentarios;

    res.status(200).json({ comentarios: commentsResult, totalComentarios });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor al procesar la solicitud" });
  }
});
app.delete("/comentarios/:comentario_id", async (req, res) => {
  try {
    const { comentario_id } = req.params;

    const deleteQuery = `
    DELETE FROM comentarios
    WHERE comentario_id = ?
  `;


    const selectUsuarioQuery = `
    SELECT u.nombre_usuario
    FROM comentarios c
    JOIN usuarios u ON c.usuario_reply_id = u.id
    WHERE c.comentario_id = ?
    
    `;

    // Obtener el nombre de usuario asociado al usuario_reply_id
    connection.query(selectUsuarioQuery, [comentario_id], (error, results) => {
      if (error) {
        console.error("Error al obtener el nombre de usuario:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener el nombre de usuario" });
        return;
      }

      console.log("Nombre de usuario:", results[0].nombre_usuario);
    });

    // Ejecutar la consulta para eliminar el comentario y sus respuestas
    connection.query(deleteQuery, [comentario_id, comentario_id], (error, results) => {
      if (error) {
        console.error("Error al eliminar el comentario y sus respuestas:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar el comentario y sus respuestas" });
        return;
      }

      res.status(200).json({ message: "Comentario y sus respuestas eliminados exitosamente" });
    });
  } catch (error) {
    console.error("Error al eliminar el comentario y sus respuestas:", error);
    res.status(500).json({ error: "Error interno del servidor al eliminar el comentario y sus respuestas" });
  }
});




app.get("/buscar-publicaciones", (req, res) => {
  const searchTerm = req.query.search;

  // Consulta SQL preparada para buscar publicaciones por título o contenido
  const sqlQuery = `
  SELECT publicaciones.*, usuarios.*
  FROM publicaciones
  INNER JOIN usuarios ON publicaciones.usuario_id = usuarios.id
  WHERE publicaciones.titulo LIKE ? OR publicaciones.contenido LIKE ?
  ORDER BY publicaciones.tiempo_publicacion DESC`;


  const searchTermWildcard = `%${searchTerm}%`;

  connection.query(sqlQuery, [searchTermWildcard, searchTermWildcard], (error, results) => {
    if (error) {
      console.error("Error en la consulta:", error);
      res.status(500).json({ error: "Error al buscar publicaciones" });
      return;
    }
    res.json(results);
  });
});



app.get("/publicaciones/:usuario_id", (req, res) => {
  const usuario_id = req.params.usuario_id; // Obtener el ID del usuario de los parámetros de la URL
  const sqlQuery = "SELECT * FROM publicaciones WHERE usuario_id = ?"; // Filtrar por usuario_id
  connection.query(sqlQuery, [usuario_id], (error, results) => {
    if (error) {
      console.error("Error en la consulta:", error);
      // Enviar un mensaje personalizado en lugar de un estado de error
      res
        .status(200)
        .json({
          message: "Error al obtener las publicaciones del usuario",
          error: true,
        });
      return;
    }
    // Si no hay error, enviar las publicaciones como lo haces normalmente
    res.json(results);
  });
});

// Ruta para eliminar una publicación
app.delete('/publicaciones/:id', (req, res) => {
  const { id } = req.params;
  const { usuario_id } = req.body; // Suponiendo que el ID del usuario está en el cuerpo de la solicitud

  // Verificar si el usuario es el propietario de la publicación
  connection.query('SELECT usuario_id FROM publicaciones WHERE publicacion_id = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error al buscar la publicación' });
    } else {
      if (result.length === 0) {
        res.status(404).json({ message: 'Publicación no encontrada' });
      } else {
        if (result[0].usuario_id !== usuario_id) {
          res.status(403).json({ message: 'No tienes permiso para eliminar esta publicación' });
        } else {
          // Eliminar la publicación
          connection.query('DELETE FROM publicaciones WHERE publicacion_id = ?', [id], (err, result) => {
            if (err) {
              res.status(500).json({ message: 'Error al eliminar la publicación' });
            } else {
              res.status(200).json({ message: 'Publicación eliminada correctamente' });
            }
          });
        }
      }
    }
  });
});

app.get("/votos-totales-por-usuario/", async (req, res) => {
  try {
    const sqlQuery = `
      SELECT usuario_id, tipo, publicacion_id, COUNT(*) as total_votos_usuario
      FROM votos
      WHERE tipo IN ('upvote', 'downvote')
      GROUP BY usuario_id, publicacion_id, tipo`; // Agregar 'publicacion_id' a la agrupación

    connection.query(sqlQuery, (error, results) => {
      if (error) {
        console.error("Error en la consulta:", error);
        res.status(500).json({ error: error.message });
        return;
      }

      res.json(results);
    });
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/votos-totales-por-publicacion/:publicacion_id", async (req, res) => {
  try {
    const { publicacion_id } = req.params;

    const sqlQuery = `
      SELECT publicacion_id, SUM(CASE WHEN tipo = 'upvote' THEN 1 WHEN tipo = 'downvote' THEN -1 ELSE 0 END) AS total_votos
      FROM votos
      WHERE publicacion_id = ?
      GROUP BY publicacion_id`;

    connection.query(sqlQuery, [publicacion_id], (error, results) => {
      if (error) {
        console.error("Error en la consulta:", error);
        res.status(500).json({ error: error.message });
        return;
      }

      // Si no se encontraron resultados, devolver 0 votos
      if (results.length === 0) {
        res.json({ totalVotes: 0 });
        return;
      }

      // Devolver el recuento total de votos como respuesta
      res.json({ totalVotes: results[0].total_votos });
    });
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/votos/:publicacion_id/:usuario_id", async (req, res) => {
  try {
    const publicacion_id = req.params.publicacion_id;

    const sqlQuery = `
      SELECT publicacion_id, tipo, COUNT(*) as total_votos_publicacion
      FROM votos
      WHERE publicacion_id = ?
      GROUP BY publicacion_id, tipo`;

    connection.query(sqlQuery, [publicacion_id], (error, results) => {
      if (error) {
        console.error("Error en la consulta:", error);
        res.status(500).json({ error: error.message });
        return;
      }

      res.json(results);
    });
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ error: error.message });
  }
});



/// Función para ejecutar una consulta en la base de datos
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

// Ruta para manejar los votos
app.post("/votos/:publicacion_id/:usuario_id/:tipo", async (req, res) => {
  const publicacion_id = req.params.publicacion_id;
  const usuario_id = req.params.usuario_id;
  const tipo = req.params.tipo;

  // Iniciar la transacción
  connection.beginTransaction(async (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    try {
      // Consulta SQL para verificar si el usuario ya ha votado en la publicación
      const sqlCheckVote =
        "SELECT tipo FROM votos WHERE publicacion_id = ? AND usuario_id = ?";
      const checkVoteValues = [publicacion_id, usuario_id];

      // Ejecutar la consulta SQL para obtener el tipo de voto actual
      const resultCheckVote = await executeQuery(
        connection,
        sqlCheckVote,
        checkVoteValues
      );

      let totalVotes = 0;

      if (resultCheckVote.length > 0) {
        // El usuario ya ha votado en la publicación
        const existingTipo = resultCheckVote[0].tipo;

        if (existingTipo === tipo) {
          // El usuario está cambiando su voto al mismo tipo, eliminar el voto
          const sqlDeleteVote =
            "DELETE FROM votos WHERE publicacion_id = ? AND usuario_id = ?";
          const deleteVoteValues = [publicacion_id, usuario_id];

          await executeQuery(connection, sqlDeleteVote, deleteVoteValues);
        } else {
          // El usuario está cambiando su voto a un tipo diferente, actualizar el voto
          const sqlUpdateVote =
            "UPDATE votos SET tipo = ? WHERE publicacion_id = ? AND usuario_id = ?";
          const updateVoteValues = [tipo, publicacion_id, usuario_id];

          await executeQuery(connection, sqlUpdateVote, updateVoteValues);
        }
      } else {
        // El usuario no ha votado en la publicación, insertar un nuevo voto
        const sqlInsert =
          "INSERT INTO votos (publicacion_id, usuario_id, tipo) VALUES (?, ?, ?)";
        const insertValues = [publicacion_id, usuario_id, tipo];

        await executeQuery(connection, sqlInsert, insertValues);
      }

      // Consulta SQL para obtener la suma total de votos
      const sqlSelect =
        'SELECT SUM(IF(tipo = "upvote", 1, IF(tipo = "downvote", -1, 0))) AS total_votos FROM votos WHERE publicacion_id = ?';
      const selectValues = [publicacion_id];

      const result = await executeQuery(connection, sqlSelect, selectValues);

      if (result.length > 0) {
        totalVotes = result[0].total_votos; // Obtener el total de votos
      }

      // Commit si todo ha sido exitoso
      connection.commit((err) => {
        if (err) {
          return res.status(500).send(err.message);
        }

        // Enviar una respuesta JSON con el total de votos
        res.status(200).json({ totalVotes });
      });
    } catch (error) {
      // Rollback en caso de error
      connection.rollback(() => {
        console.error("Error en la transacción:", error);
        return res.status(500).send("Error en la transacción");
      });
    }
  });
});





app.get("/populares", (req, res) => {
  // Consulta SQL para obtener las publicaciones ordenadas por la suma de likes y dislikes de forma descendente y limitar a las primeras 10
  const sqlQuery = `
    SELECT p.*, 
           COALESCE(SUM(CASE WHEN v.tipo = 'upvote' THEN 1 WHEN v.tipo = 'downvote' THEN -1 ELSE 0 END), 0) as likes
    FROM publicaciones p
    LEFT JOIN votos v ON p.publicacion_id = v.publicacion_id
    GROUP BY p.publicacion_id
    HAVING likes > 0
    ORDER BY likes DESC
    LIMIT 10`;

  connection.query(sqlQuery, (error, results) => {
    if (error) {
      console.error("Error en la consulta:", error);
      res.status(500).json({ error: error.message });
      return;
    }

    // Actualizar los resultados en base a la lógica de votos
    results.forEach((publicacion) => {
      // Restar votos 'unvote' si existen
      const unvoteCount = results.filter(
        (v) =>
          v.publicacion_id === publicacion.publicacion_id && v.tipo === "unvote"
      ).length;
      publicacion.likes -= unvoteCount;
    });

    res.json(results);
  });
});


// Ruta para obtener el nombre de la categoría y las publicaciones por categoría
app.get("/categorias/:categoria_id", (req, res) => {
  const categoriaId = req.params.categoria_id;
  const sqlQuery = `
    SELECT c.nombre_categoria, p.* 
    FROM categorias c
    LEFT JOIN publicaciones p ON p.categoria_id = c.categoria_id 
    WHERE c.categoria_id = ?`;
  connection.query(sqlQuery, [categoriaId], (error, results) => {
    if (error) {
      console.error("Error en la consulta:", error);
      res.status(500).json({ error: "Error al obtener la categoría y las publicaciones" });
      return;
    }
    res.json(results);
  });
});

app.post('/guardados', (req, res) => {
  const { usuario_id, publicacion_id, tipo } = req.body;

  // Verificar si ya existe un registro de guardado para esta publicación y usuario
  const checkQuery = 'SELECT * FROM guardados WHERE usuario_id = ? AND publicacion_id = ?';
  connection.query(checkQuery, [usuario_id, publicacion_id], (error, results) => {
    if (error) {
      console.error('Error al verificar el guardado:', error);
      res.status(500).json({ error: error.message });
      return;
    }

    // Si ya existe un registro, eliminarlo (quitar el guardado)
    if (results.length > 0) {
      const deleteQuery = 'DELETE FROM guardados WHERE usuario_id = ? AND publicacion_id = ?';
      connection.query(deleteQuery, [usuario_id, publicacion_id], (deleteError, deleteResults) => {
        if (deleteError) {
          console.error('Error al eliminar el guardado:', deleteError);
          res.status(500).json({ error: deleteError.message });
          return;
        }
        res.json({ message: 'Publicación eliminada de guardados' });
      });
    } else {
      // Si no existe un registro, insertarlo (agregar el guardado)
      const insertQuery = 'INSERT INTO guardados (usuario_id, publicacion_id, tipo) VALUES (?, ?, ?)';
      connection.query(insertQuery, [usuario_id, publicacion_id, tipo], (insertError, insertResults) => {
        if (insertError) {
          console.error('Error al guardar la publicación:', insertError);
          res.status(500).json({ error: insertError.message });
          return;
        }
        res.json({ message: 'Publicación guardada exitosamente' });
      });
    }
  });
});




app.get('/obtener-guardados/:usuario_id', (req, res) => {
  const usuario_id = req.params.usuario_id;
  
  const sqlQuery = `
    SELECT guardados.*, publicaciones.*
    FROM guardados
    INNER JOIN publicaciones ON guardados.publicacion_id = publicaciones.publicacion_id
    WHERE guardados.usuario_id = ?
  `;
  
  connection.query(sqlQuery, [usuario_id], (error, results) => {
    if (error) {
      console.error('Error al obtener las publicaciones guardadas:', error);
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(results);
  });
});


app.delete('/eliminar-publicacion/:publicacion_id', async (req, res) => {
  const { publicacion_id } = req.params;
  const { usuario_id } = req.body; // Agregar esta línea para obtener usuario_id del cuerpo de la solicitud

  try {
    const deleteQuery = 'DELETE FROM guardados WHERE usuario_id = ? AND publicacion_id = ?';
    connection.query(deleteQuery, [usuario_id, publicacion_id], (deleteError, deleteResults) => {
      if (deleteError) {
        console.error('Error al eliminar el guardado:', deleteError);
        res.status(500).json({ error: deleteError.message });
        return;
      }
      res.json({ message: 'Publicación eliminada de guardados' });
    });
  } catch (error) {
    console.error('Error al eliminar la publicación:', error);
    res.status(500).json({ error: error.message });
  }
});






{/*
// Ruta para obtener los votos por publicación ID y usuario ID
app.get("/notificaciones/:usuario_id", async (req, res) => {
  const usuario_id = req.params.usuario_id;
    try {
    const sqlQuery = `
    SELECT v.tipo, p.*, v.*, u.nombre_usuario, u.foto_perfil
    FROM votos v
    INNER JOIN publicaciones p ON v.publicacion_id = p.publicacion_id
    INNER JOIN usuarios u ON v.usuario_id = u.id
    WHERE p.usuario_id = ? AND v.tipo IN ('upvote', 'downvote') AND v.usuario_id != p.usuario_id
    GROUP BY v.tipo, p.publicacion_id, p.usuario_id, p.titulo, p.tiempo_publicacion, v.usuario_id;
    `;

    connection.query(sqlQuery, [usuario_id], (error, results) => {
      if (error) {
        console.error("Error en la consulta:", error);
        res.status(500).json({ error: error.message });
        return;
      }

      res.json(results);
    });
  } catch (error) {
    console.error("Error en el bloque catch:", error);
    res.status(500).json({ error: error.message });
  }
});
*/}


{/*
app.get("/notificaciones/count/:usuario_id", async (req, res) => {
  const usuario_id = req.params.usuario_id;
  try {
    const sqlQuery = `
    SELECT COUNT(*) AS total_notificaciones
    FROM votos v
    INNER JOIN publicaciones p ON v.publicacion_id = p.publicacion_id
    WHERE p.usuario_id = ? AND v.tipo = 'upvote' AND v.usuario_id != p.usuario_id;
    `;

    connection.query(sqlQuery, [usuario_id], (error, results) => {
      if (error) {
        console.error("Error en la consulta:", error);
        res.status(500).json({ error: error.message });
        return;
      }

      res.json(results[0]); // Devuelve el resultado del recuento como un objeto JSON
    });
  } catch (error) {
    console.error("Error en el bloque catch:", error);
    res.status(500).json({ error: error.message });
  }
});
*/}







app.listen(port, () =>
  console.log(`Servidor backend escuchando en el puerto ${port}`)
);
