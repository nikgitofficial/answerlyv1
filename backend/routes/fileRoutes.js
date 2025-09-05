import express from 'express';
import { uploadFile, getUserFiles, deleteFile, updateFileName, getFileById, downloadFile } from '../controllers/fileController.js';
import authenticate from "../middleware/authMiddleware.js";
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Upload
router.post('/upload', authenticate, upload.single('file'), uploadFile);

// Download (before :id)
router.get('/download/:id', authenticate, downloadFile);

// Get all user files
router.get('/', authenticate, getUserFiles);

// Get file by ID
router.get('/:id', authenticate, getFileById);

// Delete file
router.delete('/:id', authenticate, deleteFile);

// Update filename
router.put('/:id', authenticate, updateFileName);

export default router;
