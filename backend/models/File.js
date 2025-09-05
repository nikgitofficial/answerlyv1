import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: String,
  url: String,
  public_id: String,
  type: String,
  resource_type: String, // e.g., 'raw', 'image', 'video'
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

export default mongoose.model('File', fileSchema);
