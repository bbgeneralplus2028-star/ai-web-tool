import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// ✅ ADD THIS (fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.send("✅ AI Backend Running");
});

// 🔥 AI ENDPOINT
app.post("/ai", async (req, res) => {
  const { prompt } = req.body;

  try {
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
      result: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (e) {
    res.json({ error: e.message });
  }
});

app.listen(3000, () => console.log("Server running"));
