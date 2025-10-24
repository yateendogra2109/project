const express = require('express');
const Category = require('../models/Category');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

// @route   GET /api/categories
// @desc    Get all categories for the authenticated user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id })
      .sort({ name: 1 });

    // Get note counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const noteCount = await Note.countDocuments({
          user: req.user._id,
          category: category.name
        });
        
        return {
          ...category.toObject(),
          noteCount
        };
      })
    );

    // Add default categories if they don't exist
    const defaultCategories = ['Personal', 'Work', 'Ideas', 'Shopping', 'Health'];
    const existingCategoryNames = categories.map(cat => cat.name);
    
    const defaultCategoriesWithCounts = await Promise.all(
      defaultCategories
        .filter(name => !existingCategoryNames.includes(name))
        .map(async (name) => {
          const noteCount = await Note.countDocuments({
            user: req.user._id,
            category: name
          });
          
          return {
            _id: `default-${name}`,
            name,
            color: getDefaultColor(name),
            icon: getDefaultIcon(name),
            noteCount,
            isDefault: true
          };
        })
    );

    const allCategories = [...categoriesWithCounts, ...defaultCategoriesWithCounts];

    res.json({ categories: allCategories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      message: 'Server error fetching categories' 
    });
  }
});

// @route   POST /api/categories
// @desc    Create a new category
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, color, icon } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({ 
        message: 'Category name is required' 
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({
      name,
      user: req.user._id
    });

    if (existingCategory) {
      return res.status(400).json({ 
        message: 'Category with this name already exists' 
      });
    }

    // Create category
    const category = new Category({
      name,
      color: color || getDefaultColor(name),
      icon: icon || getDefaultIcon(name),
      user: req.user._id
    });

    await category.save();

    // Get note count
    const noteCount = await Note.countDocuments({
      user: req.user._id,
      category: name
    });

    res.status(201).json({
      message: 'Category created successfully',
      category: {
        ...category.toObject(),
        noteCount
      }
    });
  } catch (error) {
    console.error('Create category error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Category with this name already exists' 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error creating category' 
    });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { name, color, icon } = req.body;

    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!category) {
      return res.status(404).json({ 
        message: 'Category not found' 
      });
    }

    const oldName = category.name;

    // Update fields
    if (name !== undefined) category.name = name;
    if (color !== undefined) category.color = color;
    if (icon !== undefined) category.icon = icon;

    await category.save();

    // Update all notes with the old category name if name changed
    if (name && name !== oldName) {
      await Note.updateMany(
        { user: req.user._id, category: oldName },
        { category: name }
      );
    }

    // Get note count
    const noteCount = await Note.countDocuments({
      user: req.user._id,
      category: category.name
    });

    res.json({
      message: 'Category updated successfully',
      category: {
        ...category.toObject(),
        noteCount
      }
    });
  } catch (error) {
    console.error('Update category error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Category with this name already exists' 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error updating category' 
    });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!category) {
      return res.status(404).json({ 
        message: 'Category not found' 
      });
    }

    // Move all notes in this category to 'Personal'
    await Note.updateMany(
      { user: req.user._id, category: category.name },
      { category: 'Personal' }
    );

    await Category.findByIdAndDelete(req.params.id);

    res.json({ 
      message: 'Category deleted successfully. Notes moved to Personal category.' 
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ 
      message: 'Server error deleting category' 
    });
  }
});

// Helper functions for default category properties
function getDefaultColor(categoryName) {
  const colorMap = {
    'Personal': '#3B82F6',
    'Work': '#EF4444',
    'Ideas': '#F59E0B',
    'Shopping': '#10B981',
    'Health': '#8B5CF6'
  };
  return colorMap[categoryName] || '#6B7280';
}

function getDefaultIcon(categoryName) {
  const iconMap = {
    'Personal': 'user',
    'Work': 'briefcase',
    'Ideas': 'lightbulb',
    'Shopping': 'shopping-cart',
    'Health': 'heart'
  };
  return iconMap[categoryName] || 'folder';
}

module.exports = router;