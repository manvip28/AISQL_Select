const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use(cors()); // Allows frontend to access this backend

const FLASK_SERVER_URL = "http://localhost:5002/generate_sql"; // Flask backend

app.post("/generate_sql", async (req, res) => {
  try {
    const { query, tables } = req.body;

    // Forward request to Flask
    const flaskResponse = await fetch(FLASK_SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, tables }),
    });

    const flaskData = await flaskResponse.json();
    
    // Send Flask's response back to React frontend
    res.json(flaskData);
  } catch (error) {
    console.error("Error forwarding request to Flask:", error);
    res.status(500).json({ error: "Failed to process request in Node.js" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Node.js server running on http://localhost:${PORT}`);
});
