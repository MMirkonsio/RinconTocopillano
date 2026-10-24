const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env"), quiet: true });

const isProduction = process.env.NODE_ENV === "production";

if (isProduction && !process.env.SESSION_SECRET) {
  throw new Error("Falta SESSION_SECRET en el .env");
}

module.exports = {
  isProduction,
  port: Number(process.env.PORT) || 3000,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "rinconbd2",
  },
  session: {
    secret: process.env.SESSION_SECRET || "cambia-este-secreto",
    sameSite: process.env.COOKIE_SAMESITE || "lax",
  },
  uploadsDir: path.join(__dirname, "..", "uploads"),
};
