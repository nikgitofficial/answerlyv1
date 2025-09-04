import express from "express";
import User from "../models/User.js";
import QuestionSet from "../models/QuestionSet.js";
import Answer from "../models/Answer.js";

const router = express.Router();

// GET stats route (existing)
router.get("/stats", async (req, res) => {
  try {
    const users = await User.find().select("username email createdAt"); 
    const questions = await QuestionSet.find().select("title createdAt");
    const answers = await Answer.find()
      .select("answer userName createdAt")
      .populate("user", "username")
      .populate("question", "title");

    res.json({
      totalUsers: users.length,
      totalQuestions: questions.length,
      totalAnswers: answers.length,
      users,
      questions,
      answers,
    });
  } catch (err) {
    console.error("Error fetching stats:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE all answers
router.delete("/answers", async (req, res) => {
  try {
    const result = await Answer.deleteMany({});
    res.json({ message: `Deleted ${result.deletedCount} answers.` });
  } catch (err) {
    console.error("Error deleting answers:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
