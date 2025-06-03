import { Schema, model, models } from 'mongoose';

const VerificationCodeSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600,
  },
});

const VerificationModel =
  models.VerificationCode || model('VerificationCode', VerificationCodeSchema);
export default VerificationModel;
