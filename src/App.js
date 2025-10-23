import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import RecentNotes from './components/RecentNotes';
import { createNote, updateNote, DEFAULT_CATEGORIES } from './types';
import { loadDemoData } from './demo-data';

function App() {
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('all'); // 'all', 'short', 'long', 'recent'

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    const savedCategories = localStorage.getItem('categories');
    
    // Load demo data if no notes exist
    loadDemoData();
    
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // Save categories to localStorage whenever categories change
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const handleCreateNote = (title, content, category, reminder) => {
    const newNote = createNote(title, content, category, reminder);
    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote);
    setIsEditing(true);
  };

  const handleUpdateNote = (noteId, updates) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? updateNote(note, updates) : note
    ));
    
    if (selectedNote && selectedNote.id === noteId) {
      setSelectedNote(prev => updateNote(prev, updates));
    }
  };

  const handleDeleteNote = (noteId) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNote && selectedNote.id === noteId) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  const handleAddCategory = (categoryName) => {
    if (!categories.includes(categoryName)) {
      setCategories(prev => [...prev, categoryName]);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    const matchesViewMode = viewMode === 'all' || 
                           (viewMode === 'short' && note.type === 'short') ||
                           (viewMode === 'long' && note.type === 'long') ||
                           (viewMode === 'recent' && isRecentNote(note));
    
    return matchesSearch && matchesCategory && matchesViewMode;
  });

  const isRecentNote = (note) => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return new Date(note.updatedAt) > threeDaysAgo;
  };

  const recentNotes = notes
    .filter(isRecentNote)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="app">
      <div className="container">
        <Header 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onCreateNote={() => setIsEditing(true)}
        />
        
        <div className="main-content">
          <Sidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            onAddCategory={handleAddCategory}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          
          <div className="content-area">
            {viewMode === 'recent' ? (
              <RecentNotes
                notes={recentNotes}
                onNoteSelect={setSelectedNote}
              />
            ) : (
              <NotesList
                notes={filteredNotes}
                selectedNote={selectedNote}
                onNoteSelect={setSelectedNote}
                onDeleteNote={handleDeleteNote}
                viewMode={viewMode}
              />
            )}
          </div>
          
          {(isEditing || selectedNote) && (
            <NoteEditor
              note={selectedNote}
              categories={categories}
              onSave={handleCreateNote}
              onUpdate={handleUpdateNote}
              onClose={() => {
                setIsEditing(false);
                setSelectedNote(null);
              }}
              isEditing={isEditing}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;