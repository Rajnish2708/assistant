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
        Authorization: "Bearer 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",
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


app.post('/jasper', async (req, res) => {
  const { language, text } = req.body;
  const url = 'https://api.jasper.ai/v1/command';

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'X-API-Key': "api_3472BD0447F14F87BD6A61FA954A7FD3:BN41RwfWAEtGVRnF76XsgASplSd11LBuHhaHuYJKzbM=" // Replace with your actual Jasper API key
    },
    body: JSON.stringify({
      inputs: {
        command: `translate in ${language}`,
        context: text
      },
      options: {
        outputCount: 1,
        outputLanguage: 'English',
        inputLanguage: 'English',
        languageFormality: 'default',
        completionType: 'performance'
      }
    })
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log('Jasper API Response:', data); // Log the response from Jasper API
    res.json(data); // Send the result back to the frontend
  } catch (err) {
    console.error('Jasper API Error:', err);
    res.status(500).json({ error: 'Failed to fetch from Jasper AI API' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
