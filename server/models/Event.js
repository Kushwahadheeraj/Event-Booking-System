const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Please add a category'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
  },
  duration: {
    type: String,
    required: [true, 'Please add duration'], 
  },
  venue: {
    type: String,
    required: [true, 'Please add a venue'],
  },
  availableSeats: {
    type: Number,
    required: [true, 'Please add available seats'],
    min: [0, 'Available seats cannot be negative'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Event', eventSchema);
