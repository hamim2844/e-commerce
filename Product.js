const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price must be above 0']
  },
  oldPrice: {
    type: Number,
    min: [0, 'Old price must be above 0']
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true
  },
  tags: {
    type: [String],
    enum: ['new', 'best', 'featured', 'sale', ''],
    default: ''
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock quantity must be above or equal to 0'],
    default: 0
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
      },
      comment: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  reviewCount: {
    type: Number,
    default: 0
  },
  images: [
    {
      type: String,
      required: true
    }
  ],
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create slug from name
ProductSchema.pre('save', function(next) {
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-');
  next();
});

// Calculate average rating
ProductSchema.methods.calculateAverageRating = function() {
  let totalRating = 0;
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.reviewCount = 0;
    return;
  }
  
  this.reviews.forEach(review => {
    totalRating += review.rating;
  });
  
  this.rating = +(totalRating / this.reviews.length).toFixed(1);
  this.reviewCount = this.reviews.length;
};

module.exports = mongoose.model('Product', ProductSchema); 