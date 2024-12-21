import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ταρακαλώ εισάγετε το όνομά σας'],
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
    enum: ['active', 'inactive', 'banned'],
    default: 'active'
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date,
  // Seller specific fields
  commission: {
    type: Number,
    min: 0,
    max: 100,
    default: 10
  },
  producers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producer'
  }],
  // Producer specific fields
  company: {
    name: String,
    vat: String,
    address: String,
    phone: String
  }
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;