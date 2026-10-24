const fs = require("fs");
const path = require("path");
const { db } = require("../db");
const { uploadsDir } = require("../config");

// Imágenes por defecto que nunca se borran aunque nadie las use
const PROTEGIDAS = new Set(["default.webp", "defaultPhoto.jpg"]);

// Nombres de archivo de uploads/ que todavía usa alguna publicación o perfil
const archivosEnUso = async (archivos) => {
  if (archivos.length === 0) return new Set();
  const [rows] = await db.query(
    `SELECT archivo FROM publicacion_imagenes WHERE archivo IN (?)
     UNION SELECT imagen_contenido FROM publicaciones WHERE imagen_contenido IN (?)
     UNION SELECT foto_perfil FROM usuarios WHERE foto_perfil IN (?)`,
    [archivos, archivos, archivos]
  );
  return new Set(rows.map((r) => r.archivo));
};

// Borra de uploads/ los archivos de la lista que ya nadie usa. Devuelve los borrados.
// Llamar después de eliminar las filas de la base de datos.
const borrarImagenesSinUso = async (archivos) => {
  const candidatos = [...new Set(archivos.filter(Boolean))].filter((a) => !PROTEGIDAS.has(a));
  const enUso = await archivosEnUso(candidatos);
  const borrados = [];
  for (const archivo of candidatos) {
    if (enUso.has(archivo)) continue;
    // basename evita salir de uploads/ con nombres como "../index.js"
    const ruta = path.join(uploadsDir, path.basename(archivo));
    try {
      await fs.promises.unlink(ruta);
      borrados.push(archivo);
    } catch (error) {
      if (error.code !== "ENOENT") console.error(`No se pudo borrar ${archivo}:`, error.message);
    }
  }
  return borrados;
};

module.exports = { PROTEGIDAS, archivosEnUso, borrarImagenesSinUso };
