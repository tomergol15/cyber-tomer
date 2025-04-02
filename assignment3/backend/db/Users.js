import sqlite3 from "sqlite3";
const sqlite3Verbose = sqlite3.verbose();

const dbName = "./Users.db";
const db = new sqlite3Verbose.Database(dbName, (err) => {
  if (err) {
    console.error("Error connecting to DB:", err.message);
  } else {
    console.log("Connected to DB");

    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT
      )
    `);
  }
});

export default db;