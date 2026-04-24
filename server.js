import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// ✅ ROOT ROUTE (TEST IN BROWSER)
app.get("/", (req, res) => {
  res.send("✅ AI Backend Running");
});

// ✅ HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date(),
    hasKey: !!process.env.OPENAI_KEY
  });
});

// 🧠 AI ENDPOINT (FULL DEBUG + SAFE)
app.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    if (!process.env.OPENAI_KEY) {
      return res.status(500).json({
        error: "OPENAI_KEY is missing on server"
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    // 🔍 DEBUG: show full error if OpenAI fails
    if (!response.ok) {
      return res.status(500).json({
        error: "OpenAI API error",
        details: data
      });
    }

    const result = data.choices?.[0]?.message?.content;

    if (!result) {
      return res.status(500).json({
        error: "No response from AI",
        raw: data
      });
    }

    res.json({ result });

  } catch (err) {
    res.status(500).json({
      error: "Server error",
      message: err.message
    });
  }
});

// 🚀 START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ Server running on port", PORT);
});
