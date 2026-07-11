const mysql = require("mysql2");
require("dotenv").config();

// Print connection diagnostics (censoring password)
console.log("Database Diagnostics:");
console.log(`- DATABASE_URL present: ${!!process.env.DATABASE_URL}`);
if (process.env.DATABASE_URL) {
  console.log(`- DATABASE_URL: ${process.env.DATABASE_URL.substring(0, 15)}...`);
}
console.log(`- DB_HOST: ${process.env.DB_HOST}`);
console.log(`- DB_PORT: ${process.env.DB_PORT}`);
console.log(`- DB_USER: ${process.env.DB_USER}`);
console.log(`- DB_NAME: ${process.env.DB_NAME}`);
console.log(`- DB_SSL: ${process.env.DB_SSL}`);
console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);

const useUri = process.env.DATABASE_URL && (process.env.DATABASE_URL.startsWith("mysql://") || process.env.DATABASE_URL.startsWith("mysql2://"));

let pool;

if (useUri) {
  console.log("Using DATABASE_URL connection string...");
  pool = mysql.createPool(process.env.DATABASE_URL);
} else {
  console.log("Using individual connection parameters...");
  const config = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };

  if (process.env.DB_SSL === "true" || process.env.NODE_ENV === "production") {
    config.ssl = {
      rejectUnauthorized: false,
    };
  }

  pool = mysql.createPool(config);
}

const db = pool.promise();

// Verify the connection once at startup so failures are obvious immediately.
pool.getConnection((err, connection) => {
  if (err) {
    console.log("❌ Database Connection Failed");
    console.error("Error Detail:", err);
    return;
  }
  console.log("✅ MySQL Connected Successfully");
  connection.release();
});

module.exports = db;
