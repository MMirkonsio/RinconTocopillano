const config = require("./src/config");
const { db } = require("./src/db");
const app = require("./src/app");

db.query("SELECT 1")
  .then(() => console.log("Conectado a la base de datos"))
  .catch((err) =>
    console.error("No se pudo conectar a la base de datos:", err.message || err.code)
  );

app.listen(config.port, () =>
  console.log(`Servidor backend escuchando en el puerto ${config.port}`)
);
