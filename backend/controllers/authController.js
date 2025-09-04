import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { createAccessToken, createRefreshToken } from "../utils/tokenUtils.js";

export const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  // ✅ Password validation
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^])[A-Za-z\d@$!%*#?&^]{8,}$/;
  // Minimum 8 chars, at least 1 letter, 1 number, 1 special char
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ msg: "Password must be at least 8 characters long and include letters, numbers, and special characters." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already in use" }); // ✅ friendly message
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      username, 
      email, 
      password: hashed, 
      role: role || "user" 
    });
    await newUser.save();

    res.status(201).json({ msg: "Registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};



export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Invalid credentials" });

  const payload = { id: user._id, username: user.username, role: user.role }; // ✅ include role
  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);

  res.json({ accessToken, refreshToken });
};


export const refresh = (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("❌ No refresh token in header");
    return res.status(401).json({ msg: "No refresh token provided" });
  }

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      console.log("❌ Refresh token invalid:", err.message);
      return res.sendStatus(403);
    }

    const newAccessToken = createAccessToken({ id: user.id, username: user.username });
    console.log("✅ Refresh successful");
    res.json({ accessToken: newAccessToken });
  });
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Auth me error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const logout = (req, res) => {
  res.json({ msg: "Logged out" }); // No cookie to clear
};

export const updateUsername = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username } = req.body;

    if (!username) return res.status(400).json({ message: "Username is required" });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username },
      { new: true }
    );

    res.json({ user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};