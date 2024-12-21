import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserDocument } from '../../src/types/models/user.types';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Παρακαλώ εισάγετε το όνομά σας'],
    trim: true,
    minlength: [2, 'Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες']
  },
  email: {
    type: String,
    required: [true, 'Παρακαλώ εισάγετε το email σας'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Παρακαλώ εισάγετε ένα έγκυρο email']
  },
  password: {
    type: String,
    required: [true, 'Παρακαλώ εισάγετε έναν κωδικό'],
    minlength: [6, 'Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'seller', 'producer', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  bio: String,
  location: String,
  phone: String,
  managedProducers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producer'
  }],
  settings: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    language: { type: String, default: 'el' },
    currency: { type: String, default: 'EUR' },
    timezone: { type: String, default: 'Europe/Athens' }
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: true }
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
}, {
  timestamps: true
});

// Encrypt password before saving
userSchema.pre('save', async function(this: UserDocument, next) {
  if (!this.isModified('password')) {
    next();
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password
userSchema.methods.comparePassword = async function(this: UserDocument, enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<UserDocument>('User', userSchema);
