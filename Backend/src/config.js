const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env"), quiet: true });

const isProduction = process.env.NODE_ENV === "production";

if (isProduction && !process.env.SESSION_SECRET) {
  throw new Error("Falta SESSION_SECRET en el .env");
}

// Conexión a MySQL. Acepta DATABASE_URL (mysql://usuario:clave@host:puerto/base, como la que
// entregan Aiven o Railway) o las variables DB_* por separado.
const configuracionDb = () => {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    return {
      host: url.hostname,
      port: Number(url.port) || 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: process.env.DB_DATABASE || url.pathname.replace(/^\//, "") || "rinconbd2",
    };
  }
  return {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "rinconbd2",
  };
};

// Conexión cifrada (la exigen los MySQL alojados). DB_SSL_CA es el certificado CA en
// formato PEM; en paneles que no admiten saltos de línea se puede pegar con "\n".
const configuracionSsl = () => {
  if (process.env.DB_SSL !== "true") return undefined;
  const ca = process.env.DB_SSL_CA?.replace(/\\n/g, "\n");
  return ca ? { ca, rejectUnauthorized: true } : { rejectUnauthorized: true };
};

module.exports = {
  isProduction,
  port: Number(process.env.PORT) || 3000,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  db: { ...configuracionDb(), ssl: configuracionSsl() },
  session: {
    secret: process.env.SESSION_SECRET || "cambia-este-secreto",
    sameSite: process.env.COOKIE_SAMESITE || "lax",
  },
  uploadsDir: path.join(__dirname, "..", "uploads"),
};
