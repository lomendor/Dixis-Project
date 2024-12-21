import mongoose, { Schema, Document } from 'mongoose';

export interface ProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  producer: mongoose.Types.ObjectId;
  images: string[];
  unit: string;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  rating: number;
  reviewsCount: number;
  sales: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  producer: {
    type: Schema.Types.ObjectId,
    ref: 'Producer',
    required: true
  },
  images: [{
    type: String
  }],
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'gr', 'lt', 'piece']
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock'],
    default: 'active'
  },
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
  sales: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Αυτόματη ενημέρωση του status βάσει του stock
ProductSchema.pre('save', function(next) {
  if (this.stock === 0) {
    this.status = 'out_of_stock';
  }
  next();
});

export default mongoose.model<ProductDocument>('Product', ProductSchema); 