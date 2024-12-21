import mongoose from 'mongoose';
import { ProductDocument, ProductStatus, ProductUnit, ProductCategory } from '../../src/types/models/product.types';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Παρακαλώ εισάγετε όνομα προϊόντος'],
    trim: true,
    maxlength: [100, 'Το όνομα δεν μπορεί να υπερβαίνει τους 100 χαρακτήρες']
  },
  description: {
    type: String,
    required: [true, 'Παρακαλώ εισάγετε περιγραφή προϊόντος'],
    maxlength: [2000, 'Η περιγραφή δεν μπορεί να υπερβαίνει τους 2000 χαρακτήρες']
  },
  price: {
    type: Number,
    required: [true, 'Παρακαλώ εισάγετε τιμή'],
    min: [0, 'Η τιμή δεν μπορεί να είναι αρνητική']
  },
  stock: {
    type: Number,
    required: [true, 'Παρακαλώ εισάγετε διαθέσιμη ποσότητα'],
    min: [0, 'Το απόθεμα δεν μπορεί να είναι αρνητικό'],
    default: 0
  },
  category: {
    type: String,
    enum: Object.values(ProductCategory),
    required: [true, 'Παρακαλώ επιλέξτε κατηγορία']
  },
  unit: {
    type: String,
    enum: Object.values(ProductUnit),
    required: [true, 'Παρακαλώ επιλέξτε μονάδα μέτρησης']
  },
  status: {
    type: String,
    enum: Object.values(ProductStatus),
    default: ProductStatus.Draft
  },
  producerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producer',
    required: [true, 'Παρακαλώ επιλέξτε παραγωγό']
  },
  images: [{
    id: String,
    url: {
      type: String,
      required: [true, 'Παρακαλώ προσθέστε URL εικόνας']
    },
    alt: String,
    isPrimary: Boolean,
    order: Number
  }],
  variants: [{
    id: String,
    name: {
      type: String,
      required: [true, 'Παρακαλώ εισάγετε όνομα παραλλαγής']
    },
    sku: {
      type: String,
      unique: true,
      sparse: true
    },
    price: {
      type: Number,
      required: [true, 'Παρακαλώ εισάγετε τιμή παραλλαγής'],
      min: 0
    },
    stock: {
      type: Number,
      required: [true, 'Παρακαλώ εισάγετε απόθεμα παραλλαγής'],
      min: 0
    },
    unit: {
      type: String,
      enum: Object.values(ProductUnit),
      required: [true, 'Παρακαλώ επιλέξτε μονάδα μέτρησης παραλλαγής']
    },
    attributes: {
      type: Map,
      of: String
    }
  }],
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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
    title: {
      type: String,
      maxlength: [60, 'Ο τίτλος SEO δεν μπορεί να υπερβαίνει τους 60 χαρακτήρες']
    },
    description: {
      type: String,
      maxlength: [160, 'Η περιγραφή SEO δεν μπορεί να υπερβαίνει τους 160 χαρακτήρες']
    },
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
  promotionPrice: {
    type: Number,
    min: [0, 'Η τιμή προσφοράς δεν μπορεί να είναι αρνητική'],
    validate: {
      validator: function(this: ProductDocument, value: number) {
        return !value || value < this.price;
      },
      message: 'Η τιμή προσφοράς πρέπει να είναι μικρότερη από την κανονική τιμή'
    }
  },
  promotionEndsAt: Date,
  minimumOrder: {
    type: Number,
    min: [0, 'Η ελάχιστη ποσότητα παραγγελίας δεν μπορεί να είναι αρνητική']
  },
  maximumOrder: {
    type: Number,
    validate: {
      validator: function(this: ProductDocument, value: number) {
        return !value || !this.minimumOrder || value > this.minimumOrder;
      },
      message: 'Η μέγιστη ποσότητα παραγγελίας πρέπει να είναι μεγαλύτερη από την ελάχιστη'
    }
  },
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Αυτόματη ενημέρωση του status βάσει του stock
productSchema.pre('save', function(this: ProductDocument, next) {
  if (this.stock === 0 && this.status !== ProductStatus.Draft) {
    this.status = ProductStatus.OutOfStock;
  }
  next();
});

// Υπολογισμός μέσης βαθμολογίας πριν την αποθήκευση
productSchema.pre('save', function(this: ProductDocument, next) {
  if (this.reviews?.length) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = totalRating / this.reviews.length;
    this.reviewsCount = this.reviews.length;
  }
  next();
});

// Έλεγχος τιμής προσφοράς και ημερομηνίας λήξης
productSchema.pre('save', function(this: ProductDocument, next) {
  if (this.isPromoted) {
    if (!this.promotionPrice) {
      throw new Error('Η τιμή προσφοράς είναι υποχρεωτική όταν το προϊόν είναι σε προσφορά');
    }
    if (!this.promotionEndsAt) {
      throw new Error('Η ημερομηνία λήξης προσφοράς είναι υποχρεωτική όταν το προϊόν είναι σε προσφορά');
    }
    if (this.promotionEndsAt < new Date()) {
      this.isPromoted = false;
      this.promotionPrice = undefined;
      this.promotionEndsAt = undefined;
    }
  }
  next();
});

export default mongoose.model<ProductDocument>('Product', productSchema);