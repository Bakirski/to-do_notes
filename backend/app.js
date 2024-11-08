import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import env from "dotenv";
import bcrypt from "bcrypt";
import * as http from "http";
import { Server } from "socket.io";

const app = express();
const port = 4000;
const api_url = "http://localhost:4000";
const saltRounds = 10;
let currentUserID = null;
let currentListType = "daily";
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket"],
});
const { Pool } = pg;

env.config();
const pool = new pg.Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

pool.connect();

app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json());
app.get("/backend", (req, res) => {
  return res.json({ message: "This is from backend" });
});

app.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const data = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (data.rows.length > 0) {
      res.json({ message: "Email already registered. Try logging in." });
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log("Error hashing password: ", err);
        } else {
          const data = await pool.query(
            "INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING id,name",
            [req.body.name, email, hash]
          );
          currentUserID = data.rows[0].id;
          const userName = data.rows[0].name;
          res.status(201).json(userName);
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const data = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (data.rows.length > 0) {
      const user = data.rows[0];
      const hashedPassword = user.password;
      currentUserID = user.id;
      bcrypt.compare(password, hashedPassword, (err, result) => {
        if (err) {
          console.log("Error comparing passwords: ", err);
        } else {
          if (result) {
            console.log(user);
            res.status(201).json(user.name);
          } else {
            res.status(404).json("Incorrect password");
          }
        }
      });
    } else {
      res.status(404).json("User not found");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/notes", async (req, res) => {
  const { title, content } = req.body;
  try {
    const data = await pool.query(
      "INSERT INTO user_notes(title,content,userid) VALUES($1,$2,$3) RETURNING *",
      [title, content, currentUserID]
    );
    res.json(data);
  } catch (error) {
    console.error("Error inserting note: ", error);
  }
});

app.get("/get-notes", async (req, res) => {
  try {
    const data = await pool.query(
      "SELECT id,title FROM user_notes WHERE userid = $1",
      [currentUserID]
    );
    res.json(data.rows);
  } catch (error) {
    console.error("Error fetching notes: ", error);
  }
});

app.post("/display-note", async (req, res) => {
  const id = req.body.id;
  try {
    const data = await pool.query("SELECT * FROM user_notes WHERE id = $1", [
      id,
    ]);
    console.log(data.rows);
    res.json(data.rows);
  } catch (error) {
    console.error("Error getting note: ", error);
  }
});

app.delete("/user-notes/:id", async (req, res) => {
  const noteId = req.params.id;
  try {
    const result = await pool.query("DELETE FROM user_notes WHERE id = $1", [
      noteId,
    ]);
    if (result.rowCount > 0) {
      res
        .status(200)
        .send({ success: true, message: "Note deleted successfully." });
    } else {
      res.status(404).send({ success: false, message: "Note not found." });
    }
  } catch (error) {
    console.error("Error deleting note: ", error);
    res.status(500).send({
      success: false,
      message: "An error ocurred while deleting the note.",
    });
  }
});

app.get("/user-notes/updated-since/:timestamp", async (req, res) => {
  const { lastUpdated } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM user_notes WHERE updated_at > $1 ORDER BY updated_at DESC",
      [lastUpdated]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error selecting notes by timestamp: ", error);
  }
});

app.post("/save-to-do", async (req, res) => {
  const listItem = req.body.inputText;
  const listType = req.body.type;
  try {
    const result = await pool.query(
      "INSERT INTO user_to_do_list(to_do_item,type,userid) VALUES($1,$2,$3) RETURNING id, to_do_item, type",
      [listItem, listType, currentUserID]
    );
    const newItem = result.rows[0];
    res.json(newItem);
  } catch (error) {
    console.error("Error inserting item into database: ", error);
  }
});

app.get("/fetch-items", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id,to_do_item FROM user_to_do_list WHERE type = $1 AND userid = $2",
      [currentListType, currentUserID]
    );
    console.log(result.rows);
    res.json(result.rows);
  } catch (error) {
    console.log("Error fetching notes from database: ", error);
  }
});

app.delete("/delete-item/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM user_to_do_list WHERE id = $1", [id]);
    res.status(200).send({ message: "Item deleted successfully." });
  } catch (error) {
    res.status(500).send({ message: "Error deleting item." });
  }
});

app.get("/filter-notes", async (req, res) => {
  currentListType = req.query.listType;
  console.log(currentListType);
  try {
    const result = await pool.query(
      "SELECT id,to_do_item FROM user_to_do_list WHERE type = $1 AND userid = $2",
      [currentListType, currentUserID]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching filtered notes: ", error);
  }
});

/*
// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Optional: Handle disconnect event
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  // Handle other events if necessary
});

app.post("/database-changed", (req, res) => {
  io.emit("notes-updated");
  res.send("Database updated.");
});
*/
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
