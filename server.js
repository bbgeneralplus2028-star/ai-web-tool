const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ SERVE FRONTEND
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ===== AI ENDPOINT =====
app.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    // ⚠️ REPLACE WITH YOUR OPENAI KEY
    const OPENAI_KEY = process.env.OPENAI_KEY;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "No response from AI";

    res.json({ result: reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== HEALTH CHECK =====
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("✅ Full AI App Running on port", PORT);
});
