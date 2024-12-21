import mongoose from 'mongoose';
import { ProducerDocument, ProducerStatus } from '../../src/types/models/producer.types';

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
    ref: 'User',
    required: [true, 'Ο πωλητής είναι υποχρεωτικός']
  },
  commission: {
    type: Number,
    min: 0,
    max: 100,
    default: 10
  },
  status: {
    type: String,
    enum: Object.values(ProducerStatus),
    default: ProducerStatus.Active
  },
  profileImage: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual για υπολογισμό αριθμού προϊόντων
producerSchema.virtual('productsCount').get(function(this: ProducerDocument) {
  return this.products ? this.products.length : 0;
});

const Producer = mongoose.model<ProducerDocument>('Producer', producerSchema);

export default Producer;
