import mongoose, { Schema, Document } from 'mongoose';

export interface ProducerDocument extends Document {
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    region: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  categories: string[];
  images: string[];
  rating: number;
  reviewsCount: number;
  status: 'active' | 'pending' | 'inactive';
  verificationDocuments: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProducerSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    region: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  contactInfo: {
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    website: String
  },
  categories: [{
    type: String,
    required: true
  }],
  images: [{
    type: String
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'inactive'],
    default: 'pending'
  },
  verificationDocuments: [{
    type: String
  }]
}, {
  timestamps: true
});

// Indexes
ProducerSchema.index({ 'location.city': 1 });
ProducerSchema.index({ 'location.region': 1 });
ProducerSchema.index({ categories: 1 });
ProducerSchema.index({ status: 1 });

export default mongoose.model<ProducerDocument>('Producer', ProducerSchema); 