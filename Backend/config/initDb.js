const fs = require("fs");
const path = require("path");
const db = require("./db");

async function initDb() {
  try {
    // Check if tables already exist (e.g. check for 'users' table)
    const [rows] = await db.query(
      `SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'users'`
    );

    if (rows[0].count > 0) {
      console.log("ℹ️ Database tables already exist. Skipping initialization.");
      return;
    }

    console.log("🛠️ Database tables not found. Initializing database schema...");

    // Read schema.sql
    const schemaPath = path.join(__dirname, "..", "schema.sql");
    if (!fs.existsSync(schemaPath)) {
      console.warn("⚠️ schema.sql not found! Cannot initialize database.");
      return;
    }

    const schemaSql = fs.readFileSync(schemaPath, "utf8");

    // Clean up SQL: remove comments and split by ';'
    const queries = schemaSql
      .split(";")
      .map((query) => query.trim())
      .filter((query) => {
        if (!query) return false;
        
        // Remove comments
        const cleanQuery = query.replace(/--.*$/gm, "").trim();
        if (!cleanQuery) return false;

        // Skip database creation / selection queries as cloud providers manage these
        if (
          cleanQuery.toUpperCase().startsWith("CREATE DATABASE") ||
          cleanQuery.toUpperCase().startsWith("USE ")
        ) {
          return false;
        }
        return true;
      });

    // Execute each query sequentially
    for (let query of queries) {
      const sqlToExecute = query
        .split("\n")
        .filter((line) => !line.trim().startsWith("--"))
        .join("\n")
        .trim();

      if (sqlToExecute) {
        await db.query(sqlToExecute);
      }
    }

    console.log("✅ Database initialized successfully with tables and seed data!");
  } catch (error) {
    console.error("❌ Failed to initialize database schema:", error.message);
  }
}

module.exports = initDb;
