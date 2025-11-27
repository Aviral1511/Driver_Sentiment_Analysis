import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import connectDB from '../utils/db.js';
import User from '../models/User.js';

dotenv.config({
    path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env'),
});

async function seedUsers() {
    try {
        await connectDB();
        console.log("✅ Connected to MongoDB");
        await User.deleteMany({});

        const existing = await User.countDocuments();
        if (existing > 0) {
            console.log("⚠️ Users already exist. Aborting to avoid duplicates.");
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);

        const users = [
            // ✅ Super Admin
            {
                name: "System Admin",
                email: "admin@example.com",
                role: "admin",
                hash: await bcrypt.hash("Admin@123", salt),
            },
            // ✅ Staff / Ops
            {
                name: "Operations User",
                email: "ops1@example.com",
                role: "ops",
                hash: await bcrypt.hash("Ops@123", salt),
            },
            {
                name: "Support Team",
                email: "ops2@example.com",
                role: "ops",
                hash: await bcrypt.hash("Ops@123", salt),
            },
            // ✅ Normal users (riders)
            {
                name: "Rahul Mehta",
                email: "rahul@example.com",
                role: "rider",
                hash: await bcrypt.hash("rider@123", salt),
            },
            {
                name: "Priya Singh",
                email: "priya@example.com",
                role: "rider",
                hash: await bcrypt.hash("rider@123", salt),
            }
        ];

        await User.insertMany(users);

        console.log("✅ Seeded initial users:");
        console.table(
            users.map(u => ({
                email: u.email,
                role: u.role,
                hash: "(hidden)"
            }))
        );

        console.log(`
✅ LOGIN CREDENTIALS (for testing)
-----------------------------------
Admin Login:
  email: admin@example.com
  password: Admin@123

ops Login:
  email: ops1@example.com
  password: Ops@123

  email: ops2@example.com
  password: Ops@123

User Login:
  email: rahul@example.com
  password: User@123

  email: priya@example.com
  password: User@123
`);

        process.exit(0);

    } catch (err) {
        console.error("❌ Error seeding users:", err);
        process.exit(1);
    }
}

seedUsers();
