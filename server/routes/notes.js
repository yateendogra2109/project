const express = require('express');
const Note = require('../models/Note');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

// @route   GET /api/notes
// @desc    Get all notes for the authenticated user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { category, type, search, page = 1, limit = 50 } = req.query;
    
    // Build query
    const query = { user: req.user._id };
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const notes = await Note.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Note.countDocuments(query);

    res.json({
      notes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ 
      message: 'Server error fetching notes' 
    });
  }
});

// @route   GET /api/notes/recent
// @desc    Get recent notes (last 7 days)
// @access  Private
router.get('/recent', async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const notes = await Note.find({
      user: req.user._id,
      updatedAt: { $gte: sevenDaysAgo }
    })
    .sort({ updatedAt: -1 })
    .limit(10);

    res.json({ notes });
  } catch (error) {
    console.error('Get recent notes error:', error);
    res.status(500).json({ 
      message: 'Server error fetching recent notes' 
    });
  }
});

// @route   GET /api/notes/stats
// @desc    Get notes statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const stats = await Note.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalNotes: { $sum: 1 },
          shortNotes: {
            $sum: { $cond: [{ $eq: ['$type', 'short'] }, 1, 0] }
          },
          longNotes: {
            $sum: { $cond: [{ $eq: ['$type', 'long'] }, 1, 0] }
          },
          completedNotes: {
            $sum: { $cond: ['$isCompleted', 1, 0] }
          }
        }
      }
    ]);

    const categoryStats = await Note.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      stats: stats[0] || {
        totalNotes: 0,
        shortNotes: 0,
        longNotes: 0,
        completedNotes: 0
      },
      categoryStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      message: 'Server error fetching statistics' 
    });
  }
});

// @route   GET /api/notes/:id
// @desc    Get a specific note
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!note) {
      return res.status(404).json({ 
        message: 'Note not found' 
      });
    }

    res.json({ note });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ 
      message: 'Server error fetching note' 
    });
  }
});

// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, content, category, priority, reminder, tags } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({ 
        message: 'Title and content are required' 
      });
    }

    // Create note
    const note = new Note({
      title,
      content,
      category: category || 'Personal',
      priority: priority || 'medium',
      reminder: reminder ? new Date(reminder) : null,
      tags: tags || [],
      user: req.user._id
    });

    await note.save();

    // Create category if it doesn't exist
    if (category && category !== 'Personal') {
      const existingCategory = await Category.findOne({
        name: category,
        user: req.user._id
      });

      if (!existingCategory) {
        const newCategory = new Category({
          name: category,
          user: req.user._id
        });
        await newCategory.save();
      }
    }

    res.status(201).json({
      message: 'Note created successfully',
      note
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ 
      message: 'Server error creating note' 
    });
  }
});

// @route   PUT /api/notes/:id
// @desc    Update a note
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { title, content, category, priority, reminder, tags, isCompleted } = req.body;

    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!note) {
      return res.status(404).json({ 
        message: 'Note not found' 
      });
    }

    // Update fields
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (category !== undefined) note.category = category;
    if (priority !== undefined) note.priority = priority;
    if (reminder !== undefined) note.reminder = reminder ? new Date(reminder) : null;
    if (tags !== undefined) note.tags = tags;
    if (isCompleted !== undefined) note.isCompleted = isCompleted;

    await note.save();

    // Create category if it doesn't exist
    if (category && category !== 'Personal') {
      const existingCategory = await Category.findOne({
        name: category,
        user: req.user._id
      });

      if (!existingCategory) {
        const newCategory = new Category({
          name: category,
          user: req.user._id
        });
        await newCategory.save();
      }
    }

    res.json({
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ 
      message: 'Server error updating note' 
    });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!note) {
      return res.status(404).json({ 
        message: 'Note not found' 
      });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.json({ 
      message: 'Note deleted successfully' 
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ 
      message: 'Server error deleting note' 
    });
  }
});

// @route   POST /api/notes/bulk-delete
// @desc    Delete multiple notes
// @access  Private
router.post('/bulk-delete', async (req, res) => {
  try {
    const { noteIds } = req.body;

    if (!noteIds || !Array.isArray(noteIds)) {
      return res.status(400).json({ 
        message: 'Note IDs array is required' 
      });
    }

    const result = await Note.deleteMany({
      _id: { $in: noteIds },
      user: req.user._id
    });

    res.json({
      message: `${result.deletedCount} notes deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ 
      message: 'Server error deleting notes' 
    });
  }
});

module.exports = router;