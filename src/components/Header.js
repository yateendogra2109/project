import React from 'react';
import { Search, Plus, BookOpen } from 'lucide-react';
import './Header.css';

const Header = ({ searchTerm, onSearchChange, onCreateNote }) => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <BookOpen size={28} />
          <h1>Notes App</h1>
        </div>
      </div>
      
      <div className="header-center">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      <div className="header-right">
        <button 
          className="create-note-btn"
          onClick={onCreateNote}
          title="Create new note"
        >
          <Plus size={20} />
          New Note
        </button>
      </div>
    </header>
  );
};

export default Header;