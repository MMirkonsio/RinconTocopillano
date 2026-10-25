const mysql = require("mysql2/promise");
const config = require("./config");

// Pool de conexiones: se reconecta solo si MySQL se reinicia o corta la conexión
const db = mysql.createPool({
  ...config.db,
  charset: "utf8mb4",
  waitForConnections: true,
  connectionLimit: 10,
});

// Columnas de un usuario que se pueden mostrar a cualquiera (nunca la contraseña)
const COLUMNAS_PUBLICAS_USUARIO =
  "id, nombre_usuario, foto_perfil, telefono, descripcion, direccion, horario";

// true si existe una fila en `tabla` con `columna` = valor
const existe = async (tabla, columna, valor) => {
  const [rows] = await db.query(`SELECT 1 FROM ${tabla} WHERE ${columna} = ? LIMIT 1`, [valor]);
  return rows.length > 0;
};

module.exports = { db, COLUMNAS_PUBLICAS_USUARIO, existe };
