import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import RecentNotes from './components/RecentNotes';
import Auth from './components/Auth';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotesProvider, useNotes } from './contexts/NotesContext';
import { createNote, updateNote, DEFAULT_CATEGORIES } from './types';
import { loadDemoData } from './demo-data';

// Main App Content Component
function AppContent() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { 
    notes, 
    categories, 
    loading, 
    createNote: apiCreateNote, 
    updateNote: apiUpdateNote, 
    deleteNote: apiDeleteNote,
    createCategory: apiCreateCategory 
  } = useNotes();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('all'); // 'all', 'short', 'long', 'recent'

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <Auth />;
  }

  const handleCreateNote = async (title, content, category, reminder) => {
    const noteData = {
      title,
      content,
      category: category || 'Personal',
      reminder: reminder || null,
      tags: []
    };
    
    const result = await apiCreateNote(noteData);
    if (result.success) {
      setSelectedNote(result.note);
      setIsEditing(true);
    }
  };

  const handleUpdateNote = async (noteId, updates) => {
    const result = await apiUpdateNote(noteId, updates);
    if (result.success && selectedNote && selectedNote._id === noteId) {
      setSelectedNote(result.note);
    }
  };

  const handleDeleteNote = async (noteId) => {
    const result = await apiDeleteNote(noteId);
    if (result.success) {
      if (selectedNote && selectedNote._id === noteId) {
        setSelectedNote(null);
        setIsEditing(false);
      }
    }
  };

  const handleAddCategory = async (categoryName) => {
    const categoryExists = categories.some(cat => cat.name === categoryName);
    if (!categoryExists) {
      await apiCreateCategory({ name: categoryName });
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
    return new Date(note.updatedAt || note.createdAt) > threeDaysAgo;
  };

  const recentNotes = notes
    .filter(isRecentNote)
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
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
            categories={categories.map(cat => cat.name || cat)}
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
              categories={categories.map(cat => cat.name || cat)}
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

// Main App Component with Providers
function App() {
  return (
    <AuthProvider>
      <NotesProvider>
        <AppContent />
      </NotesProvider>
    </AuthProvider>
  );
}

export default App;