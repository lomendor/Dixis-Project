const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Το όνομα προϊόντος είναι υποχρεωτικό'],
    trim: true,
    maxLength: [100, 'Το όνομα δεν μπορεί να υπερβαίνει τους 100 χαρακτήρες']
  },
  description: {
    type: String,
    required: [true, 'Η περιγραφή είναι υποχρεωτική'],
    trim: true,
    maxLength: [2000, 'Η περιγραφή δεν μπορεί να υπερβαίνει τους 2000 χαρακτήρες']
  },
  price: {
    type: Number,
    required: [true, 'Η τιμή είναι υποχρεωτική'],
    min: [0, 'Η τιμή δεν μπορεί να είναι αρνητική']
  },
  stock: {
    type: Number,
    required: [true, 'Το απόθεμα είναι υποχρεωτικό'],
    min: [0, 'Το απόθεμα δεν μπορεί να είναι αρνητικό'],
    default: 0
  },
  images: [{
    type: String,
    required: [true, 'Τουλάχιστον μία εικόνα είναι υποχρεωτική']
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Η κατηγορία είναι υποχρεωτική']
  },
  producerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Ο παραγωγός είναι υποχρεωτικός']
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive', 'outOfStock'],
      message: 'Μη έγκυρη κατάσταση προϊόντος'
    },
    default: 'active'
  },
  commission: {
    type: Number,
    required: [true, 'Το ποσοστό προμήθειας είναι υποχρεωτικό'],
    min: [0, 'Το ποσοστό προμήθειας δεν μπορεί να είναι αρνητικό'],
    max: [100, 'Το ποσοστό προμήθειας δεν μπορεί να υπερβαίνει το 100%'],
    default: 15
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field for final price including commission
productSchema.virtual('finalPrice').get(function() {
  return this.price * (1 + this.commission / 100);
});

// Index for text search
productSchema.index({ name: 'text', description: 'text' });

// Pre-save middleware to update status based on stock
productSchema.pre('save', function(next) {
  if (this.stock === 0) {
    this.status = 'outOfStock';
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);