import { analyzeSentimentDetailed, classifySentiment } from '../services/sentiment.js';

export async function debugAnalyze(req, res) {
  const text = (req.query.text || '').trim();
  if (!text) return res.status(400).json({ error: 'text_required' });
  const detailed = analyzeSentimentDetailed(text);
  res.json(detailed);
}

// simple POST endpoint to mirror real behavior with optional stars
export async function classify(req, res) {
  const { text = '', stars } = req.body || {};
  if (!text || typeof text !== 'string') return res.status(400).json({ error: 'text_required' });
  const s = classifySentiment(text, typeof stars === 'number' ? stars : undefined);
  res.json(s);
}
