import { Schema, model, models } from 'mongoose';

const PasswordResetTokenSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
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

const PasswordResetToken =
  models.PasswordResetToken || model('PasswordResetToken', PasswordResetTokenSchema);

export default PasswordResetToken;
