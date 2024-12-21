import mongoose, { Schema } from 'mongoose';
import { ProductDocument, ProductStatus, ProductUnit, ProductCategory } from '@/types/models/product.types';

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
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  category: {
    type: String,
    required: true,
    enum: Object.values(ProductCategory)
  },
  unit: {
    type: String,
    required: true,
    enum: Object.values(ProductUnit)
  },
  status: {
    type: String,
    enum: Object.values(ProductStatus),
    default: ProductStatus.Active
  },
  producerId: {
    type: Schema.Types.ObjectId,
    ref: 'Producer',
    required: true
  },
  images: [{
    id: String,
    url: String,
    alt: String,
    isPrimary: Boolean,
    order: Number
  }],
  variants: [{
    id: String,
    name: String,
    sku: String,
    price: Number,
    stock: Number,
    unit: {
      type: String,
      enum: Object.values(ProductUnit)
    },
    attributes: {
      type: Map,
      of: String
    }
  }],
  reviews: [{
    userId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: Date
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
  seo: {
    title: String,
    description: String,
    slug: {
      type: String,
      unique: true,
      sparse: true
    },
    keywords: [String]
  },
  isPromoted: {
    type: Boolean,
    default: false
  },
  promotionPrice: Number,
  promotionEndsAt: Date,
  minimumOrder: {
    type: Number,
    min: 0
  },
  maximumOrder: Number,
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  sales: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Αυτόματη ενημέρωση του status βάσει του stock
ProductSchema.pre('save', function(this: ProductDocument, next) {
  if (this.stock === 0 && this.status !== ProductStatus.Draft) {
    this.status = ProductStatus.OutOfStock;
  }
  next();
});

export default mongoose.model<ProductDocument>('Product', ProductSchema); 