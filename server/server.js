
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeMeal, calculateGoal } from '../lib/gemini.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// This server mimics the Vercel serverless environment for local development.
// In production, the api/analyze.js function is used instead.

// Limit body size (matching Vercel config roughly, though Express uses bytes/string)
app.use(express.json({ limit: '50mb' })); // Keep 50mb for local safety, or reduce to 5mb to match prod
app.use(cors());

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

if (!apiKey) {
  console.warn("Warning: GEMINI_API_KEY or API_KEY not set in environment variables.");
} else {
  console.log("API Key loaded successfully.");
}

app.post('/api/analyze', async (req, res) => {
  try {
    const { text, image } = req.body;
    
    if (!text && !image) {
      return res.status(400).json({ error: 'Please provide text or image.' });
    }

    const result = await analyzeMeal(text, image, apiKey);
    res.json(result);

  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Could not analyze meal." });
  }
});

app.post('/api/calculate-goal', async (req, res) => {
  try {
    const userInfo = req.body;
    
    if (!userInfo || !userInfo.age || !userInfo.gender || !userInfo.height || !userInfo.weight || !userInfo.activityLevel || !userInfo.goal) {
        return res.status(400).json({ error: 'Please provide all user profile fields.' });
    }

    const result = await calculateGoal(userInfo, apiKey);
    res.json(result);

  } catch (error) {
    console.error("Error processing goal calculation:", error);
    res.status(500).json({ error: "Could not calculate goal." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
