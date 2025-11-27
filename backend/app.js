import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js'

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

import authRoutes from './routes/authRoutes.js';
import configRoutes from './routes/configRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import driversRoutes from './routes/driversRoutes.js';
import jobsRoutes from './routes/jobsRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import workerRoutes from './routes/workerRoutes.js';
import sentimentRoutes from './routes/sentimentRoutes.js';
import { startFeedbackWorker } from './workers/feedbackWorker.js';

const PORT = process.env.PORT || 4000;

await connectDB();
app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`);
});
startFeedbackWorker();

app.use('/api/auth', authRoutes);
app.use('/api/config', configRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/drivers', driversRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/worker', workerRoutes);
app.use('/api/sentiment', sentimentRoutes);

export default app;
