// server.js (ES Module style)
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/huggingface", async (req, res) => {
  const { userInput } = req.body;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1", {
      method: "POST",
      headers: {
        Authorization: "Bearer ",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: userInput }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error from Hugging Face:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
