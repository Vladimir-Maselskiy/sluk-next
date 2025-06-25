import { Schema, model, models } from 'mongoose';

const subscriptionSchema = new Schema(
  {
    isSubscription: {
      type: Boolean,
      default: false,
    },
    subscriptionStartedAt: {
      type: Date,
      default: null,
    },
    subscriptionExpiresAt: {
      type: Date,
      default: null,
    },
    stripePaymentIntentId: {
      type: String,
      default: null,
    },
  },
  { _id: false }
);

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

  subscription: {
    type: subscriptionSchema,
    default: {
      isSubscription: false,
      subscriptionStartedAt: null,
      subscriptionExpiresAt: null,
      stripePaymentIntentId: null,
    },
  },

  role: {
    type: String,
    default: 'user',
  },
});

const UserModel = models.User || model('User', userSchema);

export default UserModel;
