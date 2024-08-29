import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 4000;
const api_url = "http://localhost:4000";
app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json());
app.get("/backend", (req, res) => {
  return res.json({ message: "This is from backend" });
});

//data simulira spremanje podataka. zamijeniti sa bazom iz postgresa
app.post("/main-page", (req, res) => {
  const { email, password } = req.body;
  const data = { id: 1, email, password };

  res.status(201).json(data);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
