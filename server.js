import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const OPENAI_KEY = "YOUR_KEY";

app.post("/ai", async (req, res) => {
  const { prompt } = req.body;

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{role:"user", content:prompt}]
    })
  });

  const data = await r.json();
  res.json({ result: data.choices[0].message.content });
});

app.listen(3000);
