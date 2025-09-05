// models/QuestionSet.js
import mongoose from "mongoose";
import { nanoid } from "nanoid";

const QuestionSetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    questions: [
      {
        text: { type: String, required: true },
        options: [{ type: String }],
        answer: { type: String },
      },
    ],
    timeLimit: { type: Number, default: 60 }, // <-- NEW field
    isPublic: { type: Boolean, default: false },
    slug: { type: String, unique: true, default: () => nanoid(10) },
  },
  { timestamps: true }
);


export default mongoose.model("QuestionSet", QuestionSetSchema);
