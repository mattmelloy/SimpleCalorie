
import { analyzeMeal } from '../lib/gemini.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { text, image } = req.body;
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

  if (!text && !image) {
    return res.status(400).json({ error: 'Please provide text or image.' });
  }

  try {
    const result = await analyzeMeal(text, image, apiKey);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in Vercel function:', error);
    res.status(500).json({ error: 'Could not analyze meal.' });
  }
}
