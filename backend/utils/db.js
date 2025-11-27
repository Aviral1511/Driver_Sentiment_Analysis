// backend/utils/db.js
import mongoose from 'mongoose';

mongoose.set('strictQuery', true);
// Disable buffering so models don't silently queue ops when disconnected
mongoose.set('bufferCommands', false);

const connectDB = async () => {
    const uri = process.env.MONGO_URI; // e.g. mongodb+srv://user:pass@cluster.yourid.mongodb.net/driver_sentiment?retryWrites=true&w=majority

  if (!uri) {
    throw new Error('MONGO_URL is missing in environment');
  }

  // Helpful timeouts while developing
  const opts = {
    serverSelectionTimeoutMS: 15000, // 15s to find a primary
    socketTimeoutMS: 30000,
    connectTimeoutMS: 15000,
    maxPoolSize: 10,
    // Mongoose 7+ uses TLS automatically with SRV URIs
  };

  try {
    const conn = await mongoose.connect(uri, opts);
    console.log('[mongo] connected to', conn.connection.host);
    console.log("MONGODB is fully working")
    return conn.connection;
  } catch (err) {
    console.error('[mongo] connection error:\n', err);
    throw err;
  }
}
export function onMongoEvents() {
  const conn = mongoose.connection;
  conn.on('disconnected', () => console.warn('[mongo] disconnected'));
  conn.on('reconnected', () => console.log('[mongo] reconnected'));
  conn.on('error', (e) => console.error('[mongo] error', e));
}

export default connectDB;
