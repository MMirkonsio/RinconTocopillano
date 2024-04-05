//import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./config.js";
require("dotenv").config();
const mysql = require("mysql2");

//const urlDB = 'mysql://root:pUAXFcJgfIsMsiWiFnONNUFKpkoDAswN@viaduct.proxy.rlwy.net:21760/railway'

const urlDB = 'mysql://${process.env.MYSQLUSER}:${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}'

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection(urlDB);

module.exports = connection;