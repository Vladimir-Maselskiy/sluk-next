// models/TrialSession.js
import mongoose from 'mongoose';

const TrialSessionSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  userAgent: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.TrialSession ||
  mongoose.model('TrialSession', TrialSessionSchema);
