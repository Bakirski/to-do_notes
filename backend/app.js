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
  const { name, email, password, confirmPassword } = req.body;
  const data = { id: 1, name, email, password, confirmPassword };

  res.status(201).json(data);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
