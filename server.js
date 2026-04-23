import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// 🟢 ROOT CHECK (so browser doesn't show error)
app.get("/", (req, res) => {
  res.send("✅ AI Backend Running");
});

// 🧠 AI ENDPOINT (THIS FIXES /ai ISSUE)
app.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.json({ error: "No prompt provided" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    res.json({
      result: data.choices?.[0]?.message?.content || "No response from AI"
    });

  } catch (err) {
    res.json({
      error: err.message
    });
  }
});

// 🟡 HEALTH CHECK (DEBUG TOOL)
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date()
  });
});

// 🚀 START SERVER (REQUIRED FOR RENDER)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
