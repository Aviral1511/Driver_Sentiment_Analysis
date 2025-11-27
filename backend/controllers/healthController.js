import mongoose from 'mongoose';

export async function health(req, res) {
  const mongo = mongoose.connection?.readyState === 1 ? 'ok' : 'down';
  res.json({ ok: true, mongo });
}
