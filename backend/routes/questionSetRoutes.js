// routes/questionSetRoutes.js
import express from "express";
import {
  createSet,
  getMySets,
  getPublicSet,
  submitSetAnswers,
  getSetAnswers,
  updateSet,    
  deleteSet,
  getAllSets,      
  getAllAnswers,
} from "../controllers/questionSetController.js";
import authenticate from "../middleware/authMiddleware.js";

const router = express.Router();

// Authenticated routes
router.post("/", authenticate, createSet);
router.get("/", authenticate, getMySets);
router.put("/:id", authenticate, updateSet);    
router.delete("/:id", authenticate, deleteSet);

// Public routes
router.get("/:slug", getPublicSet);
router.post("/:slug/answers", submitSetAnswers);

// Public route: get all answers for a set
router.get("/:slug/answers", getSetAnswers);

// Admin/Global stats routes
router.get("/all/sets", getAllSets);       
router.get("/all/answers", getAllAnswers);

export default router;
