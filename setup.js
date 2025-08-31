const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db.sqlite");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS codes (
    code TEXT PRIMARY KEY,
    discord_id TEXT,
    redeemed INTEGER DEFAULT 0
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS linked_users (
    discord_id TEXT PRIMARY KEY,
    roblox_id TEXT
  )`);
  console.log("Database initialized!");
});

db.close();