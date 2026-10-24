const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const config = require("./config");
const { db } = require("./db");
const rutas = require("./routes");
const { noEncontrado, manejarErrores } = require("./middlewares/errores");

const app = express();

if (config.isProduction) {
  app.set("trust proxy", 1); // detrás de un proxy HTTPS (Railway, Render, nginx...)
}

app.use(
  helmet({
    // El frontend corre en otro origen y necesita cargar las imágenes de /uploads
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true, // Permite el envío de la cookie de sesión
  })
);

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ limit: "100kb", extended: true }));
// En Express 5 req.body queda undefined si la petición no trae cuerpo
app.use((req, res, next) => {
  req.body ??= {};
  next();
});

// Sesiones guardadas en MySQL (sobreviven a reinicios del servidor)
const DURACION_SESION = 7 * 24 * 60 * 60 * 1000; // 7 días
const sessionStore = new MySQLStore(
  {
    clearExpired: true,
    expiration: DURACION_SESION, // por defecto serían 24 h, menos que la cookie
    endConnectionOnClose: false, // el pool es de la app, no del almacén
  },
  db
);
app.locals.sessionStore = sessionStore; // para cerrarlo en los tests

app.use(
  session({
    name: "rincon.sid",
    secret: config.session.secret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true, // JavaScript del navegador no puede leer la cookie
      sameSite: config.session.sameSite,
      secure: config.isProduction, // solo por HTTPS en producción
      maxAge: DURACION_SESION,
    },
  })
);

app.use(
  "/uploads",
  express.static(config.uploadsDir, {
    setHeaders: (res) => res.set("X-Content-Type-Options", "nosniff"),
  })
);

app.use("/api", rutas);

// La raíz solo indica dónde está la API (el sitio web lo sirve el frontend)
app.get("/", (req, res) => {
  res.json({ nombre: "API de Rincón Tocopillano", api: "/api", salud: "/api/salud" });
});

app.use(noEncontrado);
app.use(manejarErrores);

module.exports = app;
