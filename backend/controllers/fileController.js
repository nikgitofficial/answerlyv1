import cloudinary from '../utils/cloudinary.js';
import File from '../models/File.js';
import { Readable } from 'stream';
import mongoose from 'mongoose';

// 📤 Upload File
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const bufferToStream = buffer => {
      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);
      return readable;
    };

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: req.file.mimetype.startsWith('image/') ? 'image' : 'raw',
        folder: 'file_uploads_answerly',
        use_filename: true,
        unique_filename: false,
        public_id: `uploads/${req.file.originalname.split('.').slice(0, -1).join('.')}`,
        access_mode: 'public',
      },
      async (error, result) => {
        if (error) return res.status(500).json({ error: 'Upload failed' });

        const file = await File.create({
          filename: req.file.originalname,
          url: result.secure_url,
          public_id: result.public_id,
          type: req.file.mimetype,
          resource_type: result.resource_type,
          userId: req.userId,
        });

        res.status(201).json(file);
      }
    );

    bufferToStream(req.file.buffer).pipe(stream);
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
};

// 🗑️ Delete File
export const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(fileId)) return res.status(400).json({ error: 'Invalid file ID' });

    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });
    if (file.userId?.toString() !== req.userId?.toString()) return res.status(403).json({ error: 'Unauthorized' });

    if (file.public_id) {
      try { await cloudinary.uploader.destroy(file.public_id, { resource_type: file.resource_type || 'auto' }); }
      catch { /* ignore Cloudinary delete error */ }
    }

    await File.findByIdAndDelete(fileId);
    res.status(200).json({ message: 'File deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete file' });
  }
};

// 📄 Get User Files
export const getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(files);
  } catch {
    res.status(500).json({ error: 'Failed to retrieve files' });
  }
};

// ✏️ Update Filename
export const updateFileName = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });
    if (file.userId.toString() !== req.userId) return res.status(403).json({ error: 'Unauthorized' });

    file.filename = req.body.filename || file.filename;
    await file.save();
    res.status(200).json({ message: 'Filename updated', file });
  } catch {
    res.status(500).json({ error: 'Failed to update file' });
  }
};

// 📄 Get File by ID
export const getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });
    if (file.userId.toString() !== req.userId) return res.status(403).json({ error: 'Unauthorized access' });
    res.status(200).json(file);
  } catch {
    res.status(500).json({ error: 'Failed to retrieve file' });
  }
};

// 📥 Download File (Signed URL)
export const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });
    if (file.userId.toString() !== req.userId) return res.status(403).json({ error: 'Unauthorized access' });

    const signedUrl = cloudinary.utils.private_download_url(
      file.public_id,
      null,
      { type: 'upload', resource_type: file.resource_type || 'auto', attachment: true, expires_at: Math.floor(Date.now() / 1000) + 60, filename_override: file.filename }
    );
    res.status(200).json({ url: signedUrl });
  } catch {
    res.status(500).json({ error: 'Failed to generate download link' });
  }
};
