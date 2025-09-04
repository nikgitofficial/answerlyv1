import express from 'express';
import upload from '../middleware/cloudinaryStorage.js';
import { uploadProfilePic } from '../controllers/profilePicController.js';
import authenticate from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/upload-profile-pic',authenticate, upload.single('profilePic'), uploadProfilePic);

export default router;