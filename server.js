const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// =====================
// 🌐 HOME (FRONTEND)
// =====================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// =====================
// 🤖 AI MODE PAGE (QR TARGET)
// =====================
app.get("/ai-mode", (req, res) => {
  res.send(`
    <h1>🤖 AI Assistant Mode</h1>
    <p>Welcome to AI launch page</p>

    <a href="shortcuts://run-shortcut?name=AI Assistant">
      ▶ Open Siri Shortcut
    </a>

    <br><br>

    <a href="/">⬅ Back to App</a>
  `);
});

// =====================
// 🤖 AI ENDPOINT
// =====================
app.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    const OPENAI_KEY = process.env.OPENAI_KEY;

    if (!OPENAI_KEY) {
      return res.status(500).json({
        error: "OPENAI_KEY missing in environment variables"
      });
    }

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
      "No AI response";

    res.json({ result: reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// =====================
// ❤️ HEALTH CHECK
// =====================
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString()
  });
});

// =====================
// 🚀 START SERVER
// =====================
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("✅ AI SERVER RUNNING ON PORT", PORT);
});
