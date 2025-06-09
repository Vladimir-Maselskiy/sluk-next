import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
});

const UserModel = models.User || model('User', userSchema);

export default UserModel;
