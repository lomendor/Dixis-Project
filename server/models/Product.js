import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Παρακαλώ εισάγετε όνομα προϊόντος'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Παρακαλώ εισάγετε περιγραφή προϊόντος']
  },
  price: {
    type: Number,
    required: [true, 'Παρακαλώ εισάγετε τιμή'],
    min: 0
  },
  stock: {
    type: Number,
    required: [true, 'Παρακαλώ εισάγετε διαθέσιμη ποσότητα'],
    min: 0,
    default: 0
  },
  images: [{
    type: String,
    required: [true, 'Παρακαλώ προσθέστε τουλάχιστον μία εικόνα']
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Παρακαλώ επιλέξτε κατηγορία']
  },
  producer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Παρακαλώ επιλέξτε παραγωγό']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'draft'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;