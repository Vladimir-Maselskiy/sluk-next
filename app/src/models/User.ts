import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  registeredAt: {
    type: Date,
    default: Date.now,
  },

  trialStartedAt: {
    type: Date,
    default: null,
  },

  hasSubscription: {
    type: Boolean,
    default: false,
  },

  subscriptionExpiresAt: {
    type: Date,
    default: null,
  },

  role: {
    type: String,
    default: 'user',
  },
});

const UserModel = models.User || model('User', userSchema);

export default UserModel;
