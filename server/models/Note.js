const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  category: {
    type: String,
    required: true,
    default: 'Personal'
  },
  type: {
    type: String,
    enum: ['short', 'long'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  reminder: {
    type: Date,
    default: null
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Automatically determine note type based on content length
noteSchema.pre('save', function(next) {
  this.type = this.content.length > 200 ? 'long' : 'short';
  next();
});

// Index for better search performance
noteSchema.index({ user: 1, createdAt: -1 });
noteSchema.index({ user: 1, category: 1 });
noteSchema.index({ user: 1, title: 'text', content: 'text' });

module.exports = mongoose.model('Note', noteSchema);