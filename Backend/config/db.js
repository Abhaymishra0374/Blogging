const mysql = require("mysql2");
require("dotenv").config();

// Create a connection pool (promise-based) instead of a single connection.
// Pools automatically reconnect and handle concurrent requests safely.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = pool.promise();

// Verify the connection once at startup so failures are obvious immediately.
pool.getConnection((err, connection) => {
  if (err) {
    console.log("❌ Database Connection Failed");
    console.log(err.message);
    return;
  }
  console.log("✅ MySQL Connected Successfully");
  connection.release();
});

module.exports = db;
