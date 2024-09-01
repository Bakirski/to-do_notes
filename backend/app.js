import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import env from "dotenv";
const app = express();
const port = 4000;
const api_url = "http://localhost:4000";
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

//data simulira spremanje podataka. zamijeniti sa bazom iz postgresa
app.post("/main-page", async (req, res) => {
  //const { name, email, password, confirmPassword } = req.body;
  //const data = { id: 1, name, email, password, confirmPassword };
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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
