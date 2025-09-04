// createAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/User.js"; // adjust path if different

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const email = "admin@gmail.com"; // ✅ your admin email
    const password = "admin123";       // ✅ your plain password
    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("❌ Admin already exists");
    } else {
      const admin = new User({
        username: "admin",
        email,
        password: hashedPassword,
        role: "admin",
      });
      await admin.save();
      console.log("✅ Admin user created!");
      console.log(`Email: ${email}`);
      console.log(`Password: ${password} (hashed in DB)`);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
