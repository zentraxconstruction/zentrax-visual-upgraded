const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Use __dirname so the path is always correct no matter where you run the server from
const DB_PATH = path.join(__dirname, "database", "contact.db");

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("❌ SQLite connection error:", err.message);
  } else {
    console.log("✅ SQLite Connected →", DB_PATH);
  }
});

// Create the contacts table if it doesn't exist yet
db.run(`
  CREATE TABLE IF NOT EXISTS contacts (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name     TEXT,
    email    TEXT,
    phone    TEXT,
    service  TEXT,
    message  TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error("❌ Table creation error:", err.message);
  } else {
    console.log("✅ contacts table ready");
  }
});

module.exports = db;
