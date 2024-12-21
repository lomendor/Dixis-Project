import mongoose from 'mongoose';

const producerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Το όνομα είναι υποχρεωτικό'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Το email είναι υποχρεωτικό'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: { type: String, default: 'Ελλάδα' }
  },
  company: {
    name: String,
    vat: String,
    description: String
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  commission: {
    type: Number,
    min: 0,
    max: 100,
    default: 10
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  profileImage: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual για υπολογισμό αριθμού προϊόντων
producerSchema.virtual('productsCount').get(function() {
  return this.products ? this.products.length : 0;
});

const Producer = mongoose.model('Producer', producerSchema);

export default Producer; 