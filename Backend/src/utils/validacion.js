class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Entero positivo o null
const toId = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

// Texto recortado entre min y max caracteres, o lanza un 400 con el nombre del campo
const texto = (value, campo, { min = 1, max }) => {
  if (typeof value !== "string") value = value == null ? "" : String(value);
  const limpio = value.trim();
  if (limpio.length < min || limpio.length > max) {
    throw new HttpError(
      400,
      min > 0
        ? `${campo}: debe tener entre ${min} y ${max} caracteres`
        : `${campo}: máximo ${max} caracteres`
    );
  }
  return limpio;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFONO_RE = /^\+?[0-9 ]{4,20}$/;

const validarCorreo = (correo) => {
  if (!EMAIL_RE.test(correo)) throw new HttpError(400, "El correo no es válido");
};

const validarTelefono = (telefono) => {
  if (telefono && !TELEFONO_RE.test(telefono)) throw new HttpError(400, "El teléfono no es válido");
};

// El nombre aparece en la URL del perfil (/usuario/nombre): solo letras, números, _ . -
const NOMBRE_USUARIO_RE = /^[\p{L}\p{N}_.-]{3,25}$/u;

const validarNombreUsuario = (nombre) => {
  if (!NOMBRE_USUARIO_RE.test(nombre)) {
    throw new HttpError(400, "El nombre de usuario solo puede tener letras, números, puntos, guiones y _ (sin espacios)");
  }
};

module.exports = { HttpError, toId, texto, validarCorreo, validarTelefono, validarNombreUsuario };
