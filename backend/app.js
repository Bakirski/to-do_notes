import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";

const app = express();
const port = 4000;

app.use(express.static("public"));
app.use(cors());

app.get("/backend", (req, res) => {
  return res.json({ message: "This is from backend" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
