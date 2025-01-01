import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import env from "dotenv";
import bcrypt from "bcrypt";
import * as http from "http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

const app = express();
const port = 4000;
const api_url = "http://localhost:4000";
const saltRounds = 10;
let currentUserID = null;
let currentListType = "daily";
const server = http.createServer(app);
const { Pool } = pg;
const PgSession = connectPgSimple(session);
env.config();

const pool = new pg.Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

pool.connect();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};

app.use(express.static("public"));
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(
  session({
    store: new PgSession({
      pool: pool,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      httpOnly: true,
    },
  })
);

app.get("/current-user", (req, res) => {
  if (req.session.userId) {
    const userId = req.session.userId;
    console.log("Session id: " , req.session.userId);
    pool
      .query("SELECT name FROM users WHERE id = $1", [userId])
      .then((result) => {
        res.json({ name: result.rows[0].name });
      })
      .catch((error) => {
        res.status(500).json({ error: "Failed to fetch user" });
      });
  } else {
    res.status(401).json({ error: "No active session" });
  }
});

app.get("/protected", (req, res) => {
  if (req.session.user) {
    res.send(`Hello, ${req.session.user}`);
  } else {
    res.status(401).send("Unauthorized");
  }
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
          req.session.userId = data.rows[0].id;
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
      req.session.user = user.name;
      req.session.userId = user.id;
      console.log("session id after login: ", req.session.userId);
      bcrypt.compare(password, hashedPassword, (err, result) => {
        if (err) {
          console.log("Error comparing passwords: ", err);
        } else {
          if (result) {
            console.log(user);
            res.status(201).json(req.session.user);
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
      [title, content, req.session.userId]
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
      [req.session.userId]
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

app.post("/save-to-do", async (req, res) => {
  const listItem = req.body.inputText;
  const listType = req.body.type;
  console.log(req.session.userId);
  try {
    const result = await pool.query(
      "INSERT INTO user_to_do_list(to_do_item,type,userid) VALUES($1,$2,$3) RETURNING id, to_do_item, type",
      [listItem, listType, req.session.userId]
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
      [currentListType, req.session.userId]
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
      [currentListType, req.session.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching filtered notes: ", error);
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Failed to log out.");
    } else {
      res.clearCookie("connect.sid");
      res.status(200).send("Logged out successfully.");
    }
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
