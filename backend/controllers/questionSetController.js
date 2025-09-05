import QuestionSet from "../models/QuestionSet.js";
import Answer from "../models/Answer.js";

// ✅ Create a new set
export const createSet = async (req, res) => {
  try {
    const { title, questions, isPublic, timeLimit } = req.body;
    const newSet = new QuestionSet({
      user: req.user.id,
      title,
      questions,
      isPublic: isPublic || false,
      timeLimit: timeLimit || 60, // <-- save timer
    });
    await newSet.save();
    res.status(201).json(newSet);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Update a set
export const updateSet = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, questions, isPublic, timeLimit } = req.body;

    const set = await QuestionSet.findById(id);
    if (!set) return res.status(404).json({ msg: "Set not found" });
    if (set.user.toString() !== req.user.id) return res.status(403).json({ msg: "Unauthorized" });

    set.title = title || set.title;
    set.questions = questions || set.questions;
    set.isPublic = isPublic !== undefined ? isPublic : set.isPublic;
    set.timeLimit = timeLimit || set.timeLimit; // <-- update timer

    await set.save();
    res.json(set);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// delete a set
export const deleteSet = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the set
    const set = await QuestionSet.findById(id);
    if (!set) {
      console.error(`Delete failed: Set not found with id ${id}`);
      return res.status(404).json({ msg: "Set not found" });
    }

    // Check ownership
    const userId = req.user.id || req.userId; // support both
    if (!userId) {
      console.error("Delete failed: User ID missing in request");
      return res.status(401).json({ msg: "Unauthorized. User ID missing." });
    }

    if (set.user.toString() !== userId) {
      console.error(
        `Delete failed: User ${userId} is not owner of set ${id} (owner: ${set.user})`
      );
      return res.status(403).json({ msg: "Unauthorized. Not the set owner." });
    }

    // Delete
    await set.deleteOne();
    console.log(`Set ${id} deleted by user ${userId}`);
    res.json({ msg: "Set deleted successfully" });
  } catch (err) {
    console.error(`DeleteSet error: ${err.message}`, err);
    res.status(500).json({ msg: "Server error: " + err.message });
  }
};

// ✅ Get all sets for a user
export const getMySets = async (req, res) => {
  try {
    const sets = await QuestionSet.find({ user: req.user.id });
    res.status(200).json(sets);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Public: get set by slug
export const getPublicSet = async (req, res) => {
  try {
    const { slug } = req.params;
    const set = await QuestionSet.findOne({ slug, isPublic: true });
    if (!set) return res.status(404).json({ msg: "Set not found" });
    res.json(set);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Public: submit answers to a set (with userName)
export const submitSetAnswers = async (req, res) => {
  try {
    const { slug } = req.params;
    const { answers, userName } = req.body; // <-- get name

    const set = await QuestionSet.findOne({ slug, isPublic: true });
    if (!set) return res.status(404).json({ msg: "Set not found" });

    const newAnswer = new Answer({
      user: req.user ? req.user.id : null, 
      userName: userName || "Anonymous", // <-- store name
      set: set._id,
      answer: answers,
    });

    await newAnswer.save();
    res.status(201).json({ msg: "Answers submitted!" });
  } catch (err) {
    console.error("SubmitSetAnswers error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Get all answers for a specific set
export const getSetAnswers = async (req, res) => {
  try {
    const { slug } = req.params;
    const set = await QuestionSet.findOne({ slug });
    if (!set) return res.status(404).json({ msg: "Set not found" });

    const answers = await Answer.find({ set: set._id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ set, answers });
  } catch (err) {
    console.error("GetSetAnswers error:", err);
    res.status(500).json({ msg: err.message });
  }
};


// ✅ Admin: get ALL sets (for dashboard totals)
export const getAllSets = async (req, res) => {
  try {
    const sets = await QuestionSet.find();
    res.status(200).json(sets);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Admin: get ALL answers (for dashboard totals)
export const getAllAnswers = async (req, res) => {
  try {
    const answers = await Answer.find();
    res.status(200).json(answers);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};