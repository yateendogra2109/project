import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Bell, 
  Calendar, 
  Type,
  AlignLeft,
  FileText,
  Clock
} from 'lucide-react';
import './NoteEditor.css';

const NoteEditor = ({ 
  note, 
  categories, 
  onSave, 
  onUpdate, 
  onClose, 
  isEditing 
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Personal');
  const [reminder, setReminder] = useState('');
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setCategory(note.category || 'Personal');
      setReminder(note.reminder ? new Date(note.reminder).toISOString().slice(0, 16) : '');
    } else {
      setTitle('');
      setContent('');
      setCategory('Personal');
      setReminder('');
    }
    setIsModified(false);
  }, [note]);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setIsModified(true);
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;

    const noteData = {
      title: title.trim() || 'Untitled Note',
      content: content.trim(),
      category,
      reminder: reminder ? new Date(reminder).toISOString() : null
    };

    if (note) {
      onUpdate(note._id, noteData);
    } else {
      onSave(noteData.title, noteData.content, noteData.category, noteData.reminder);
    }
    
    setIsModified(false);
  };

  const handleClose = () => {
    if (isModified) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const getNoteType = () => {
    return content.length > 200 ? 'long' : 'short';
  };

  const formatReminderDate = () => {
    if (!reminder) return null;
    const date = new Date(reminder);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isReminderOverdue = () => {
    if (!reminder) return false;
    return new Date(reminder) < new Date();
  };

  return (
    <div className="note-editor">
      <div className="editor-header">
        <div className="editor-title">
          <Type size={20} />
          {note ? 'Edit Note' : 'New Note'}
        </div>
        <button className="close-btn" onClick={handleClose}>
          <X size={20} />
        </button>
      </div>

      <div className="editor-content">
        <div className="form-group">
          <label htmlFor="note-title">Title</label>
          <input
            id="note-title"
            type="text"
            value={title}
            onChange={handleInputChange(setTitle)}
            placeholder="Enter note title..."
            className="title-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="note-category">Category</label>
          <select
            id="note-category"
            value={category}
            onChange={handleInputChange(setCategory)}
            className="category-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="note-reminder">Reminder</label>
          <div className="reminder-input-group">
            <Calendar size={16} className="input-icon" />
            <input
              id="note-reminder"
              type="datetime-local"
              value={reminder}
              onChange={handleInputChange(setReminder)}
              className="reminder-input"
              min={new Date().toISOString().slice(0, 16)}
            />
            {reminder && (
              <button
                type="button"
                className="clear-reminder"
                onClick={() => {
                  setReminder('');
                  setIsModified(true);
                }}
                title="Clear reminder"
              >
                <X size={14} />
              </button>
            )}
          </div>
          {reminder && (
            <div className={`reminder-preview ${isReminderOverdue() ? 'overdue' : ''}`}>
              <Bell size={12} />
              {isReminderOverdue() ? 'Overdue: ' : 'Scheduled: '}
              {formatReminderDate()}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="note-content">Content</label>
          <div className="content-header">
            <div className="note-type-indicator">
              {getNoteType() === 'long' ? (
                <><FileText size={14} /> Long Note</>
              ) : (
                <><AlignLeft size={14} /> Short Note</>
              )}
            </div>
            <div className="character-count">
              {content.length} characters
            </div>
          </div>
          <textarea
            id="note-content"
            value={content}
            onChange={handleInputChange(setContent)}
            placeholder="Start writing your note..."
            className="content-textarea"
            rows={12}
          />
        </div>

        {note && (
          <div className="note-metadata">
            <div className="metadata-item">
              <Clock size={14} />
              Created: {new Date(note.createdAt).toLocaleDateString()}
            </div>
            <div className="metadata-item">
              <Clock size={14} />
              Updated: {new Date(note.updatedAt).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>

      <div className="editor-footer">
        <button
          className="save-btn"
          onClick={handleSave}
          disabled={!title.trim() && !content.trim()}
        >
          <Save size={16} />
          {note ? 'Update Note' : 'Save Note'}
        </button>
        <button className="cancel-btn" onClick={handleClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NoteEditor;