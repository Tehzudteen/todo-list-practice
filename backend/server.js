const express = require("express");
const mysql = require("mysql2");
const cors = require("cors"); // Ensure this is declared only once
const bodyParser = require("body-parser");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "teh1", // Replace with your MySQL username
  password: "TehH_0083", // Replace with your MySQL password
  database: "database1",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected");
});

// Routes
app.get("/todos", (req, res) => {
  const sql = "SELECT * FROM todos";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post("/todos", (req, res) => {
  const { title, description } = req.body;
  const sql = "INSERT INTO todos (title, description) VALUES (?, ?)";
  db.query(sql, [title, description], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, title, description, completed: false });
  });
});

app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const sql = "UPDATE todos SET completed = ? WHERE id = ?";
  db.query(sql, [completed, id], (err, result) => {
    if (err) throw err;
    res.json({ id, completed });
  });
});

app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM todos WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json({ id });
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
