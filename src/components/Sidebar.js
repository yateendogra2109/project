import React, { useState } from 'react';
import { 
  FileText, 
  AlignLeft, 
  Clock, 
  Plus, 
  Tag,
  Filter,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  onAddCategory, 
  viewMode, 
  onViewModeChange 
}) => {
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showCategories, setShowCategories] = useState(true);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
      setShowAddCategory(false);
    }
  };

  const viewModes = [
    { key: 'all', label: 'All Notes', icon: FileText },
    { key: 'short', label: 'Short Notes', icon: AlignLeft },
    { key: 'long', label: 'Long Notes', icon: FileText },
    { key: 'recent', label: 'Recent', icon: Clock }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">
          <Filter size={18} />
          View
        </h3>
        <ul className="sidebar-list">
          {viewModes.map(mode => {
            const Icon = mode.icon;
            return (
              <li key={mode.key}>
                <button
                  className={`sidebar-item ${viewMode === mode.key ? 'active' : ''}`}
                  onClick={() => onViewModeChange(mode.key)}
                >
                  <Icon size={16} />
                  {mode.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sidebar-section">
        <div 
          className="sidebar-title clickable"
          onClick={() => setShowCategories(!showCategories)}
        >
          <div className="title-content">
            <Tag size={18} />
            Categories
          </div>
          {showCategories ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
        
        {showCategories && (
          <>
            <ul className="sidebar-list">
              <li>
                <button
                  className={`sidebar-item ${selectedCategory === 'All' ? 'active' : ''}`}
                  onClick={() => onCategorySelect('All')}
                >
                  <FileText size={16} />
                  All Categories
                </button>
              </li>
              {categories.map(category => (
                <li key={category}>
                  <button
                    className={`sidebar-item ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => onCategorySelect(category)}
                  >
                    <Tag size={16} />
                    {category}
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="add-category">
              {showAddCategory ? (
                <form onSubmit={handleAddCategory} className="add-category-form">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Category name"
                    className="category-input"
                    autoFocus
                  />
                  <div className="form-actions">
                    <button type="submit" className="btn-save">Add</button>
                    <button 
                      type="button" 
                      className="btn-cancel"
                      onClick={() => {
                        setShowAddCategory(false);
                        setNewCategory('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  className="add-category-btn"
                  onClick={() => setShowAddCategory(true)}
                >
                  <Plus size={16} />
                  Add Category
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;