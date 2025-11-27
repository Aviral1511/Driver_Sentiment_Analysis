// scripts/seedDrivers.js (example path)
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../utils/db.js';
import Driver from '../models/Driver.js';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (adjust if your .env lives elsewhere)
dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

// Guard: ensure URI exists
if (!process.env.MONGO_URI) {
  console.error('❌ MONGODB_URI is missing. Check your .env path and variable name.');
  process.exit(1);
}

const driverNames = [
  "Amit Sharma", "Vikram Singh", "Rohit Kumar", "Sandeep Yadav", "Aditya Verma",
  "Rajesh Gupta", "Deepak Mishra", "Harsh Tiwari", "Sachin Chauhan", "Naveen Joshi",
  "Pankaj Soni", "Arun Shukla", "Suresh Reddy", "Mahesh Naik", "Kiran Patel",
  "Farhan Ali", "Imran Khan", "Zubair Ahmad", "Faiz Sheikh", "Sahil Malik",
  "Rohan Mehta", "Pranav Desai", "Jay Patel", "Rakesh Pawar", "Ashok Gaikwad",
  "Devendra Jadhav", "Kailash Jain", "Naman Bansal", "Lakshay Arora", "Ankit Mathur"
];

// Generate random Indian mobile number as a STRING (to preserve leading zeros/prefixes)
function randomPhone() {
  const prefixes = ["98", "97", "99", "89", "90", "88", "62", "67", "87", "83", "71", "76"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const rest = String(Math.floor(10000000 + Math.random() * 90000000));
  return prefix + rest; // length 10
}

async function seedDrivers() {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");
    await Driver.deleteMany({});

    // Fast check: if anything exists, bail
    const count = await Driver.estimatedDocumentCount();
    if (count > 0) {
      console.log(`⚠️ Drivers already exist (${count}). Aborting to avoid duplicates.`);
      return;
    }

    // If your schema defines defaults for stats, prefer omitting it entirely.
    // Otherwise ensure the shape matches and avoid null for required Date fields.
    const toInsert = driverNames.map((name) => ({
      name,
      phone: randomPhone(),
      stats: { n: 0, avg: 0 }, // omit lastUpdatedAt if your schema sets it later
    }));

    // Use ordered:false so a single duplicate (E11000) doesn't abort the entire batch.
    const result = await Driver.insertMany(toInsert, { ordered: false });
    console.log(`✅ Successfully inserted ${result.length} drivers.`);
  } catch (err) {
    // Helpful diagnostics
    if (err?.code === 11000) {
      console.error('❌ Duplicate key error (E11000). Likely a unique index (e.g., phone).');
      console.error('   Details:', err.keyValue || err.message);
    } else {
      console.error('❌ Error seeding drivers:', err?.message || err);
    }
  } finally {
    // Always close connection so the process can exit cleanly
    await mongoose.connection.close().catch(() => {});
    process.exit(0);
  }
}

seedDrivers();
