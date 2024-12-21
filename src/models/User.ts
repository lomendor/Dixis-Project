import { z } from 'zod';
import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Zod schema για validation
export const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(['user', 'admin', 'seller']).default('user'),
  isEmailVerified: z.boolean(),
  verificationToken: z.string().nullable(),
  verificationTokenExpires: z.date().nullable(),
  resetPasswordToken: z.string().nullable(),
  resetPasswordExpires: z.date().nullable(),
  lastLogin: z.date().optional(),
  managedProducers: z.array(z.string()).optional(),
  refreshToken: z.string().nullable()
});

// Base interface from Zod schema
export type User = z.infer<typeof UserSchema>;

// Methods interface
export interface UserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  createVerificationToken(): string;
  createPasswordResetToken(): string;
}

// Document type combining both
export interface UserDocument extends Document, User, UserMethods {}

// Model type
export interface UserModel extends Model<UserDocument> {}

// Schema definition
const userSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'seller'],
    default: 'user'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    default: null
  },
  verificationTokenExpires: {
    type: Date,
    default: null
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },
  lastLogin: Date,
  managedProducers: [{
    type: Schema.Types.ObjectId,
    ref: 'Producer'
  }],
  refreshToken: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Add methods
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createVerificationToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.verificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  this.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return token;
};

userSchema.methods.createPasswordResetToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  this.resetPasswordExpires = new Date(Date.now() + 1 * 60 * 60 * 1000);
  return token;
};

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model<UserDocument, UserModel>('User', userSchema); 