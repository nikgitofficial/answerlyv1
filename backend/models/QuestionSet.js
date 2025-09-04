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
    isPublic: { type: Boolean, default: false },
    slug: { type: String, unique: true, default: () => nanoid(10) }, // ONE link for the whole set
  },
  { timestamps: true }
);

export default mongoose.model("QuestionSet", QuestionSetSchema);
