
import { calculateGoal } from '../lib/gemini.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const userInfo = req.body;
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

  if (!userInfo || !userInfo.age || !userInfo.gender || !userInfo.height || !userInfo.weight || !userInfo.activityLevel || !userInfo.goal) {
    return res.status(400).json({ error: 'Please provide all user profile fields.' });
  }

  try {
    const result = await calculateGoal(userInfo, apiKey);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in Vercel function:', error);
    res.status(500).json({ error: 'Could not calculate goal.' });
  }
}
