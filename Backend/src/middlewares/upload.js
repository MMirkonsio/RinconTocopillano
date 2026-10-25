const crypto = require("crypto");
const fs = require("fs");
const multer = require("multer");
const { uploadsDir } = require("../config");
const { HttpError } = require("../utils/validacion");

fs.mkdirSync(uploadsDir, { recursive: true });

const MAX_IMAGENES = 8;

const EXTENSIONES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    // Nombre aleatorio: evita sobrescribir archivos y nombres peligrosos
    filename: (req, file, cb) => cb(null, `${crypto.randomUUID()}${EXTENSIONES[file.mimetype]}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: MAX_IMAGENES },
  fileFilter: (req, file, cb) => {
    if (EXTENSIONES[file.mimetype]) return cb(null, true);
    cb(new HttpError(400, "Solo se permiten imágenes JPG, PNG, WEBP o GIF"));
  },
});

// Comprueba la "firma" real del archivo: el tipo que manda el navegador se puede falsificar
const esImagenReal = async (ruta) => {
  const fh = await fs.promises.open(ruta, "r");
  try {
    const { buffer } = await fh.read(Buffer.alloc(12), 0, 12, 0);
    const hex = buffer.toString("hex");
    return (
      hex.startsWith("ffd8ff") || // JPEG
      hex.startsWith("89504e470d0a1a0a") || // PNG
      hex.startsWith("47494638") || // GIF
      (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP")
    );
  } finally {
    await fh.close();
  }
};

const borrarArchivos = (files) => {
  for (const file of files) fs.promises.unlink(file.path).catch(() => {});
};

// Valida la firma de los archivos recibidos y, si el handler falla, los borra del disco
const validarYEjecutar = (handler) => async (req, res, next) => {
  const archivos = req.files ?? (req.file ? [req.file] : []);
  try {
    for (const archivo of archivos) {
      if (!(await esImagenReal(archivo.path))) {
        throw new HttpError(400, `«${archivo.originalname}» no es una imagen válida`);
      }
    }
    await handler(req, res, next);
  } catch (err) {
    borrarArchivos(archivos);
    throw err;
  }
};

// Una imagen en `campo`, disponible en req.file
const conImagen = (campo, handler) => [upload.single(campo), validarYEjecutar(handler)];

// Hasta MAX_IMAGENES imágenes en `campo`, disponibles en req.files (en el orden enviado)
const conImagenes = (campo, handler) => [upload.array(campo, MAX_IMAGENES), validarYEjecutar(handler)];

module.exports = { conImagen, conImagenes, MAX_IMAGENES };
