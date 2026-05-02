const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ ROOT TEST
app.get("/", (req, res) => {
  res.send("🚀 SERVER IS LIVE");
});

// ✅ HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// ✅ AI TEST ROUTE (SAFE PLACEHOLDER)
app.post("/ai", (req, res) => {
  const prompt = req.body?.prompt || "empty";

  res.json({
    result: "AI received: " + prompt
  });
});

// ✅ START SERVER (IMPORTANT)
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
