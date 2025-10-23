import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Clock, 
  FileText, 
  AlignLeft, 
  Tag, 
  Bell,
  TrendingUp,
  Calendar
} from 'lucide-react';
import './RecentNotes.css';

const RecentNotes = ({ notes, onNoteSelect }) => {
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Unknown';
    }
  };

  const truncateContent = (content, maxLength = 80) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const hasActiveReminder = (note) => {
    if (!note.reminder) return false;
    return new Date(note.reminder) > new Date();
  };

  const getActivityType = (note) => {
    const now = new Date();
    const noteDate = new Date(note.updatedAt);
    const hoursDiff = (now - noteDate) / (1000 * 60 * 60);
    
    if (hoursDiff < 1) return 'Just now';
    if (hoursDiff < 24) return 'Today';
    if (hoursDiff < 48) return 'Yesterday';
    return 'This week';
  };

  const groupNotesByActivity = (notes) => {
    const groups = {
      'Just now': [],
      'Today': [],
      'Yesterday': [],
      'This week': []
    };

    notes.forEach(note => {
      const activityType = getActivityType(note);
      if (groups[activityType]) {
        groups[activityType].push(note);
      }
    });

    return Object.entries(groups).filter(([_, notes]) => notes.length > 0);
  };

  const groupedNotes = groupNotesByActivity(notes);

  if (notes.length === 0) {
    return (
      <div className="recent-notes">
        <div className="recent-header">
          <div className="header-content">
            <TrendingUp size={24} />
            <h2>Recent Activity</h2>
          </div>
        </div>
        <div className="empty-recent">
          <Clock size={48} className="empty-icon" />
          <h3>No recent activity</h3>
          <p>Notes you create or edit will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-notes">
      <div className="recent-header">
        <div className="header-content">
          <TrendingUp size={24} />
          <h2>Recent Activity</h2>
        </div>
        <div className="activity-count">
          {notes.length} recent note{notes.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="recent-content">
        {groupedNotes.map(([timeGroup, groupNotes]) => (
          <div key={timeGroup} className="activity-group">
            <div className="group-header">
              <Calendar size={16} />
              <h3>{timeGroup}</h3>
              <span className="group-count">{groupNotes.length}</span>
            </div>
            
            <div className="notes-timeline">
              {groupNotes.map(note => (
                <div
                  key={note.id}
                  className="timeline-item"
                  onClick={() => onNoteSelect(note)}
                >
                  <div className="timeline-marker">
                    <div className="marker-dot"></div>
                  </div>
                  
                  <div className="timeline-content">
                    <div className="note-summary">
                      <div className="note-header-info">
                        <div className="note-type-badge">
                          {note.type === 'long' ? (
                            <><FileText size={12} /> Long</>
                          ) : (
                            <><AlignLeft size={12} /> Short</>
                          )}
                        </div>
                        <h4 className="note-title">{note.title}</h4>
                        {hasActiveReminder(note) && (
                          <div className="reminder-badge">
                            <Bell size={12} />
                          </div>
                        )}
                      </div>
                      
                      <div className="note-preview">
                        {truncateContent(note.content)}
                      </div>
                      
                      <div className="note-details">
                        <div className="category-tag">
                          <Tag size={10} />
                          {note.category}
                        </div>
                        <div className="update-time">
                          <Clock size={10} />
                          {formatDate(note.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentNotes;