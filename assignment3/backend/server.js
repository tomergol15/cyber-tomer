import express from 'express';
import cors from 'cors';
import db from "./db/Users.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


//register and insert new data to the db
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            return res.status(400).json({ error: "Username already exists" });
        }

        db.run(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, password],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ message: "User created successfully", userId: this.lastID });
            }
        );
    });
});

//skipped the login form
app.post("/login-vulnerable", (req, res) => {
    const { username, password } = req.body;

    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    console.log("Running vulnerable query:", query);

    db.get(query, (err, row) => {
        if (err) return res.status(500).json({ error: err.message });

        if (row) {
            res.json({ message: "Login successful (vulnerable)", user: row });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    });
});
//not skip the login form
app.post("/login-secure", (req, res) => {
    const { username, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (row) {
                res.json({ message: "Login successful (secure)", user: row });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        }
    );
});

//view my data in db 
app.get("/users", (req, res) => {
    db.all("SELECT * FROM users", (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});