import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import env from "dotenv";
import bcrypt from "bcrypt";
const app = express();
const port = 4000;
const api_url = "http://localhost:4000";
const saltRounds = 10;

env.config();
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

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
    const data = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (data.rows.length > 0) {
      res.json({ message: "Email already registered. Try logging in." });
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log("Error hashing password: ", err);
        } else {
          const data = await db.query(
            "INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING name",
            [req.body.name, email, hash]
          );
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
    const data = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (data.rows.length > 0) {
      const user = data.rows[0];
      const hashedPassword = user.password;

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

/*app.post("/main-page", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (req.body.confirmPassword) {
    if (password == req.body.confirmPassword) {
      const data = await db.query(
        "INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING name",
        [req.body.name, email, password]
      );
      const userName = data.rows[0];
      console.log(data.rows[0]);
      res.status(201).json(userName);
    } else {
      console.log("Passwords must match.");
    }
  } else {
    try {
      const data2 = await db.query("SELECT name FROM users WHERE email = $1", [
        email,
      ]);
      res.status(201).json(data2.rows[0]);
    } catch (err) {
      console.log(err);
    }
  }
});
*/
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
