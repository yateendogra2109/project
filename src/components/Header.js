import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, BookOpen, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = ({ searchTerm, onSearchChange, onCreateNote }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

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
        
        <div className="user-menu" ref={menuRef}>
          <button 
            className="user-profile-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
            title="User menu"
          >
            <User size={20} />
            <span className="user-name">
              {user?.firstName || user?.username || 'User'}
            </span>
          </button>
          
          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-info">
                <div className="user-avatar">
                  <User size={24} />
                </div>
                <div className="user-details">
                  <div className="user-full-name">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user?.username || 'User'
                    }
                  </div>
                  <div className="user-email">{user?.email}</div>
                </div>
              </div>
              
              <div className="menu-divider"></div>
              
              <button className="menu-item" onClick={() => setShowUserMenu(false)}>
                <Settings size={16} />
                Settings
              </button>
              
              <button className="menu-item logout" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;