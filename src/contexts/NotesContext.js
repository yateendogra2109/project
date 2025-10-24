import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../utils/api';
import { useAuth } from './AuthContext';

const NotesContext = createContext();

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Load data when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadNotes();
      loadCategories();
    } else {
      // Clear data when user logs out
      setNotes([]);
      setCategories([]);
    }
  }, [isAuthenticated]);

  const loadNotes = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.getNotes(params);
      setNotes(response.notes || []);
      return response;
    } catch (error) {
      setError(error.message);
      console.error('Load notes error:', error);
      return { notes: [] };
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await ApiService.getCategories();
      setCategories(response.categories || []);
      return response.categories;
    } catch (error) {
      console.error('Load categories error:', error);
      return [];
    }
  };

  const createNote = async (noteData) => {
    try {
      setError(null);
      const response = await ApiService.createNote(noteData);
      
      // Add the new note to the beginning of the list
      setNotes(prev => [response.note, ...prev]);
      
      // Reload categories to update counts
      loadCategories();
      
      return { success: true, note: response.note };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const updateNote = async (id, noteData) => {
    try {
      setError(null);
      const response = await ApiService.updateNote(id, noteData);
      
      // Update the note in the list
      setNotes(prev => prev.map(note => 
        note._id === id ? response.note : note
      ));
      
      // Reload categories to update counts
      loadCategories();
      
      return { success: true, note: response.note };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const deleteNote = async (id) => {
    try {
      setError(null);
      await ApiService.deleteNote(id);
      
      // Remove the note from the list
      setNotes(prev => prev.filter(note => note._id !== id));
      
      // Reload categories to update counts
      loadCategories();
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const bulkDeleteNotes = async (noteIds) => {
    try {
      setError(null);
      const response = await ApiService.bulkDeleteNotes(noteIds);
      
      // Remove the notes from the list
      setNotes(prev => prev.filter(note => !noteIds.includes(note._id)));
      
      // Reload categories to update counts
      loadCategories();
      
      return { success: true, deletedCount: response.deletedCount };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const createCategory = async (categoryData) => {
    try {
      setError(null);
      const response = await ApiService.createCategory(categoryData);
      
      // Add the new category to the list
      setCategories(prev => [...prev, response.category]);
      
      return { success: true, category: response.category };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      setError(null);
      const response = await ApiService.updateCategory(id, categoryData);
      
      // Update the category in the list
      setCategories(prev => prev.map(category => 
        category._id === id ? response.category : category
      ));
      
      // Reload notes if category name changed
      if (categoryData.name) {
        loadNotes();
      }
      
      return { success: true, category: response.category };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const deleteCategory = async (id) => {
    try {
      setError(null);
      await ApiService.deleteCategory(id);
      
      // Remove the category from the list
      setCategories(prev => prev.filter(category => category._id !== id));
      
      // Reload notes and categories
      loadNotes();
      loadCategories();
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const getRecentNotes = async () => {
    try {
      const response = await ApiService.getRecentNotes();
      return response.notes || [];
    } catch (error) {
      console.error('Get recent notes error:', error);
      return [];
    }
  };

  const searchNotes = async (searchTerm, filters = {}) => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        ...filters
      };
      const response = await ApiService.getNotes(params);
      return response.notes || [];
    } catch (error) {
      console.error('Search notes error:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    notes,
    categories,
    loading,
    error,
    loadNotes,
    loadCategories,
    createNote,
    updateNote,
    deleteNote,
    bulkDeleteNotes,
    createCategory,
    updateCategory,
    deleteCategory,
    getRecentNotes,
    searchNotes,
    clearError
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};