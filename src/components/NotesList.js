import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  FileText, 
  AlignLeft, 
  Trash2, 
  Clock, 
  Tag,
  Bell,
  AlertCircle
} from 'lucide-react';
import './NotesList.css';

const NotesList = ({ notes, selectedNote, onNoteSelect, onDeleteNote, viewMode }) => {
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Unknown';
    }
  };

  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const hasActiveReminder = (note) => {
    if (!note.reminder) return false;
    return new Date(note.reminder) > new Date();
  };

  const isOverdue = (note) => {
    if (!note.reminder) return false;
    return new Date(note.reminder) < new Date();
  };

  const getViewTitle = () => {
    switch (viewMode) {
      case 'short': return 'Short Notes';
      case 'long': return 'Long Notes';
      case 'recent': return 'Recent Notes';
      default: return 'All Notes';
    }
  };

  if (notes.length === 0) {
    return (
      <div className="notes-list">
        <div className="notes-header">
          <h2>{getViewTitle()}</h2>
          <span className="notes-count">0 notes</span>
        </div>
        <div className="empty-state">
          <FileText size={48} className="empty-icon" />
          <h3>No notes found</h3>
          <p>Create your first note to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-list">
      <div className="notes-header">
        <h2>{getViewTitle()}</h2>
        <span className="notes-count">{notes.length} note{notes.length !== 1 ? 's' : ''}</span>
      </div>
      
      <div className="notes-container">
        {notes.map(note => (
          <div
            key={note.id}
            className={`note-card ${selectedNote?.id === note.id ? 'selected' : ''}`}
            onClick={() => onNoteSelect(note)}
          >
            <div className="note-header">
              <div className="note-title-section">
                <div className="note-type-icon">
                  {note.type === 'long' ? <FileText size={16} /> : <AlignLeft size={16} />}
                </div>
                <h3 className="note-title">{note.title}</h3>
              </div>
              
              <div className="note-actions">
                {hasActiveReminder(note) && (
                  <div className="reminder-indicator active" title="Has active reminder">
                    <Bell size={14} />
                  </div>
                )}
                {isOverdue(note) && (
                  <div className="reminder-indicator overdue" title="Reminder overdue">
                    <AlertCircle size={14} />
                  </div>
                )}
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(note.id);
                  }}
                  title="Delete note"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            
            <div className="note-content">
              {truncateContent(note.content)}
            </div>
            
            <div className="note-meta">
              <div className="note-category">
                <Tag size={12} />
                {note.category}
              </div>
              <div className="note-date">
                <Clock size={12} />
                {formatDate(note.updatedAt)}
              </div>
            </div>
            
            {note.reminder && (
              <div className={`note-reminder ${isOverdue(note) ? 'overdue' : ''}`}>
                <Bell size={12} />
                Reminder: {new Date(note.reminder).toLocaleDateString()} at {new Date(note.reminder).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesList;