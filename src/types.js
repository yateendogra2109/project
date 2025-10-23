// Note types and categories
export const NOTE_TYPES = {
  SHORT: 'short',
  LONG: 'long'
};

export const DEFAULT_CATEGORIES = [
  'Personal',
  'Work',
  'Ideas',
  'Shopping',
  'Health',
  'Travel',
  'Education',
  'Finance'
];

// Note priority levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

// Utility functions for note management
export const createNote = (title, content, category = 'Personal', reminder = null) => {
  const noteType = content.length > 200 ? NOTE_TYPES.LONG : NOTE_TYPES.SHORT;
  
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    title: title || 'Untitled Note',
    content,
    category,
    type: noteType,
    reminder,
    priority: PRIORITY_LEVELS.MEDIUM,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isCompleted: false
  };
};

export const updateNote = (note, updates) => {
  const updatedNote = {
    ...note,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  // Recalculate note type if content changed
  if (updates.content !== undefined) {
    updatedNote.type = updates.content.length > 200 ? NOTE_TYPES.LONG : NOTE_TYPES.SHORT;
  }
  
  return updatedNote;
};