const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const DB_FILE = "./db.sqlite";
const PORT = process.env.PORT || 3000;

// Redeem endpoint
app.post("/api/redeem", (req, res) => {
    const { code, discord_id, roblox_id } = req.body;
    if(!code || !discord_id || !roblox_id) return res.status(400).json({ error: "Missing parameters" });

    const db = new sqlite3.Database(DB_FILE);
    db.get("SELECT * FROM codes WHERE code = ?", [code], (err, row) => {
        if(err) return res.status(500).json({ error: "Database error" });
        if(!row) return res.status(404).json({ error: "Code not found" });
        if(row.redeemed) return res.status(400).json({ error: "Code already redeemed" });

        db.run("UPDATE codes SET redeemed = 1 WHERE code = ?", [code]);
        db.run("INSERT INTO linked_users (discord_id, roblox_id) VALUES (?, ?)", [discord_id, roblox_id]);
        db.close();
        res.json({ success:true, message:"Code redeemed successfully!" });
    });
});

// Serve frontend
app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));